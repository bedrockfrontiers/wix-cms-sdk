import { DEFAULT_HEADERS, HTTP_METHODS } from "../config/constants.js";
import { validateStrings } from "../utils/validation.js";
import { 
  handleResponse, 
  isRetryableError, 
  createDetailedError 
} from "../utils/errorHandler.js";
import { 
  fetchWithTimeout, 
  withRetry, 
  debugLog 
} from "../utils/requestHelpers.js";

/**
 * A utility class for making HTTP requests to the Wix API.
 * Handles authentication, request formatting, response parsing, retries, and timeouts.
 * 
 * @class WixRequest
 * @throws {Error} When API requests fail or responses are invalid
 * 
 * @example
 * const wixRequest = new WixRequest('products', 'user123', 'my-site-id', 'auth-token-xyz');
 * const result = await wixRequest.findQuery('query', { conditions: [] });
 */
export class WixRequest {
	#collectionName;
	#token;
	#apiBase;

	/**
	 * Creates a new WixRequest instance.
	 * 
	 * @param {string} collectionName - The name of the Wix CMS collection to interact with
	 * @param {string} username - The Wix account username with access to the collection
	 * @param {string} site - The site ID or site URL identifier
	 * @param {string} token - Authentication token for API access
	 * @throws {TypeError} When any parameter is invalid
	 */
	constructor(collectionName, username, site, token) {
		validateStrings([
			{ value: collectionName, fieldName: 'Collection name' },
			{ value: username, fieldName: 'Username' },
			{ value: site, fieldName: 'Site' },
			{ value: token, fieldName: 'Token' }
		]);
		
		this.#collectionName = collectionName;
		this.#token = token;
		this.#apiBase = `https://${username}.wixsite.com/${site}/_functions`;
	}

	/**
	 * Inserts an item into the collection.
	 * 
	 * @param {string} route - The API endpoint route
	 * @param {Object} item - The item to insert
	 * @param {Object} [options] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the inserted item
	 * @throws {Error} When the insert operation fails
	 */
	async insertQuery(route, item, options) {
		return this.#executeQuery(route, { item, options });
	}

	/**
	 * Saves an item to the collection (inserts or updates if it exists).
	 * 
	 * @param {string} route - The API endpoint route
	 * @param {Object} item - The item to save
	 * @param {Object} [options] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the saved item
	 * @throws {Error} When the save operation fails
	 */
	async saveQuery(route, item, options) {
		return this.#executeQuery(route, { item, options });
	}

	/**
	 * Updates an existing item in the collection.
	 * 
	 * @param {string} route - The API endpoint route
	 * @param {Object} item - The item to update (must include _id field)
	 * @param {Object} [options] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the updated item
	 * @throws {Error} When the update operation fails
	 */
	async update(route, item, options) {
		return this.#executeQuery(route, { item, options });
	}

	/**
	 * Removes an item from the collection by its ID.
	 * 
	 * @param {string} route - The API endpoint route
	 * @param {string} itemId - The ID of the item to remove
	 * @param {Object} [options] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the removal confirmation
	 * @throws {Error} When the remove operation fails
	 */
	async removeQuery(route, itemId, options) {
		return this.#executeQuery(route, { itemId, options });
	}

	/**
	 * Truncates the collection, removing all items.
	 * 
	 * @param {string} route - The API endpoint route
	 * @param {Object} [options] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the truncate confirmation
	 * @throws {Error} When the truncate operation fails
	 */
	async truncateQuery(route, options) {
		return this.#executeQuery(route, { options });
	}

	/**
	 * Executes a query on the collection and returns the results.
	 * 
	 * @param {string} route - The API endpoint route
	 * @param {Array<Object>} conditions - The query conditions
	 * @param {Object} [options] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the query results
	 * @throws {Error} When the query execution fails
	 */
	async findQuery(route, conditions, options) {
		return this.#executeQuery(route, { conditions, options });
	}

	/**
	 * Executes a query with retry logic and error handling.
	 * @private
	 * @param {string} route
	 * @param {Object} body
	 * @returns {Promise<Object>}
	 * @throws {Error}
	 */
	async #executeQuery(route, body) {
		return withRetry(
			async (attempt) => {
				debugLog('WixRequest', `Attempt ${attempt}: ${HTTP_METHODS.POST} ${route}`);
				
				const response = await this.#makeRequest(route, HTTP_METHODS.POST, body);
				return handleResponse(response);
			},
			{
				isRetryable: isRetryableError,
				onRetry: (error, attempt, delay) => {
					debugLog('WixRequest', `Retrying after error: ${error.message} (waiting ${delay}ms)`);
				}
			}
		);
	}

	/**
	 * Makes an HTTP request with timeout support.
	 * @private
	 * @param {string} route
	 * @param {string} method
	 * @param {Object} [body]
	 * @returns {Promise<Response>}
	 * @throws {Error}
	 */
	async #makeRequest(route, method, body) {
		const options = {
			method,
			headers: DEFAULT_HEADERS
		};

		if (body) {
			options.body = JSON.stringify({
				collection: this.#collectionName,
				token: this.#token,
				...body
			});
		}

		const url = `${this.#apiBase}/${route}`;
		debugLog('WixRequest', `Request URL: ${url}`);

		const response = await fetchWithTimeout(url, options);
		
		if (!response.ok) {
			throw await createDetailedError(response);
		}

		return response;
	}
}

