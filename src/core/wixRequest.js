import { DEFAULT_HEADERS, HTTP_METHOD } from "../config/constants.js";

/**
 * A utility class for making HTTP requests to the Wix API.
 * Handles authentication, request formatting, and response parsing.
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
		this.#validateParameters(collectionName, username, site, token);
		
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
	 * @private
	 * @param {string} route
	 * @param {Object} body
	 * @returns {Promise<Object>}
	 * @throws {Error}
	 */
	async #executeQuery(route, body) {
		const response = await this.#makeRequest(route, HTTP_METHOD.POST, body);
		return this.#handleResponse(response);
	}

	/**
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

		const response = await fetch(`${this.#apiBase}/${route}`, options);
		
		if (!response.ok) {
			throw new Error(
				`Wix API request failed: ${response.status} ${response.statusText}`
			);
		}

		return response;
	}

	/**
	 * @private
	 * @param {Response} response
	 * @returns {Promise<Object>}
	 * @throws {Error}
	 */
	async #handleResponse(response) {
		const data = await response.json();
		
		if (!data || typeof data.status !== 'string') {
			throw new Error('Invalid response format: missing status field');
		}

		return data;
	}

	/**
	 * @private
	 * @param {string} collectionName
	 * @param {string} username
	 * @param {string} site
	 * @param {string} token
	 * @throws {TypeError}
	 */
	#validateParameters(collectionName, username, site, token) {
		if (typeof collectionName !== 'string' || collectionName.trim().length === 0) {
			throw new TypeError('Collection name must be a non-empty string');
		}
		
		if (typeof username !== 'string' || username.trim().length === 0) {
			throw new TypeError('Username must be a non-empty string');
		}
		
		if (typeof site !== 'string' || site.trim().length === 0) {
			throw new TypeError('Site must be a non-empty string');
		}
		
		if (typeof token !== 'string' || token.trim().length === 0) {
			throw new TypeError('Token must be a non-empty string');
		}
	}
}

