import WixRequest from "./WixRequest.js";

export default class QueryBuilder {
    conditions = [];
    
    constructor(collectionName, username, site, token) {
        this.collectionName = collectionName;
        this.username = username;
        this.site = site;
        this.token = token;
        this.wixRequest = new WixRequest(collectionName, username, site, token);
    }

    eq(field, value) { return this.addCondition(field, "eq", value); }
    ne(field, value) { return this.addCondition(field, "ne", value); }
    gt(field, value) { return this.addCondition(field, "gt", value); }
    gte(field, value) { return this.addCondition(field, "gte", value); }
    lt(field, value) { return this.addCondition(field, "lt", value); }
    le(field, value) { return this.addCondition(field, "le", value); }
    lte(field, value) { return this.addCondition(field, "lte", value); }
    include(field) { return this.addCondition(field, "include"); }
    contains(field, value) { return this.addCondition(field, "contains", value); }
    startsWith(field, value) { return this.addCondition(field, "startsWith", value); }
    endsWith(field, value) { return this.addCondition(field, "endsWith", value); }
    between(field, minValue, maxValue) { return this.addCondition(field, "between", minValue, maxValue); }
    fields(field) { return this.addCondition(field, "fields"); }
    limit(value) { return this.addCondition(null, "limit", value); }
    skip(value) { return this.addCondition(null, "skip", value); }
    hasSome(field, value) { return this.addCondition(field, "hasSome", value); }
    hasAll(field, value) { return this.addCondition(field, "hasAll", value); }
    isEmpty(field) { return this.addCondition(field, "isEmpty"); }
    isNotEmpty(field) { return this.addCondition(field, "isNotEmpty"); }
    ascending(field) { return this.addCondition(field, "ascending"); }
    descending(field) { return this.addCondition(field, "descending"); }

    addCondition(field, operator, value, extraValue) {
        this.conditions.push({ field, operator, value, extraValue });
        return this;
    }

    async insert(item, options = { suppressAuth: true }) {
        return await this.wixRequest.insertQuery("insertQuery", item, options);
    }

    async save(item, options = { suppressAuth: true }) {
        return await this.wixRequest.saveQuery("saveQuery", item, options);
    }

    async update(item, options = { suppressAuth: true }) {
        return await this.wixRequest.update("update", item, options);
    }

    async remove(itemId, options = { suppressAuth: true }) {
        return await this.wixRequest.removeQuery("removeQuery", itemId, options);
    }

    async truncate(options = { suppressAuth: true }) {
        return await this.wixRequest.truncateQuery("truncateQuery", options);
    }

    async find(options = {}) {
        try {
            const result = await this.wixRequest.findQuery("query", this.conditions, options);
            if (result.status === "failed") this.handleQueryError(result);
            return result;
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }

    handleQueryError(result) {
        console.error(`[QueryBuilder] Falha na consulta. Erro: ${result.error}`,
            result.errorMessage ? `Detalhes: ${result.errorMessage}` : '');
    }

    handleUnexpectedError(error) {
        console.error('[QueryBuilder] Erro inesperado:', error);
        return { status: "failed", error: "internal_error", errorMessage: error?.message || String(error) };
    }
}