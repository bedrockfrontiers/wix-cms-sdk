import type { FilterOperator, SortOperator, PaginationOperator, ProjectionOperator } from "./operators.ts";

export type BaseCondition<T extends string> = {
  operator: T;
  value?: unknown;
  extraValue?: unknown;
};

export type FieldCondition = BaseCondition<FilterOperator> & {
  field: string;
};

export type SortCondition = BaseCondition<SortOperator> & {
  field: string[];
};

export type PaginationCondition = BaseCondition<PaginationOperator>;

export type ProjectionCondition = BaseCondition<ProjectionOperator> & {
  field: string[];
};

export type Condition = 
  | FieldCondition
  | SortCondition
  | PaginationCondition
  | ProjectionCondition;