import { Condition } from "../types/condition.ts";
import { QueryResult } from "../types/query-result.ts";
import { QueryOptions } from "../types/query-options.ts";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrerPolicy?: ReferrerPolicy;
};

export class WixRequest {
    private readonly API_BASE: string;

    constructor(
        private readonly collectionName: string,
        private readonly username: string,
        private readonly site: string,
        private readonly token: string
    ) {
        this.API_BASE = `https://${this.username}.wixsite.com/${this.site}/_functions`;
    }

    private async tplRequest(
        route: string,
        options: RequestOptions = { method: "GET" }
    ): Promise<Response> {
        const defaultHeaders = {
            "content-type": "application/json",
        };

        const mergedOptions: RequestInit = {
            method: options.method,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            body: options.body 
                ? JSON.stringify({
                    collection: this.collectionName,
                    token: this.token,
                    ...(options.body as Record<string, unknown>)
                  })
                : undefined,
            cache: options.cache,
            credentials: options.credentials,
            mode: options.mode,
            redirect: options.redirect,
            referrerPolicy: options.referrerPolicy
        };

        try {
            const response = await fetch(
                `${this.API_BASE}/${route}`,
                mergedOptions
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('[WixRequest] API request failed:', error);
            throw error;
        }
    }

    public async insertQuery(
        route: string,
        item: unknown | unknown[],
        options: QueryOptions
    ): Promise<QueryResult> {
        const response = await this.tplRequest(route, {
            method: "POST",
            body: {
                item,
                options
            }
        });

        return this.handleResponse(response);
    }

    public async saveQuery(
        route: string,
        item: unknown | unknown[],
        options: QueryOptions
    ): Promise<QueryResult> {
        const response = await this.tplRequest(route, {
            method: "POST",
            body: {
                item,
                options
            }
        });

        return this.handleResponse(response);
    }

    public async removeQuery(
        route: string,
        itemId: string | string[],
        options: QueryOptions
    ): Promise<QueryResult> {
        const response = await this.tplRequest(route, {
            method: "POST",
            body: {
                itemId,
                options
            }
        });

        return this.handleResponse(response);
    }

    public async truncateQuery(
        route: string,
        options: QueryOptions
    ): Promise<QueryResult> {
        const response = await this.tplRequest(route, {
            method: "POST",
            body: {
                options
            }
        });

        return this.handleResponse(response);
    }

    public async findQuery(
        route: string,
        conditions: Condition[],
        options: QueryOptions
    ): Promise<QueryResult> {
        const response = await this.tplRequest(route, {
            method: "POST",
            body: {
                conditions,
                options
            }
        });

        return this.handleResponse(response);
    }

    private async handleResponse(response: Response): Promise<QueryResult> {
        try {
            const data: QueryResult = await response.json();
            
            if (!data.status) {
                throw new Error('Invalid response format');
            }

            return data;
        } catch (error) {
            console.error('[WixRequest] Response handling failed:', error);
            return {
                status: "failed",
                error: "invalid_response",
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}