export type QueryOptions = {
  suppressAuth?: boolean;
  consistentRead?: boolean;
  suppressHooks?: boolean;
};

export type AppSpecificOptions = {
  includeHiddenProducts?: boolean;
  includeVariants?: boolean;
};