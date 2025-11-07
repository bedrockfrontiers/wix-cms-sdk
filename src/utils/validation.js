/**
 * Validates a string parameter.
 * @throws {TypeError}
 */
export function validateString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string`);
  }
}
