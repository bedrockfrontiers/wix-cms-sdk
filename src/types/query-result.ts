export interface QuerySuccessResult {
  status: "success";
  result: {
    items: Record<string, unknown>[];
    pagination: {
      total_items: number;
      total_pages: number;
      per_page: number;
      current_page: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
  };
}

export interface QueryErrorResult {
  status: "failed";
  error: string;
  errorMessage?: string;
}

export type QueryResult = QuerySuccessResult | QueryErrorResult;