/**
 * wix-cms-sdk
 * Version: 1.0.0
 *
 * A lightweight and modular SDK for interacting with the Wix Headless CMS API.
 * This library simplifies content management operations such as retrieving, creating,
 * updating, and deleting CMS items, making it easier to integrate Wix CMS into your projects.
 *
 * @license ISC
 */

import { ok, badRequest } from "wix-http-functions";
import wixData from "wix-data";

/**
 * Here, you're going to change this default value to your secret token.
 * Useful to secure your Database from third-party requests.
 */
const SECRET_TOKEN = "YOUR_SECRET_TOKEN_HERE";

const getResponse = () => ({
    headers: { "content-type": "application/json" }
});

const validateRequest = (body) => {
    if (body.token !== SECRET_TOKEN) return { status: "failed", error: "unauthorized" };
    if (!body.collection) return { status: "failed", error: "collection_not_provided" };
    return null;
};

const handleOperation = (operation, response) => 
    operation.then(result => {
        response.body = { status: "success", result };
        return ok(response);
    }).catch(error => {
        response.body = { status: "failed", error: "operation_failed", errorMessage: error };
        return badRequest(response);
    });

export async function post_saveQuery(request) {
    const response = getResponse();
    const body = JSON.parse(await request.body.text());
    const error = validateRequest(body);
    if (error) return badRequest({ ...response, body: error });

    const { collection, item, options } = body;
    const operation = Array.isArray(item) 
        ? wixData.bulkSave(collection, item, options) 
        : wixData.save(collection, item, options);
    return handleOperation(operation, response);
}

export async function post_removeQuery(request) {
    const response = getResponse();
    const body = JSON.parse(await request.body.text());
    const error = validateRequest(body);
    if (error) return badRequest({ ...response, body: error });

    const { collection, itemId, options } = body;
    const operation = Array.isArray(itemId)
        ? wixData.bulkRemove(collection, itemId, options)
        : wixData.remove(collection, itemId, options);
    return handleOperation(operation, response);
}

export async function post_truncateQuery(request) {
    const response = getResponse();
    const body = JSON.parse(await request.body.text());
    const error = validateRequest(body);
    if (error) return badRequest({ ...response, body: error });

    const { collection, options } = body;
    const operation = wixData.truncate(collection, options);
    return handleOperation(operation, response);
}

export async function post_insertQuery(request) {
    const response = getResponse();
    const body = JSON.parse(await request.body.text());
    const error = validateRequest(body);
    if (error) return badRequest({ ...response, body: error });

    const { collection, item, options } = body;
    const operation = Array.isArray(item)
        ? wixData.bulkInsert(collection, item, options)
        : wixData.insert(collection, item, options);
    return handleOperation(operation, response);
}

export async function post_query(request) {
    const response = getResponse();
    const body = JSON.parse(await request.body.text());
    
    if (body.token !== SECRET_TOKEN) {
        response.body = { status: "failed", error: "unauthorized" };
        return badRequest(response);
    }

    if (!body.collection) {
        response.body = { status: "failed", error: "collection_not_provided" };
        return badRequest(response);
    }

    let query = wixData.query(body.collection);
    if (Array.isArray(body.conditions)) {
        body.conditions.forEach(cond => {
            const methods = {
                eq: () => query.eq(cond.field, cond.value),
                ne: () => query.ne(cond.field, cond.value),
                gt: () => query.gt(cond.field, cond.value),
                gte: () => query.ge(cond.field, cond.value),
                lt: () => query.lt(cond.field, cond.value),
                lte: () => query.le(cond.field, cond.value),
                include: () => query.include(...cond.field),
                contains: () => query.contains(cond.field, cond.value),
                startsWith: () => query.startsWith(cond.field, cond.value),
                endsWith: () => query.endsWith(cond.field, cond.value),
                between: () => query.between(cond.field, cond.value, cond.extraValue),
                fields: () => query.fields(...cond.field),
                limit: () => query.limit(cond.value),
                skip: () => query.skip(cond.value),
                hasSome: () => query.hasSome(cond.field, cond.value),
                ascending: () => query.ascending(...cond.field),
                descending: () => query.descending(...cond.field)
            };
            if (!methods[cond.operator]) {
                response.body = { status: "failed", error: "invalid_operator" };
                return badRequest(response);
            }
            query = methods[cond.operator]();
        });
    }

    return query.find().then(result => {
        response.body = { 
            status: "success", 
            result: {
                items: result.items,
                pagination: {
                    total_items: result.length,
                    total_pages: result.totalPages,
                    per_page: result.pageSize,
                    current_page: result.currentPage,
                    has_next_page: result.hasNext(),
                    has_prev_page: result.hasPrev()
                }
            } 
        };
        return ok(response);
    }).catch(error => {
        response.body = { status: "failed", error: "query_failed", errorMessage: error };
        return badRequest(response);
    });
}