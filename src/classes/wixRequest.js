export default class WixRequest {
    constructor(collectionName, username, site, token) {
        this.collectionName = collectionName;
        this.username = username;
        this.site = site;
        this.token = token;
        this.API_BASE = `https://${username}.wixsite.com/${site}/_functions`;
    }

    async tplRequest(route, options = { method: "GET" }) {
        const defaultHeaders = { "content-type": "application/json" };
        const mergedOptions = {
            method: options.method,
            headers: { ...defaultHeaders, ...options.headers },
            body: options.body ? JSON.stringify({
                collection: this.collectionName,
                token: this.token,
                ...options.body
            }) : undefined,
            cache: options.cache,
            credentials: options.credentials,
            mode: options.mode,
            redirect: options.redirect,
            referrerPolicy: options.referrerPolicy
        };

        try {
            const response = await fetch(`${this.API_BASE}/${route}`, mergedOptions);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response;
        } catch (error) {
            console.error("[WixRequest] API request failed:", error);
            throw error;
        }
    }

    async insertQuery(route, item, options) {
        return this.handleResponse(await this.tplRequest(route, { method: "POST", body: { item, options } }));
    }

    async saveQuery(route, item, options) {
        return this.handleResponse(await this.tplRequest(route, { method: "POST", body: { item, options } }));
    }

    async updateQuery(route, item, options) {
        return this.handleResponse(await this.tplRequest(route, { method: "POST", body: { item, options } }));
    }

    async removeQuery(route, itemId, options) {
        return this.handleResponse(await this.tplRequest(route, { method: "POST", body: { itemId, options } }));
    }

    async truncateQuery(route, options) {
        return this.handleResponse(await this.tplRequest(route, { method: "POST", body: { options } }));
    }

    async findQuery(route, conditions, options) {
        return this.handleResponse(await this.tplRequest(route, { method: "POST", body: { conditions, options } }));
    }

    async handleResponse(response) {
        try {
            const data = await response.json();
            if (!data.status) throw new Error("Invalid response format");
            return data;
        } catch (error) {
            console.error("[WixRequest] Response handling failed:", error);
            return { status: "failed", error: "invalid_response", errorMessage: error?.message || "Unknown error" };
        }
    }
}
