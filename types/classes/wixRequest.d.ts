/**
 * Handles authenticated requests to the Wix CMS API.
 */
export declare class WixRequest {
  constructor(collectionName: string, username: string, site: string, token: string);

  insertQuery(route: string, item: object, options?: object): Promise<object>;
  saveQuery(route: string, item: object, options?: object): Promise<object>;
  update(route: string, item: object, options?: object): Promise<object>;
  removeQuery(route: string, itemId: string, options?: object): Promise<object>;
  truncateQuery(route: string, options?: object): Promise<object>;
  findQuery(route: string, conditions: any[], options?: object): Promise<object>;
}
