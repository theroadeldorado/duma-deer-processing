# Changelog: Claude Branch

This document tracks all changes made in the `claude` branch.

---

## Uncommitted Changes

### Admin Edit Page - Pricing Protection & Controls
**File:** `pages/admin/deers/[id]/edit.tsx`

**Problem Solved:** Previously, editing an existing order would recalculate prices using current pricing, corrupting historical pricing data.

**Changes:**
- Added pricing comparison UI showing original vs current prices when they differ
- Added three pricing modes for existing orders:
  - **Keep Original Price** (default) - preserves price from submission time
  - **Update to Current Price** - explicitly recalculates with today's rates
  - **Manual Override** - allows admin to enter any custom price
- Historical pricing data (`historicalItemPrices`, `pricingSnapshot`) now preserved by default
- Balance calculation respects selected pricing mode

---

## Committed Changes

### Commit: 685bae1
**Address Validation Enhancement**

**File:** `lib/zod.ts`

Added validation to prevent users from entering email addresses in the address field:
```typescript
address: z.string().min(1, 'Address is required').refine(
  (val) => !val.includes('@'),
  'Please enter your home address, not your email address'
),
```

---

### Commit: fe96fbf
**Schema Generation & Admin Components Enhancement**

**Files Changed:**
- `lib/schemaHelpers.ts` (new)
- `lib/csv.ts`
- `components/admin/FormSection.tsx` (new)
- `components/admin/SpecialtyMeatsAdminSection.tsx` (new)

**Changes:**
- Created `schemaHelpers.ts` for auto-generating Zod and Mongoose schemas from `productsConfig`
- Created reusable `FormSection` component for consistent admin form styling
- Created `SpecialtyMeatsAdminSection` to dynamically render specialty meats from config
- Enhanced CSV export to auto-generate fields from `productsConfig`
- Reduced code duplication - adding new fields now requires fewer file changes

---

### Commit: 614dfa9
**Form Value Utilities Refactor**

**Files Changed:**
- `lib/formValueUtils.ts` (new)
- `components/PrintDeerDetails.tsx`
- `components/Summary.tsx`

**Changes:**
- Created centralized `formValueUtils.ts` for grouping and processing form values
- Consolidated pricing display logic shared between PrintDeerDetails and Summary
- Improved code maintainability by eliminating duplicate logic

---

### Commit: c9bbed9
**Price Utility Functions & Dynamic Pricing Display**

**Files Changed:**
- `lib/priceUtils.ts` (new)
- `components/checkin-steps/CapeHideOptions.tsx`
- `pages/admin/deers/[id]/edit.tsx`

**Changes:**
- Created `priceUtils.ts` with helper functions for price formatting and dropdown options
- Added `useMemo` for performance optimization in CapeHideOptions
- Dropdown options now show current prices from `productsConfig`
- Functions added:
  - `formatPrice()` - consistent price formatting
  - `buildLabelWithPrice()` - label + price construction
  - `getCapeDropdownOptions()`, `getHideDropdownOptions()`, `getEuroMountDropdownOptions()`
  - `getSkinnedOrBonelessOptions()`, `getGroundVenisonOptions()`, `getHindLegPreferenceOptions()`

---

### Commit: 3391897
**Typo Fix**

**File:** `lib/products.ts`

Fixed typo: "Breakfast Linkss" → "Breakfast Links"

---

### Commit: 4a72ad0
**Code Cleanup & Agent Description Update**

**Files Changed:**
- `.claude/agents/react-typescript-mongodb-expert.md`
- `components/CheckInForm.tsx` (deleted)
- `components/SpecialtyMeat.tsx`
- `components/Summary.tsx`
- `pages/admin/deers/DeerTableRow.tsx`
- `pages/admin/deers/[id]/edit.tsx`

**Changes:**
- Updated agent description with implementation examples
- Removed unused `CheckInForm.tsx` component
- Cleaned up unused code in SpecialtyMeat and Summary components
- Removed console.log statements from DeerTableRow and EditDeer
- Improved type handling in price calculations

---

### Commit: 8ac43d4
**React TypeScript MongoDB Expert Agent**

**File:** `.claude/agents/react-typescript-mongodb-expert.md` (new)

Created specialized Claude agent with:
- Project architecture documentation
- Coding standards for the project
- Common task patterns
- Feature implementation guidance

---

## Summary of All Files Changed

| File | Status | Description |
|------|--------|-------------|
| `.claude/agents/react-typescript-mongodb-expert.md` | Added | Claude agent for project guidance |
| `CLAUDE.md` | Modified | Project instructions |
| `components/CheckInForm.tsx` | Deleted | Removed unused component |
| `components/PrintDeerDetails.tsx` | Modified | Uses formValueUtils |
| `components/SpecialtyMeat.tsx` | Modified | Code cleanup |
| `components/Summary.tsx` | Modified | Uses formValueUtils |
| `components/admin/FormSection.tsx` | Added | Reusable form section component |
| `components/admin/SpecialtyMeatsAdminSection.tsx` | Added | Data-driven specialty meats |
| `components/checkin-steps/CapeHideOptions.tsx` | Modified | Dynamic pricing display |
| `components/checkin-steps/Summary.tsx` | Modified | Pricing improvements |
| `lib/csv.ts` | Modified | Auto-generate fields from config |
| `lib/email.ts` | Modified | Minor updates |
| `lib/formValueUtils.ts` | Added | Centralized form value processing |
| `lib/priceCalculations.ts` | Modified | Enhanced pricing functions |
| `lib/priceUtils.ts` | Added | Price formatting utilities |
| `lib/products.ts` | Modified | Typo fix, exported types |
| `lib/schemaHelpers.ts` | Added | Schema generation from config |
| `lib/types.ts` | Modified | Enhanced DeerT documentation |
| `lib/zod.ts` | Modified | Auto-generate fields, address validation |
| `models/Deer.ts` | Modified | Auto-generate fields from config |
| `pages/admin/deers/DeerTableRow.tsx` | Modified | Console.log cleanup |
| `pages/admin/deers/[id]/edit.tsx` | Modified | Pricing controls, dynamic dropdowns |
| `pages/api/deers/[id]/update.ts` | Modified | Minor updates |
| `pages/api/deers/add.ts` | Modified | Minor updates |

---

## Key Improvements

### 1. Reduced Code Duplication
Adding a new product field now only requires updating `lib/products.ts`. Zod and Mongoose schemas auto-generate.

### 2. Historical Pricing Protection
Orders now preserve their original pricing when edited, preventing data corruption from price changes.

### 3. Dynamic Pricing Display
All dropdowns and forms show current prices from `productsConfig`, ensuring consistency.

### 4. Admin Pricing Controls
Admins can now choose to keep original prices, update to current prices, or manually override.

### 5. Better Validation
Address field now rejects email addresses with a helpful error message.

---

## Known Issues / Future Improvements

### From Code Review
1. **Accessibility**: CapeHideOptions custom radio buttons need `aria-label` and `role="radio"` attributes
2. **Focus States**: Custom buttons need explicit `focus:ring` styling
3. **Label Transformation**: SpecialtyMeatsAdminSection has hardcoded label mappings that could get out of sync

### Suggested Enhancements
1. Add unit tests for `formValueUtils.ts` and `priceUtils.ts`
2. Consider storing `shortLabel` in `productsConfig` for specialty meats
3. Add keyboard navigation for custom radio buttons in CapeHideOptions
