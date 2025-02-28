/**
 * A utility class for making HTTP requests to the Wix API.
 * Handles authentication, request formatting, and response parsing.
 * 
 * @class
 * @example
 * const wixRequest = new WixRequest('products', 'user123', 'my-site-id', 'auth-token-xyz');
 * const result = await wixRequest.findQuery('query', { conditions: [] });
 */
export class WixRequest {
    /**
     * Creates a new WixRequest instance.
     * 
     * @param {string} collectionName - The name of the Wix CMS collection to interact with.
     * @param {string} username - The Wix account username with access to the collection.
     * @param {string} site - The site ID or site URL identifier.
     * @param {string} token - Authentication token for API access.
     */
    constructor(collectionName, username, site, token) {
        this.collectionName = collectionName;
        this.token = token;
        this.API_BASE = `https://${username}.wixsite.com/${site}/_functions`;
    }

    /**
     * Makes a templated HTTP request to the Wix API.
     * 
     * @param {string} route - The API endpoint route.
     * @param {object} [options] - Request options.
     * @param {string} [options.method="GET"] - The HTTP method to use.
     * @param {object} [options.headers] - Additional headers to include in the request.
     * @param {object} [options.body] - The request body.
     * @param {string} [options.cache] - Cache mode for the request.
     * @param {string} [options.credentials] - Credentials mode for the request.
     * @param {string} [options.mode] - Request mode (e.g., "cors").
     * @param {string} [options.redirect] - Redirect mode for the request.
     * @param {string} [options.referrerPolicy] - Referrer policy for the request.
     * @returns {Promise<Response>} A promise resolving to the API response.
     * @throws {Error} If the request fails or the response is not OK.
     * @private
     */
    async #tplRequest(route, options = { method: "GET" }) {
        const defaultHeaders = { "content-type": "application/json" };
        const mergedOptions = {
            method: options.method,
            headers: { ...defaultHeaders, ...options.headers },
            body: options.body ? JSON.stringify({
                collection: this.collectionName,
                token: this.token,
                ...options.body
            }) : undefined,
            cache: options.cache,
            credentials: options.credentials,
            mode: options.mode,
            redirect: options.redirect,
            referrerPolicy: options.referrerPolicy
        };

        try {
            const response = await fetch(`${this.API_BASE}/${route}`, mergedOptions);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response;
        } catch (error) {
            console.error("[WixRequest] API request failed:", error);
            throw error;
        }
    }

    /**
     * Inserts an item into the collection.
     * 
     * @param {string} route - The API endpoint route.
     * @param {object} item - The item to insert.
     * @param {object} [options] - Additional options for the request.
     * @returns {Promise<object>} A promise resolving to the result of the insert operation.
     */
    async insertQuery(route, item, options) {
        return this.handleResponse(await this.#tplRequest(route, { method: "POST", body: { item, options } }));
    }

    /**
     * Saves an item to the collection (inserts or updates if it exists).
     * 
     * @param {string} route - The API endpoint route.
     * @param {object} item - The item to save.
     * @param {object} [options] - Additional options for the request.
     * @returns {Promise<object>} A promise resolving to the result of the save operation.
     */
    async saveQuery(route, item, options) {
        return this.handleResponse(await this.#tplRequest(route, { method: "POST", body: { item, options } }));
    }

    /**
     * Updates an existing item in the collection.
     * 
     * @param {string} route - The API endpoint route.
     * @param {object} item - The item to update.
     * @param {object} [options] - Additional options for the request.
     * @returns {Promise<object>} A promise resolving to the result of the update operation.
     */
    async updateQuery(route, item, options) {
        return this.handleResponse(await this.#tplRequest(route, { method: "POST", body: { item, options } }));
    }

    /**
     * Removes an item from the collection by its ID.
     * 
     * @param {string} route - The API endpoint route.
     * @param {string} itemId - The ID of the item to remove.
     * @param {object} [options] - Additional options for the request.
     * @returns {Promise<object>} A promise resolving to the result of the remove operation.
     */
    async removeQuery(route, itemId, options) {
        return this.handleResponse(await this.#tplRequest(route, { method: "POST", body: { itemId, options } }));
    }

    /**
     * Truncates the collection, removing all items.
     * 
     * @param {string} route - The API endpoint route.
     * @param {object} [options] - Additional options for the request.
     * @returns {Promise<object>} A promise resolving to the result of the truncate operation.
     */
    async truncateQuery(route, options) {
        return this.handleResponse(await this.#tplRequest(route, { method: "POST", body: { options } }));
    }

    /**
     * Executes a query on the collection and returns the results.
     * 
     * @param {string} route - The API endpoint route.
     * @param {object} conditions - The query conditions.
     * @param {object} [options] - Additional options for the request.
     * @returns {Promise<object>} A promise resolving to the query results.
     */
    async findQuery(route, conditions, options) {
        return this.handleResponse(await this.#tplRequest(route, { method: "POST", body: { conditions, options } }));
    }

    /**
     * Handles the API response by parsing the JSON data and checking for errors.
     * 
     * @param {Response} response - The API response object.
     * @returns {Promise<object>} A promise resolving to the parsed response data.
     * @throws {Error} If the response format is invalid.
     * @private
     */
    async handleResponse(response) {
        try {
            const data = await response.json();
            if (!data.status) throw new Error("Invalid response format");
            return data;
        } catch (error) {
            console.error("[WixRequest] Response handling failed:", error);
            return { status: "failed", error: "invalid_response", errorMessage: error?.message || "Unknown error" };
        }
    }
}