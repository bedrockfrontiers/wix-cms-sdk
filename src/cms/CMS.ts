import { QueryBuilder } from "./QueryBuilder";

export class CMS {
    private username: string;
    private site: string;
    private token: string;

    constructor(username: string, site: string, token: string) {
        this.username = username;
        this.site = site;
        this.token = token;
    }

    public query(collectionName: string): QueryBuilder {
        return new QueryBuilder(collectionName, this.username, this.site, this.token);
    }
}