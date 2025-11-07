import { WixRequest } from "./wixRequest.js";

const DEFAULT_OPTIONS = Object.freeze({ suppressAuth: true });

/**
 * A fluent query builder class for constructing and executing queries on Wix CMS collections.
 * Provides methods to add conditions, perform CRUD operations, and handle query results.
 * 
 * @class QueryBuilder
 * @throws {Error} When query execution or CRUD operations fail
 * 
 * @example
 * const queryBuilder = new QueryBuilder('products', 'user123', 'my-site-id', 'auth-token-xyz');
 * const result = await queryBuilder.eq('price', 100).limit(10).find();
 */
export class QueryBuilder {
	#conditions = [];
	#wixRequest;
	
	/**
	 * Creates a new QueryBuilder instance.
	 * 
	 * @param {string} collectionName - The name of the Wix CMS collection to query
	 * @param {string} username - The Wix account username with access to the collection
	 * @param {string} site - The site ID or site URL identifier
	 * @param {string} token - Authentication token for API access
	 */
	constructor(collectionName, username, site, token) {
		this.#wixRequest = new WixRequest(collectionName, username, site, token);
	}

	/**
	 * Adds an equality condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {*} value - The value to match
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	eq(field, value) {
		return this.#addCondition(field, "eq", value);
	}

	/**
	 * Adds a non-equality condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {*} value - The value to exclude
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	ne(field, value) {
		return this.#addCondition(field, "ne", value);
	}

	/**
	 * Adds a greater-than condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {number|Date} value - The value to compare against
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	gt(field, value) {
		return this.#addCondition(field, "gt", value);
	}

	/**
	 * Adds a greater-than-or-equal condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {number|Date} value - The value to compare against
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	gte(field, value) {
		return this.#addCondition(field, "gte", value);
	}

	/**
	 * Adds a less-than condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {number|Date} value - The value to compare against
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	lt(field, value) {
		return this.#addCondition(field, "lt", value);
	}

	/**
	 * Adds a less-than-or-equal condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {number|Date} value - The value to compare against
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	lte(field, value) {
		return this.#addCondition(field, "lte", value);
	}

	/**
	 * Adds an inclusion condition to the query.
	 * 
	 * @param {string} field - The field to include
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	include(field) {
		return this.#addCondition(field, "include");
	}

	/**
	 * Adds a contains condition to the query.
	 * 
	 * @param {string} field - The field to search
	 * @param {string} value - The value to search for
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	contains(field, value) {
		return this.#addCondition(field, "contains", value);
	}

	/**
	 * Adds a starts-with condition to the query.
	 * 
	 * @param {string} field - The field to search
	 * @param {string} value - The value to match at the start
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	startsWith(field, value) {
		return this.#addCondition(field, "startsWith", value);
	}

	/**
	 * Adds an ends-with condition to the query.
	 * 
	 * @param {string} field - The field to search
	 * @param {string} value - The value to match at the end
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	endsWith(field, value) {
		return this.#addCondition(field, "endsWith", value);
	}

	/**
	 * Adds a between condition to the query.
	 * 
	 * @param {string} field - The field to compare
	 * @param {number|Date} minValue - The minimum value (inclusive)
	 * @param {number|Date} maxValue - The maximum value (inclusive)
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	between(field, minValue, maxValue) {
		return this.#addCondition(field, "between", minValue, maxValue);
	}

	/**
	 * Specifies fields to include in the query results.
	 * 
	 * @param {string} field - The field to include
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	fields(field) {
		return this.#addCondition(field, "fields");
	}

	/**
	 * Limits the number of results returned by the query.
	 * 
	 * @param {number} value - The maximum number of results to return
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 * @throws {TypeError} When value is not a positive integer
	 */
	limit(value) {
		if (!Number.isInteger(value) || value <= 0) {
			throw new TypeError('Limit must be a positive integer');
		}
		return this.#addCondition(null, "limit", value);
	}

	/**
	 * Skips a specified number of results in the query.
	 * 
	 * @param {number} value - The number of results to skip
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 * @throws {TypeError} When value is not a non-negative integer
	 */
	skip(value) {
		if (!Number.isInteger(value) || value < 0) {
			throw new TypeError('Skip must be a non-negative integer');
		}
		return this.#addCondition(null, "skip", value);
	}

