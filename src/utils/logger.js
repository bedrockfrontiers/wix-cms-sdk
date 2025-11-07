/**
 * Simple logger utility.
 */
export const logger = {
  info: (...args) => console.info('[WixCMSSDK]', ...args),
  warn: (...args) => console.warn('[WixCMSSDK]', ...args),
  error: (...args) => console.error('[WixCMSSDK]', ...args),
};
