import { QueryBuilder } from "./queryBuilder.js";

/**
 * A client class for interacting with the Wix Content Management System (CMS).
 */
export declare class WixCMS {
  constructor(username: string, site: string, token: string);

  /**
   * Initializes a query builder for a specific CMS collection.
   * @param collectionName The name of the CMS collection to query.
   */
  query(collectionName: string): QueryBuilder;
}
