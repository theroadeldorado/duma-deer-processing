#!/usr/bin/env node

/**
 * Migration script to add historical pricing data to existing deer entries
 * This ensures old entries display correct pricing instead of current pricing
 */

const { MongoClient } = require('mongodb');

// MongoDB connection - update this if your connection string is different
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/your-database-name';

// Define the COMPLETE historical pricing that was in effect when entries were created
// This includes ALL items from products.ts, not just cape/hide/euroMount
const COMPLETE_HISTORICAL_PRICING = {
  // Cape/Hide/Euro options
  cape: {
    'Cape for shoulder mount': 50,
    'Shoulder mount': 111, // This was $111 before the change to $850
  },
  hide: {
    'Save Hide': 15,
    'Tanned Hair on': 200,
  },
  euroMount: {
    'Boiled finished mount': 145,
    'Beetles finished mount': 175,
  },

  // Processing options
  skinnedOrBoneless: {
    'Skinned, Cut, Ground, Vacuum packed': 110,
    Boneless: 0,
    Donation: 0,
  },

  // Regular cutting options
  tenderizedCubedSteaks: {
    true: 5, // Current price - change this if you update it
  },

  // Hind leg options
  hindLegPreference1: {
    'Whole Muscle Jerky': 35,
  },
  hindLegPreference2: {
    'Whole Muscle Jerky': 35,
  },

  // Ground venison options
  groundVenison: {
    'Add Beef Trim': 5,
    'Add Pork Trim': 5,
    'Add Beef & Pork Trim': 10,
  },

  // Specialty meats (all prices per 5lb)
  specialtyMeats: {
    'Trail Bologna': {
      trailBolognaRegular: 15,
      trailBolognaCheddarCheese: 20,
      trailBolognaHotPepperJackCheese: 20,
    },
    'Garlic Ring Bologna': {
      garlicRingBologna: 20,
    },
    'Summer Sausage': {
      summerSausageMild: 15,
      summerSausageHot: 15,
    },
    'Smoked Kielbasa Sausage': {
      smokedKielbasaSausage: 17.5,
    },
    'Italian Sausage Links': {
      italianSausageLinksMild: 15,
      italianSausageLinksHot: 15,
    },
    'Country Breakfast Sausage': {
      countryBreakfastSausage: 15,
    },
    'Breakfast Links': {
      babyLinksCountry: 20,
      babyLinksMaple: 20,
    },
    'Snack Sticks': {
      snackSticksRegular: 25,
      snackSticksCheddarCheese: 30,
      snackSticksHotPepperJackCheese: 30,
      snackSticksHotHotPepperJackCheese: 30,
      snackSticksHoneyBBQ: 30,
    },
    'Hot Dogs': {
      hotDogsRegular: 17.5,
      hotDogsCheddarCheese: 22.5,
      hotDogsHotPepperJackCheese: 22.5,
    },
    'Jerky Restructured': {
      jerkyRestructuredHot: 35,
      jerkyRestructuredMild: 35,
      jerkyRestructuredTeriyaki: 35,
    },
  },
};

/**
 * Calculate what the capeHideTotal should have been with historical pricing
 */
function calculateHistoricalCapeHideTotal(entry) {
  let total = 0;

  // Add cape pricing
  if (entry.cape && entry.cape !== '') {
    const capePrice = COMPLETE_HISTORICAL_PRICING.cape[entry.cape];
    if (capePrice && entry.cape !== 'Cape for shoulder mount') {
      // Exclude "Take Today" options
      total += capePrice;
    }
  }

  // Add hide pricing
  if (entry.hide && entry.hide !== '') {
    const hidePrice = COMPLETE_HISTORICAL_PRICING.hide[entry.hide];
    if (hidePrice && entry.hide !== 'Save Hide') {
      // Exclude "Take Today" options
      total += hidePrice;
    }
  }

  // Add euro mount pricing
  if (entry.euroMount && entry.euroMount !== '' && entry.euroMount !== 'false' && entry.euroMount !== 'Keep head') {
    const euroPrice = COMPLETE_HISTORICAL_PRICING.euroMount[entry.euroMount];
    if (euroPrice) {
      total += euroPrice;
    }
  }

  return total;
}

