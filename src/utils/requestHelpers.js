import { REQUEST_TIMEOUT, RETRY_CONFIG } from "../config/constants.js";

/**
 * Makes a fetch request with a timeout.
 * 
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} [timeout=REQUEST_TIMEOUT] - Timeout in milliseconds
 * @returns {Promise<Response>} The fetch response
 * @throws {Error} When the request times out
 * 
 * @example
 * const response = await fetchWithTimeout('https://api.example.com/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ key: 'value' })
 * }, 5000);
 */
export async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		
		if (error.name === 'AbortError') {
			throw new Error(`Request timeout after ${timeout}ms`);
		}
		
		throw error;
	}
}

/**
 * Executes a function with retry logic.
 * 
 * @param {Function} fn - The async function to execute
 * @param {Object} [config] - Retry configuration
 * @param {number} [config.maxAttempts=RETRY_CONFIG.maxAttempts] - Maximum number of retry attempts
 * @param {number} [config.baseDelay=RETRY_CONFIG.baseDelay] - Base delay between retries in milliseconds
 * @param {number} [config.maxDelay=RETRY_CONFIG.maxDelay] - Maximum delay between retries in milliseconds
 * @param {Function} [config.isRetryable] - Function to determine if error is retryable
 * @param {Function} [config.onRetry] - Callback executed before each retry
 * @returns {Promise<*>} The result of the function execution
 * @throws {Error} When all retry attempts are exhausted
 * 
 * @example
 * const result = await withRetry(
 *   async () => await apiCall(),
 *   {
 *     maxAttempts: 3,
 *     isRetryable: (error) => error.status === 429,
 *     onRetry: (error, attempt) => console.log(`Retry ${attempt}`)
 *   }
 * );
 */
export async function withRetry(fn, config = {}) {
	const {
		maxAttempts = RETRY_CONFIG.maxAttempts,
		baseDelay = RETRY_CONFIG.baseDelay,
		maxDelay = RETRY_CONFIG.maxDelay,
		isRetryable = () => true,
		onRetry = () => {}
	} = config;

	let lastError;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn(attempt);
		} catch (error) {
			lastError = error;

			// Don't retry if this is the last attempt or error is not retryable
			if (attempt === maxAttempts || !isRetryable(error)) {
				throw error;
			}

			// Calculate exponential backoff delay: baseDelay * 2^(attempt - 1)
			const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
			const delay = Math.min(exponentialDelay, maxDelay);
			
			// Call retry callback
			onRetry(error, attempt, delay);

			// Wait before next retry
			await sleep(delay);
		}
	}

	throw lastError;
}

/**
 * Sleeps for a specified duration.
 * 
 * @param {number} ms - Duration in milliseconds
 * @returns {Promise<void>}
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Logs debug messages if debug mode is enabled.
 * 
 * @param {string} context - The context/module name for the log
 * @param {string} message - The debug message
 * @param {*} [data] - Optional data to log
 * 
 * @example
 * debugLog('WixRequest', 'Making API call', { url: 'https://api.example.com' });
 */
export function debugLog(context, message, data) {
	if (process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development') {
		const timestamp = new Date().toISOString();
		const logMessage = `[${timestamp}] [${context}] ${message}`;
		
		if (data !== undefined) {
			console.log(logMessage, data);
		} else {
			console.log(logMessage);
		}
	}
}
