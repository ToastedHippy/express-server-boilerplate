import {Express} from "express"
import * as http from "http";
import * as path from "path";


import {IServerConfig} from "../config/models";
import {ExpressApplication} from "./ExpressApplication";


export class HTTPServer {
    private _app: Express;
    private _config: IServerConfig;
    private _instance: http.Server;

    constructor(config: IServerConfig, controllers?: Array<new (...args: any[])=> Object>){
        this._config = config;
        this._app = new ExpressApplication(this._config, controllers).instance;
        this._instance = http.createServer(this._app);
    };

    start(){
        this._instance.listen(this._config.port, ()=>{console.log(`listening on port ${this._config.port}`)});
    };
}