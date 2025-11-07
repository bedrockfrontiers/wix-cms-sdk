import { REQUEST_TIMEOUT, RETRY_CONFIG } from './constants.js';

/**
 * Handles environment-specific configuration.
 */
export const ENV = {
  API_TIMEOUT: REQUEST_TIMEOUT,
  RETRY_ATTEMPTS: RETRY_CONFIG.maxAttempts,
  DEBUG: process.env.NODE_ENV !== 'production',
};
