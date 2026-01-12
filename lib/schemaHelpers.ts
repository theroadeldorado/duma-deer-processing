/**
 * Schema Generation Helpers
 *
 * This module provides utilities to generate Zod schemas and Mongoose field definitions
 * from the productsConfig, reducing duplication when adding new form fields.
 *
 * ADDING A NEW FIELD:
 * 1. Add the field to productsConfig in lib/products.ts with appropriate fieldType
 * 2. That's it! The Zod schema and Mongoose schema will auto-generate
 *
 * For special fields (non-standard types, custom validation), add them to:
 * - manualZodFields in lib/zod.ts
 * - manualMongooseFields in models/Deer.ts
 */

import { z } from 'zod';
import { productsConfig, Product, SpecialtyMeatsConfig, ProductOption } from './products';

// Field type definitions that can be used in productsConfig
export type FieldType = 'string' | 'number' | 'boolean' | 'stringOrNumber' | 'date';

/**
 * Determines if a config entry is a Product (vs SpecialtyMeatsConfig)
 */
export function isProduct(config: Product | SpecialtyMeatsConfig): config is Product {
  return 'type' in config || 'label' in config;
}

/**
 * Determines if a config entry is a SpecialtyMeatsConfig
 */
export function isSpecialtyMeatsConfig(config: Product | SpecialtyMeatsConfig): config is SpecialtyMeatsConfig {
  return 'meats' in config;
}

/**
 * Extracts all field names from productsConfig, including specialty meat option names
 */
export function getAllFieldNamesFromConfig(): string[] {
  const fieldNames: string[] = [];

  for (const [key, config] of Object.entries(productsConfig)) {
    if (isSpecialtyMeatsConfig(config)) {
      // Extract specialty meat option names
      for (const meat of config.meats) {
        for (const option of meat.options) {
          if (option.name) {
            fieldNames.push(option.name);
          }
        }
      }
    } else if (isProduct(config)) {
      fieldNames.push(key);
    }
  }

  return fieldNames;
}

/**
 * Gets the field type for a productsConfig entry
 * Returns the explicit fieldType if set, otherwise infers from the config
 */
export function getFieldTypeForProduct(product: Product): FieldType {
  // If fieldType is explicitly set, use it
  if (product.fieldType) {
    return product.fieldType as FieldType;
  }

  // Infer from product type
  switch (product.type) {
    case 'number':
      return 'number';
    case 'checkbox':
      return 'boolean';
    default:
      return 'string';
  }
}

/**
 * Generates Zod schema fields from productsConfig
 * Returns an object that can be spread into a z.object() call
 */
export function generateZodFieldsFromConfig(): Record<string, z.ZodTypeAny> {
  const fields: Record<string, z.ZodTypeAny> = {};

  for (const [key, config] of Object.entries(productsConfig)) {
    if (isSpecialtyMeatsConfig(config)) {
      // Specialty meats - all are optional string/number fields
      for (const meat of config.meats) {
        for (const option of meat.options) {
          if (option.name) {
            // Specialty meat quantities can be string or any (to handle various input formats)
            fields[option.name] = z.any().optional();
          }
        }
      }
      // Add notes field for the specialty meat category if it follows naming convention
      // Notes are handled separately in productsConfig
    } else if (isProduct(config)) {
      const fieldType = getFieldTypeForProduct(config);
      const isRequired = config.required === true;

      let zodType: z.ZodTypeAny;

      switch (fieldType) {
        case 'number':
          zodType = z.union([z.number(), z.string().transform((val) => (val === '' ? undefined : Number(val)))]);
          break;
        case 'boolean':
          zodType = z.union([z.boolean(), z.string()]);
          break;
        case 'stringOrNumber':
          zodType = z.union([z.string(), z.number()]);
          break;
        case 'date':
          zodType = z.string();
          break;
        case 'string':
        default:
          if (isRequired) {
            zodType = z.string().min(1, `${config.label || key} is required`);
          } else {
            zodType = z.string();
          }
          break;
      }

      // Make optional unless explicitly required
      if (!isRequired) {
        zodType = zodType.optional();
      }

      fields[key] = zodType;
    }
  }

  return fields;
}

/**
 * Generates Mongoose field definitions from productsConfig
 * Returns an object that can be spread into a Schema definition
 */
export function generateMongooseFieldsFromConfig(): Record<string, { type: any; required?: boolean }> {
  const fields: Record<string, { type: any; required?: boolean }> = {};

  for (const [key, config] of Object.entries(productsConfig)) {
    if (isSpecialtyMeatsConfig(config)) {
      // Specialty meats - all are optional String fields
      for (const meat of config.meats) {
        for (const option of meat.options) {
          if (option.name) {
            fields[option.name] = { type: String };
          }
        }
      }
    } else if (isProduct(config)) {
      const fieldType = getFieldTypeForProduct(config);
      const isRequired = config.required === true;

      let mongooseType: any = String;

      switch (fieldType) {
        case 'number':
          mongooseType = Number;
          break;
        case 'boolean':
          // Store as String for flexibility (form inputs often send string "true"/"false")
          mongooseType = String;
          break;
        case 'stringOrNumber':
        case 'date':
        case 'string':
        default:
          mongooseType = String;
          break;
      }

      const fieldDef: { type: any; required?: boolean } = { type: mongooseType };
      if (isRequired) {
        fieldDef.required = true;
      }

      fields[key] = fieldDef;
    }
  }

  return fields;
}

/**
 * Gets all specialty meat field names from productsConfig
 */
export function getSpecialtyMeatFieldNames(): string[] {
  const fieldNames: string[] = [];
  const specialtyMeats = productsConfig.specialtyMeats;

  if (isSpecialtyMeatsConfig(specialtyMeats)) {
    for (const meat of specialtyMeats.meats) {
      for (const option of meat.options) {
        if (option.name) {
          fieldNames.push(option.name);
        }
      }
    }
  }

  return fieldNames;
}

/**
 * Gets all notes field names from productsConfig
 */
export function getNotesFieldNames(): string[] {
  const fieldNames: string[] = [];

  for (const [key, config] of Object.entries(productsConfig)) {
    if (isProduct(config) && config.notes === true) {
      fieldNames.push(key);
    }
  }

  return fieldNames;
}