	/**
	 * Adds a condition to check if the field has some of the specified values.
	 * 
	 * @param {string} field - The field to check
	 * @param {Array<*>} value - The values to check against
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	hasSome(field, value) {
		return this.#addCondition(field, "hasSome", value);
	}

	/**
	 * Adds a condition to check if the field has all of the specified values.
	 * 
	 * @param {string} field - The field to check
	 * @param {Array<*>} value - The values to check against
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	hasAll(field, value) {
		return this.#addCondition(field, "hasAll", value);
	}

	/**
	 * Adds a condition to check if the field is empty.
	 * 
	 * @param {string} field - The field to check
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	isEmpty(field) {
		return this.#addCondition(field, "isEmpty");
	}

	/**
	 * Adds a condition to check if the field is not empty.
	 * 
	 * @param {string} field - The field to check
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	isNotEmpty(field) {
		return this.#addCondition(field, "isNotEmpty");
	}

	/**
	 * Sorts the results in ascending order by the specified field.
	 * 
	 * @param {string} field - The field to sort by
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	ascending(field) {
		return this.#addCondition(field, "ascending");
	}

	/**
	 * Sorts the results in descending order by the specified field.
	 * 
	 * @param {string} field - The field to sort by
	 * @returns {QueryBuilder} The current QueryBuilder instance for chaining
	 */
	descending(field) {
		return this.#addCondition(field, "descending");
	}

	/**
	 * @private
	 * @param {string|null} field
	 * @param {string} operator
	 * @param {*} [value]
	 * @param {*} [extraValue]
	 * @returns {QueryBuilder}
	 */
	#addCondition(field, operator, value, extraValue) {
		this.#conditions.push({ field, operator, value, extraValue });
		return this;
	}

	/**
	 * Inserts a new item into the collection.
	 * 
	 * @param {Object} item - The item to insert
	 * @param {Object} [options] - Additional options for the request
	 * @param {boolean} [options.suppressAuth=true] - Whether to suppress authentication
	 * @returns {Promise<Object>} A promise resolving to the inserted item with generated ID
	 */
	async insert(item, options = DEFAULT_OPTIONS) {
		return this.#wixRequest.insertQuery("insertQuery", item, options);
	}

	/**
	 * Saves an item to the collection (inserts or updates if it exists).
	 * 
	 * @param {Object} item - The item to save
	 * @param {Object} [options] - Additional options for the request
	 * @param {boolean} [options.suppressAuth=true] - Whether to suppress authentication
	 * @returns {Promise<Object>} A promise resolving to the saved item
	 */
	async save(item, options = DEFAULT_OPTIONS) {
		return this.#wixRequest.saveQuery("saveQuery", item, options);
	}

	/**
	 * Updates an existing item in the collection.
	 * 
	 * @param {Object} item - The item to update (must include _id field)
	 * @param {Object} [options] - Additional options for the request
	 * @param {boolean} [options.suppressAuth=true] - Whether to suppress authentication
	 * @returns {Promise<Object>} A promise resolving to the updated item
	 */
	async update(item, options = DEFAULT_OPTIONS) {
		return this.#wixRequest.update("update", item, options);
	}

	/**
	 * Removes an item from the collection by its ID.
	 * 
	 * @param {string} itemId - The ID of the item to remove
	 * @param {Object} [options] - Additional options for the request
	 * @param {boolean} [options.suppressAuth=true] - Whether to suppress authentication
	 * @returns {Promise<Object>} A promise resolving to the removal confirmation
	 */
	async remove(itemId, options = DEFAULT_OPTIONS) {
		return this.#wixRequest.removeQuery("removeQuery", itemId, options);
	}

	/**
	 * Truncates the collection, removing all items.
	 * 
	 * @param {Object} [options] - Additional options for the request
	 * @param {boolean} [options.suppressAuth=true] - Whether to suppress authentication
	 * @returns {Promise<Object>} A promise resolving to the truncate confirmation
	 */
	async truncate(options = DEFAULT_OPTIONS) {
		return this.#wixRequest.truncateQuery("truncateQuery", options);
	}

	/**
	 * Executes the query and returns the results.
	 * 
	 * @param {Object} [options={}] - Additional options for the request
	 * @returns {Promise<Object>} A promise resolving to the query results
	 * @throws {Error} When the query execution fails
	 */
	async find(options = {}) {
		const result = await this.#wixRequest.findQuery("query", this.#conditions, options);
		
		if (result.status === "failed") {
			throw new Error(
				result.errorMessage 
					? `Query failed: ${result.error} - ${result.errorMessage}`
					: `Query failed: ${result.error}`
			);
		}
		
		return result;
	}
}
