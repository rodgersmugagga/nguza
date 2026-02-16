/**
 * Normalizes a Ugandan phone number to the 256XXXXXXXXX format.
 * Supports:
 * - 07... (local format)
 * - 7... (local without leading zero)
 * - 256... (full international)
 * - +256... (+ international)
 * 
 * @param {string} phone - The raw phone number string.
 * @returns {string|null} Normalized phone or null if invalid.
 */
export const normalizeUgandanPhone = (phone) => {
  if (!phone) return null;

  // Remove all non-numeric characters
  let clean = phone.replace(/\D/g, '');

  // Case 1: Already full format (2567...)
  if (clean.length === 12 && clean.startsWith('256')) {
    return clean;
  }

  // Case 2: Local format with 0 (07...)
  if (clean.length === 10 && clean.startsWith('0')) {
    return '256' + clean.substring(1);
  }

  // Case 3: Local format without 0 (7...)
  if (clean.length === 9 && (clean.startsWith('7') || clean.startsWith('4'))) {
    return '256' + clean;
  }

  // Basic validation for length after normalization
  // Ugandan mobile numbers are 256 + 9 digits = 12 digits
  if (clean.length === 12 && clean.startsWith('256')) {
    return clean;
  }

  return null;
};
