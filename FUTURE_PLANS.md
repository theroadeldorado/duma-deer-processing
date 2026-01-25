# Future Plans

This document tracks planned features and improvements for the deer processing application.

---

## Admin Tools

### Customer Management (`/admin/customers`)

**Priority:** Medium
**Complexity:** Medium

Build an admin page to manage customer records across orders.

**Features:**
- View all unique customers (aggregated from orders)
- Detect potential duplicates automatically:
  - Same phone, different names (e.g., "Charles" vs "Chuck")
  - Similar addresses with slight variations
  - Same name, different phone formats
- Merge duplicate customer records:
  - Select which customer info to keep
  - Update all associated orders with consistent info
- Edit customer info across all their orders:
  - Update name, phone, address in one place
  - Changes propagate to all historical orders
- Customer order history view

**Technical Notes:**
- Currently, customer info is stored directly on each Deer order (no separate Customer collection)
- Merging would update the `name`, `phone`, `address`, etc. fields on all matching orders
- Consider adding a `customerId` field to orders for better linking in the future

---

## Data Quality

### Nickname Mapping

**Priority:** Low
**Complexity:** Low

Add common nickname mappings to improve customer deduplication.

**Examples:**
- Chuck → Charles
- Bill → William
- Bob → Robert
- Mike → Michael
- Jim → James
- Dick → Richard
- etc.

Could be used in the customer lookup to suggest potential matches.

---

## E2E Testing

### Test Suite Improvements

**Priority:** Low
**Complexity:** Medium

Current state: 95 tests, ~52 passing with parallel execution due to state interference.

**Needed:**
- Fix parallel execution issues (tests interfere with each other)
- Add test database isolation (separate test DB or transactions)
- Reduce test execution time
- Add CI/CD integration

---

## Notes

_Add new feature ideas above with priority, complexity, and description._
