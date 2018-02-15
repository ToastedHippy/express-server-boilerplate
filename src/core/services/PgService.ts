import {Pool, ConnectionConfig, QueryResult} from "pg";

class PgError {
    message = 'ошибка в запросе к БД';
    query: string;
    details: Error;

    constructor(query?: string, details?: Error) {
        this.query = query;
        this.details = details;
    }
}

export class PgService {

    private _pool: Pool;

    constructor(connConfig: ConnectionConfig) {
        this._pool = new Pool(connConfig)
    }

    async execute(query: string): Promise<QueryResult> {
        return await this._pool.query(query).catch(e => {throw new PgError(query, e)});
    }

}