/**
 * Build comprehensive historical item prices map with ALL pricing that was in effect
 */
function buildHistoricalItemPrices(entry) {
  const historicalPrices = {};

  // Process all regular product options
  for (const [key, prices] of Object.entries(COMPLETE_HISTORICAL_PRICING)) {
    if (key === 'specialtyMeats') continue; // Handle separately

    if (entry[key] && entry[key] !== '' && entry[key] !== 'false') {
      const price = prices[entry[key]];
      if (price !== undefined && price > 0) {
        historicalPrices[key] = price;
      }
    }
  }

  // Process specialty meats
  const specialtyMeats = COMPLETE_HISTORICAL_PRICING.specialtyMeats;
  for (const [meatName, meatPrices] of Object.entries(specialtyMeats)) {
    for (const [optionKey, price] of Object.entries(meatPrices)) {
      if (entry[optionKey] && entry[optionKey] !== '' && entry[optionKey] !== 'false') {
        if (price > 0) {
          historicalPrices[optionKey] = price;
        }
      }
    }
  }

  return historicalPrices;
}

/**
 * Build complete pricing snapshot for comprehensive historical reference
 */
function buildCompletePricingSnapshot() {
  // Return a deep copy of the complete historical pricing structure
  return JSON.parse(JSON.stringify(COMPLETE_HISTORICAL_PRICING));
}

/**
 * Main migration function
 */
async function migrateHistoricalPricing() {
  console.log('🔄 Starting historical pricing migration...\n');

  if (!MONGODB_URI || MONGODB_URI.includes('your-database-name')) {
    console.log('❌ Please set your MONGODB_URI environment variable or update the connection string in the script');
    console.log('   Current: ' + MONGODB_URI);
    console.log('   You can find your connection string in your .env file or deployment settings');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const deersCollection = db.collection('deer');

    // Find all deer entries that don't have historical pricing data
    const entriesToMigrate = await deersCollection
      .find({
        $or: [
          { capeHideTotal: { $exists: false } },
          { capeHideTotal: null },
          { historicalItemPrices: { $exists: false } },
          { historicalItemPrices: null },
        ],
      })
      .toArray();

    console.log(`📊 Found ${entriesToMigrate.length} entries that need migration`);

    if (entriesToMigrate.length === 0) {
      console.log('✅ No entries need migration. All entries already have historical pricing data.');
      return;
    }

    let migratedCount = 0;
    let skippedCount = 0;

    for (const entry of entriesToMigrate) {
      const historicalCapeHideTotal = calculateHistoricalCapeHideTotal(entry);
      const historicalItemPrices = buildHistoricalItemPrices(entry);

      // Only migrate if there are ANY pricing services (not just cape/hide/euro)
      if (historicalCapeHideTotal > 0 || Object.keys(historicalItemPrices).length > 0) {
        await deersCollection.updateOne(
          { _id: entry._id },
          {
            $set: {
              capeHideTotal: historicalCapeHideTotal,
              historicalItemPrices: historicalItemPrices,
              pricingSnapshot: buildCompletePricingSnapshot(),
            },
          }
        );

        console.log(`✅ Migrated: ${entry._id} - Total: $${historicalCapeHideTotal}, Items: ${Object.keys(historicalItemPrices).join(', ')}`);
        migratedCount++;
      } else {
        console.log(`⏭️  Skipped: ${entry._id} - No pricing services`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`   ✅ Migrated: ${migratedCount} entries`);
    console.log(`   ⏭️  Skipped: ${skippedCount} entries (no pricing services)`);
    console.log(`\nHistorical pricing has been preserved for all existing entries!`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the migration
migrateHistoricalPricing();
