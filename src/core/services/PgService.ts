import {Pool, ConnectionConfig, QueryResult} from "pg";


export class PgService {

    private _pool: Pool;

    constructor(connConfig: ConnectionConfig) {
        this._pool = new Pool(connConfig)
    }

    async execute(query: string): Promise<QueryResult> {
        return await this._pool.query(query);
    }

}