import QueryBuilder from "./queryBuilder.js";

export default class WixCMS {
	constructor(username, site, token) {
		this.username = username;
        this.site = site;
        this.token = token;
	}

	query(collectionName) {
        return new QueryBuilder(collectionName, this.username, this.site, this.token);
    }
}