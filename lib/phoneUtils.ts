/**
 * Phone number utilities for customer lookup
 */

/**
 * Normalizes a phone number to 10 digits by stripping all non-digit characters
 * and removing the country code if present.
 *
 * @example
 * normalizePhone('(555) 123-4567') // '5551234567'
 * normalizePhone('1-555-123-4567') // '5551234567'
 * normalizePhone('+1 555 123 4567') // '5551234567'
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Remove leading '1' if the number is 11 digits (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }

  return digits;
}

/**
 * Creates a MongoDB regex pattern for flexible phone matching.
 * This allows matching phone numbers stored in various formats.
 *
 * @example
 * // Searching for '5551234567' will match:
 * // - '5551234567'
 * // - '555-123-4567'
 * // - '(555) 123-4567'
 * // - '+1 555 123 4567'
 */
export function createPhoneRegex(phone: string): RegExp {
  const normalized = normalizePhone(phone);

  if (normalized.length < 4) {
    // For very short inputs, require exact sequence
    return new RegExp(normalized);
  }

  // Build a pattern that matches the digits in sequence, allowing any characters between
  // e.g., '5551234567' becomes '5.*5.*5.*1.*2.*3.*4.*5.*6.*7'
  const pattern = normalized.split('').join('.*');

  return new RegExp(pattern, 'i');
}

/**
 * Formats a phone number for display as (555) 555-5555
 */
export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizePhone(phone);

  if (normalized.length !== 10) {
    // Return original if not a standard 10-digit number
    return phone;
  }

  const areaCode = normalized.slice(0, 3);
  const prefix = normalized.slice(3, 6);
  const lineNumber = normalized.slice(6, 10);

  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

/**
 * Validates if a phone number has enough digits to be a valid US phone number
 */
export function isValidPhoneLength(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length === 10;
}
