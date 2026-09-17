/**
 * Normalizes an Indian mobile number to the consistent standard: "91XXXXXXXXXX" (12 digits).
 * Strips spaces, dashes, '+' and leading zeros.
 * Handles:
 *  - "9876543210" -> "919876543210"
 *  - "+91 98765 43210" -> "919876543210"
 *  - "09876543210" -> "919876543210"
 *  - "919876543210" -> "919876543210"
 */
export function normalizeMobile(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  const digitsOnly = input.replace(/\D/g, "");

  // 10 digits: assume Indian mobile, prepend 91
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }

  // 11 digits starting with 0: strip 0 and prepend 91
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return `91${digitsOnly.slice(1)}`;
  }

  // 12 digits starting with 91: already canonical
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return digitsOnly;
  }

  return digitsOnly;
}

/**
 * Validates whether the given string represents a valid 10-digit Indian mobile number
 * (allowing +91 or 91 prefix).
 */
export function isValidMobile(input: string): boolean {
  const normalized = normalizeMobile(input);
  // Standard Indian mobile: 91 followed by 6-9 and 9 digits
  return /^91[6-9]\d{9}$/.test(normalized);
}
