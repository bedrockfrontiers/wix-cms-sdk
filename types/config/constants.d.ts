/**
 * Default HTTP headers for API requests
 */
export const DEFAULT_HEADERS: Readonly<{
  'Content-Type': 'application/json';
}>;

/**
 * HTTP methods used in the application
 */
export const HTTP_METHODS: Readonly<{
  GET: 'GET';
  POST: 'POST';
}>;

/**
 * Request timeout in milliseconds (30 seconds)
 */
export const REQUEST_TIMEOUT: 30000;

/**
 * Retry configuration for failed requests
 */
export const RETRY_CONFIG: Readonly<{
  /**
   * Maximum number of retry attempts
   */
  maxAttempts: 3;
  /**
   * Base delay between retries in milliseconds
   */
  baseDelay: 1000;
  /**
   * Maximum delay between retries in milliseconds
   */
  maxDelay: 10000;
}>;

/**
 * Type definitions for HTTP methods
 */
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];

/**
 * Type definitions for default headers
 */
export type DefaultHeaders = typeof DEFAULT_HEADERS;

/**
 * Type definitions for retry configuration
 */
export type RetryConfig = typeof RETRY_CONFIG;
