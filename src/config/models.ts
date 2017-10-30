import {Router} from "express";

export interface IRouterConfig{
    path: string,
    router: Router
}

export interface IServerConfig{
    port: number;
    routerConfig: IRouterConfig[];
}


export interface IMongoConfig{
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}