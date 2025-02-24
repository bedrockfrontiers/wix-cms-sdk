export type FilterOperator = 
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "hasSome"
  | "between";

export type SortOperator = "ascending" | "descending";

export type PaginationOperator = "limit" | "skip";

export type ProjectionOperator = "include" | "fields";