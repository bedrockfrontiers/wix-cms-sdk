/**
 * Handles environment-specific configuration.
 */
export const ENV = {
  API_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  DEBUG: process.env.NODE_ENV !== 'production',
};
