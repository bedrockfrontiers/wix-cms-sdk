import { QueryBuilder } from "./queryBuilder.js";

/**
 * A client class for interacting with the Wix Content Management System (CMS).
 * Provides an interface to query data collections using a fluent query builder.
 * 
 * @class
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
     */
    constructor(username, site, token) {
        this.#username = username;
        this.#site = site;
        this.#token = token;
    }

    /**
     * Initializes a query builder for a specific CMS collection.
     * 
     * @param {string} collectionName - The name of the CMS collection to query
     * @returns {QueryBuilder} A configured query builder instance pre-authenticated
     *                        with the current CMS credentials and targeting the specified collection
     * 
     * @example
     * cms.query('products')
     *    .eq('price', 100)
     *    .limit(10)
     */
    query(collectionName) {
        return new QueryBuilder(collectionName, this.#username, this.#site, this.#token);
    }
}