import { WixRequest } from "./wixRequest.js";

export interface QueryCondition {
  field: string | null;
  operator: string;
  value?: any;
  extraValue?: any;
}

export interface QueryOptions {
  suppressAuth?: boolean;
  [key: string]: any;
}

/**
 * Fluent query builder for Wix CMS collections.
 */
export declare class QueryBuilder {
  constructor(collectionName: string, username: string, site: string, token: string);

  eq(field: string, value: any): this;
  ne(field: string, value: any): this;
  gt(field: string, value: number | Date): this;
  gte(field: string, value: number | Date): this;
  lt(field: string, value: number | Date): this;
  lte(field: string, value: number | Date): this;
  include(field: string): this;
  contains(field: string, value: string): this;
  startsWith(field: string, value: string): this;
  endsWith(field: string, value: string): this;
  between(field: string, minValue: number | Date, maxValue: number | Date): this;
  fields(field: string): this;
  limit(value: number): this;
  skip(value: number): this;
  hasSome(field: string, value: any[]): this;
  hasAll(field: string, value: any[]): this;
  isEmpty(field: string): this;
  isNotEmpty(field: string): this;
  ascending(field: string): this;
  descending(field: string): this;

  insert(item: object, options?: QueryOptions): Promise<object>;
  save(item: object, options?: QueryOptions): Promise<object>;
  update(item: object, options?: QueryOptions): Promise<object>;
  remove(itemId: string, options?: QueryOptions): Promise<object>;
  truncate(options?: QueryOptions): Promise<object>;
  find(options?: QueryOptions): Promise<object>;
}
