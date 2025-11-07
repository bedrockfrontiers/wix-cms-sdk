import { QueryBuilder } from "./queryBuilder.js";

/**
 * A client class for interacting with the Wix Content Management System (CMS).
 * Provides an interface to query data collections using a fluent query builder.
 * 
 * @class WixCMS
 * @throws {TypeError} When constructor parameters are invalid
 * 
 * @example
 * const cms = new WixCMS('user123', 'my-site-id', 'auth-token-xyz');
 * const query = cms.query('blogPosts');
 */
export class WixCMS {
	#username;
	#site;
	#token;

	/**
	 * Creates a new Wix CMS client instance.
	 * 
	 * @param {string} username - The Wix account username with CMS access
	 * @param {string} site - The site ID or site URL identifier
	 * @param {string} token - Authentication token for API access
	 * @throws {TypeError} When any parameter is not a string or is empty
	 */
	constructor(username, site, token) {
		this.#validateCredentials(username, site, token);
		
		this.#username = username;
		this.#site = site;
		this.#token = token;
	}

	/**
	 * Initializes a query builder for a specific CMS collection.
	 * 
	 * @param {string} collectionName - The name of the CMS collection to query
	 * @returns {QueryBuilder} A configured query builder instance pre-authenticated
	 *                         with the current CMS credentials and targeting the specified collection
	 * @throws {TypeError} When collectionName is not a valid non-empty string
	 * 
	 * @example
	 * cms.query('products')
	 *    .eq('price', 100)
	 *    .limit(10)
	 */
	query(collectionName) {
		this.#validateCollectionName(collectionName);
		
		return new QueryBuilder(
			collectionName,
			this.#username,
			this.#site,
			this.#token
		);
	}

	/**
	 * @private
	 * @param {string} username
	 * @param {string} site
	 * @param {string} token
	 * @throws {TypeError}
	 */
	#validateCredentials(username, site, token) {
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

	/**
	 * @private
	 * @param {string} collectionName
	 * @throws {TypeError}
	 */
	#validateCollectionName(collectionName) {
		if (typeof collectionName !== 'string' || collectionName.trim().length === 0) {
			throw new TypeError('Collection name must be a non-empty string');
		}
	}
}
