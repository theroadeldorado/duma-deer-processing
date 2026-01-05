# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Build for production
npm run lint         # Run ESLint
npm run create-admin # Create admin user (interactive prompt)
```

## Architecture Overview

This is a Next.js 13 (Pages Router) deer processing management system with MongoDB and Firebase Auth.

### Core Data Flow

1. **Customer Check-in Form** (`components/checkin-steps/FormWizard.tsx`) - Multi-step wizard that collects deer processing preferences
2. **Price Calculation** (`lib/priceCalculations.ts`) - Calculates order totals based on `lib/products.ts` configuration
3. **Order Storage** - API routes (`pages/api/deers/`) persist to MongoDB via Mongoose models (`models/Deer.ts`)
4. **Admin Management** - Protected admin pages (`pages/admin/`) for order management

### Key Patterns

**Product Configuration**: All processing options and pricing defined in `lib/products.ts` as `productsConfig`. This single source of truth drives both form rendering and price calculations.

**Historical Pricing**: Orders store `historicalItemPrices` and `pricingSnapshot` to preserve prices at order time. Use `getItemPriceForDisplay()` and `getCapeHideTotalForDisplay()` from `lib/priceCalculations.ts` when displaying prices for existing orders.

**API Security**: All protected API routes use `secureApi()` wrapper from `lib/secureApi.ts`:
```typescript
export default secureApi(async (req, res, session) => {
  // session contains user info
}, true); // true = require admin
```

**Form Wizard Step Skipping**: `FormWizard.tsx` conditionally skips steps based on:
- `deerType === 'Boneless'` - skips Processing Type
- `processingType === 'Donation'` - skips all processing detail steps
- `quickOption === 'Grind Everything'` - skips cutting preferences

### Type Definitions

- `DeerT` - Main deer order type (`lib/types.ts`)
- `ProductsConfig` - Product/pricing configuration type (`lib/products.ts`)

### Authentication

Firebase Auth with session cookies verified via `lib/firebaseAdmin.ts`. Role-based access uses `RoleType.ADMIN` from `lib/enums.ts`.

## Important Files

- `lib/products.ts` - Product options and pricing configuration
- `lib/priceCalculations.ts` - All pricing logic
- `lib/types.ts` - TypeScript type definitions
- `models/Deer.ts` - Mongoose schema for deer orders
- `components/checkin-steps/` - Multi-step check-in form components
