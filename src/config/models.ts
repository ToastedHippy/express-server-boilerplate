import {Router} from "express";
import { Strategy } from "passport-strategy";

export interface IRouterConfig{
    path: string,
    router: Router
}

export interface IServerConfig{
    port: number;
    authStrategies?: Strategy[]
}


export interface IMongoConfig{
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}