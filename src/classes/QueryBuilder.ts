import { Condition } from "../types/condition.ts";
import { QueryResult, QueryErrorResult } from "../types/query-result.ts";
import { QueryOptions } from "../types/query-options.ts";
import { WixRequest } from "./WixRequest.ts";

export class QueryBuilder {
    private conditions: Condition[] = [];
    private collectionName: string;
    private username: string;
    private site: string;
    private token: string;
    private wixRequest: WixRequest;

    constructor(collectionName: string, username: string, site: string, token: string) {
        this.collectionName = collectionName;
        this.username = username;
        this.site = site;
        this.token = token;
        this.wixRequest = new WixRequest(collectionName, username, site, token);
    }

    public eq(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "eq", value } as Condition);
        return this;
    }

    public ne(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "ne", value } as Condition);
        return this;
    }

    public gt(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "gt", value } as Condition);
        return this;
    }

    public gte(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "gte", value } as Condition);
        return this;
    }

    public lt(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "lt", value } as Condition);
        return this;
    }

    public lte(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "lte", value } as Condition);
        return this;
    }

    public include(field: string[]): this {
        this.conditions.push({ field, operator: "include" } as Condition);
        return this;
    }

    public contains(field: string, value: string): this {
        this.conditions.push({ field, operator: "contains", value } as Condition);
        return this;
    }

    public startsWith(field: string, value: string): this {
        this.conditions.push({ field, operator: "startsWith", value } as Condition);
        return this;
    }

    public endsWith(field: string, value: string): this {
        this.conditions.push({ field, operator: "endsWith", value } as Condition);
        return this;
    }

    public between(field: string, minValue: unknown, maxValue: unknown): this {
        this.conditions.push({ field, operator: "between", value: minValue, extraValue: maxValue } as Condition);
        return this;
    }

    public fields(field: string[]): this {
        this.conditions.push({ field, operator: "fields" } as Condition);
        return this;
    }

    public limit(value: number): this {
        this.conditions.push({ value, operator: "limit" } as Condition);
        return this;
    }

    public skip(value: number): this {
        this.conditions.push({ value, operator: "skip" } as Condition);
        return this;
    }

    public hasSome(field: string, value: string | number | Record<string, unknown>[] | Date): this {
        this.conditions.push({ field, operator: "hasSome", value } as Condition);
        return this;
    }

    public ascending(field: string[]): this {
        this.conditions.push({ field, operator: "ascending" } as Condition);
        return this;
    }

    public descending(field: string[]): this {
        this.conditions.push({ field, operator: "descending" } as Condition);
        return this;
    }

    public async insert(item: Record<string, unknown> | Record<string, unknown>[], options: QueryOptions = { suppressAuth: true }): Promise<unknown> {
        return await this.wixRequest.insertQuery("insertQuery", item, options);
    }

    public async save(item: Record<string, unknown> | Record<string, unknown>[], options: QueryOptions = { suppressAuth: true }): Promise<unknown> {
        return await this.wixRequest.saveQuery("saveQuery", item, options);
    }

    public async remove(itemId: string | string[], options: QueryOptions = { suppressAuth: true }): Promise<unknown> {
        return await this.wixRequest.removeQuery("removeQuery", itemId, options);
    }

    public async truncate(options: QueryOptions = { suppressAuth: true }): Promise<unknown> {
        return await this.wixRequest.truncateQuery("truncateQuery", options);
    }

    public async find(options: QueryOptions = {}): Promise<QueryResult> {
        try {
            const result = await this.wixRequest.findQuery(
                "query", 
                this.conditions, 
                options
            );
            
            if (result.status === "failed") {
                this.handleQueryError(result);
            }
            return result;
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }

    private handleQueryError(result: QueryErrorResult): void {
        console.error(`[QueryBuilder] Falha na consulta. Erro: ${result.error}`, 
            result.errorMessage ? `Detalhes: ${result.errorMessage}` : '');
    }

    private handleUnexpectedError(error: unknown): QueryErrorResult {
        console.error('[QueryBuilder] Erro inesperado:', error);
        return {
            status: "failed",
            error: "internal_error",
            errorMessage: error instanceof Error ? error.message : String(error)
        };
    }
}