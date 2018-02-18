import {Router} from "express";
import { Strategy } from "passport-strategy";

export interface IExpressConfig {
    port: number;
    authStrategies?: Strategy[]
}

export interface IServerConfig extends IExpressConfig {
    
}
