import {IMongoConfig} from "./models";
import {ConnectionConfig} from "pg";

export const mongoConfig: IMongoConfig = {
        host: 'localhost',
        port: 27017,
        database: 'myAppDB',
        username: 'admin',
        password: 'pass'
    },

    pgArbitrageConfig: ConnectionConfig = {
    user: 'postgres',
    password: 'Hfljcnysq01',
    host: '192.168.87.16',
    database: 'dwh',
    port: 5432
    }

