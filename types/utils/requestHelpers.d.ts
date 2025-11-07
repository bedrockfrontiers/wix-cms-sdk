/**
 * Makes a fetch request with a timeout.
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns The fetch response
 * @throws {Error} When the request times out
 * 
 * @example
 * const response = await fetchWithTimeout('https://api.example.com/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ key: 'value' })
 * }, 5000);
 */
export function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout?: number
): Promise<Response>;

/**
 * Configuration options for the withRetry function
 */
export interface RetryOptions<T = any> {
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxAttempts?: number;
  
  /**
   * Base delay between retries in milliseconds
   * @default 1000
   */
  baseDelay?: number;
  
  /**
   * Maximum delay between retries in milliseconds
   * @default 10000
   */
  maxDelay?: number;
  
  /**
   * Function to determine if an error is retryable
   * @param error - The error to check
   * @returns true if the error is retryable, false otherwise
   */
  isRetryable?: (error: Error) => boolean;
  
  /**
   * Callback executed before each retry
   * @param error - The error that caused the retry
   * @param attempt - The current attempt number
   * @param delay - The delay before the next retry in milliseconds
   */
  onRetry?: (error: Error, attempt: number, delay: number) => void;
}

/**
 * Executes a function with retry logic.
 * 
 * @param fn - The async function to execute (receives attempt number as parameter)
 * @param config - Retry configuration
 * @returns The result of the function execution
 * @throws {Error} When all retry attempts are exhausted
 * 
 * @example
 * const result = await withRetry(
 *   async (attempt) => await apiCall(),
 *   {
 *     maxAttempts: 3,
 *     isRetryable: (error) => error.message.includes('timeout'),
 *     onRetry: (error, attempt) => console.log(`Retry ${attempt}`)
 *   }
 * );
 */
export function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  config?: RetryOptions<T>
): Promise<T>;

/**
 * Logs debug messages if debug mode is enabled.
 * 
 * @param context - The context/module name for the log
 * @param message - The debug message
 * @param data - Optional data to log
 * 
 * @example
 * debugLog('WixRequest', 'Making API call', { url: 'https://api.example.com' });
 */
export function debugLog(
  context: string,
  message: string,
  data?: any
): void;
