/**
 * Validates a single string parameter.
 * 
 * @param {*} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @throws {TypeError} When value is not a valid string
 */
export function validateString(value, fieldName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string`);
  }
}

/**
 * Validates multiple string parameters at once.
 * 
 * @param {Array<{value: *, fieldName: string}>} fields - Array of fields to validate
 * @throws {TypeError} When any value is not a valid string
 * 
 * @example
 * validateStrings([
 *   { value: 'products', fieldName: 'Collection name' },
 *   { value: 'user123', fieldName: 'Username' }
 * ]);
 */
export function validateStrings(fields) {
  for (const { value, fieldName } of fields) {
    validateString(value, fieldName);
  }
}

/**
 * Validates that a value is a valid object (not null, not array).
 * 
 * @param {*} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @throws {TypeError} When value is not a valid object
 */
export function validateObject(value, fieldName) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be a valid object`);
  }
}

/**
 * Validates that a value is a positive number.
 * 
 * @param {*} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @throws {TypeError} When value is not a positive number
 */
export function validatePositiveNumber(value, fieldName) {
  if (typeof value !== 'number' || value <= 0 || !isFinite(value)) {
    throw new TypeError(`${fieldName} must be a positive number`);
  }
}

/**
 * Validates that a value is an array.
 * 
 * @param {*} value - The value to validate
 * @param {string} fieldName - The name of the field for error messages
 * @throws {TypeError} When value is not an array
 */
export function validateArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be an array`);
  }
}