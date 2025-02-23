export type Operator =
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "nin"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "between";

export interface Condition {
    field: string;
    operator: Operator;
    value: unknown;
    extraValue?: unknown;
}

export interface QueryResult {
    items: unknown[];
}

export class QueryBuilder {
    private conditions: Condition[] = [];
    private collectionName: string;
    private username: string;
    private site: string;
    private token: string;

    constructor(collectionName: string, username: string, site: string, token: string) {
        this.collectionName = collectionName;
        this.username = username;
        this.site = site;
        this.token = token;
    }

    public eq(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "eq", value });
        return this;
    }

    public ne(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "ne", value });
        return this;
    }

    public gt(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "gt", value });
        return this;
    }

    public gte(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "gte", value });
        return this;
    }

    public lt(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "lt", value });
        return this;
    }

    public lte(field: string, value: unknown): this {
        this.conditions.push({ field, operator: "lte", value });
        return this;
    }

    public in(field: string, values: unknown[]): this {
        this.conditions.push({ field, operator: "in", value: values });
        return this;
    }

    public nin(field: string, values: unknown[]): this {
        this.conditions.push({ field, operator: "nin", value: values });
        return this;
    }

    public contains(field: string, value: string): this {
        this.conditions.push({ field, operator: "contains", value });
        return this;
    }

    public startsWith(field: string, value: string): this {
        this.conditions.push({ field, operator: "startsWith", value });
        return this;
    }

    public endsWith(field: string, value: string): this {
        this.conditions.push({ field, operator: "endsWith", value });
        return this;
    }

    public between(field: string, minValue: unknown, maxValue: unknown): this {
        this.conditions.push({ field, operator: "between", value: minValue, extraValue: maxValue });
        return this;
    }

    public async find(): Promise<QueryResult> {
        const items = [
            { name: "John", age: 30 },
            { name: "Jane", age: 25 },
            { name: "John", age: 40 },
            { name: "Doe", age: 18 },
            { name: "Daisy", age: 40 }
        ];
        let result = items;
        for (const cond of this.conditions) {
            result = result.filter((item) => {
                const val = (item as any)[cond.field];
                if (cond.operator === "eq") {
                    return val === cond.value;
                }
                if (cond.operator === "ne") {
                    return val !== cond.value;
                }
                if (cond.operator === "gt") {
                    return typeof val === "number" && typeof cond.value === "number" && val > cond.value;
                }
                if (cond.operator === "gte") {
                    return typeof val === "number" && typeof cond.value === "number" && val >= cond.value;
                }
                if (cond.operator === "lt") {
                    return typeof val === "number" && typeof cond.value === "number" && val < cond.value;
                }
                if (cond.operator === "lte") {
                    return typeof val === "number" && typeof cond.value === "number" && val <= cond.value;
                }
                if (cond.operator === "in") {
                    return Array.isArray(cond.value) && cond.value.includes(val);
                }
                if (cond.operator === "nin") {
                    return Array.isArray(cond.value) && !cond.value.includes(val);
                }
                if (cond.operator === "contains") {
                    return typeof val === "string" && typeof cond.value === "string" && val.includes(cond.value);
                }
                if (cond.operator === "startsWith") {
                    return typeof val === "string" && typeof cond.value === "string" && val.startsWith(cond.value);
                }
                if (cond.operator === "endsWith") {
                    return typeof val === "string" && typeof cond.value === "string" && val.endsWith(cond.value);
                }
                if (cond.operator === "between") {
                    if (typeof val === "number" && typeof cond.value === "number" && typeof cond.extraValue === "number") {
                        return val >= cond.value && val <= cond.extraValue;
                    }
                }
                return false;
            });
        }
        return { items: result };
    }
}