/** Allowed blood types on registration / profile (matches backend). */
export const BLOOD_TYPE_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

/** Egyptian mobile numbers expected by the Express API (11 digits, leading 01). */
export const EGYPTIAN_PHONE_PATTERN = /^01\d{9}$/;

/** Normalize free-text blood type to a known option or empty string. */
export function normalizeBloodType(value?: string): string {
  const normalized = value?.trim().toUpperCase();
  return normalized && BLOOD_TYPE_OPTIONS.includes(normalized as (typeof BLOOD_TYPE_OPTIONS)[number])
    ? normalized
    : '';
}
