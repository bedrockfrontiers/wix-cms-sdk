export const DEFAULT_HEADERS = Object.freeze({
  'Content-Type': 'application/json',
});

export const HTTP_METHODS = Object.freeze({
  GET: 'GET',
  POST: 'POST',
});

// Timeout configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry configuration
export const RETRY_CONFIG = Object.freeze({
  maxAttempts: 3,
  baseDelay: 1000,    // 1 second
  maxDelay: 10000     // 10 seconds
});
