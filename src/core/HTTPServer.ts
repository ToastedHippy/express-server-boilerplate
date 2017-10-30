import {Express} from "express"
import * as http from "http";
import * as path from "path";
import {serverConfig} from "../config/serverConfig";

import {IServerConfig} from "../config/models";
import {ExpressApplication} from "./ExpressApplication";


export class HTTPServer {
    private _app: Express;
    private _config: IServerConfig;
    private _instance: http.Server;

    constructor(){
        this._config = serverConfig;
        this._app = new ExpressApplication(this._config).instance;
        this._instance = http.createServer(this._app);
    };

    start(){
        this._instance.listen(this._config.port, ()=>{console.log(`listening on port ${this._config.port}`)});
    };
}