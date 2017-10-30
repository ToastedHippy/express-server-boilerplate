import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { IServerConfig } from "../config/models";
import {IRouterConfig} from "../config/models";
import * as morgan from "morgan";

export class ExpressApplication {
    private _instance: express.Express;
    private _config: IServerConfig;

    constructor(config: IServerConfig){
        this._config = config;
        this._instance = express();
        this.configure();
        this.setRouters(this._config.routerConfig);
    }

    get instance(){
        return this._instance;
    }

    private configure(){
        this._instance.set('port', this._config.port);
        this._instance.use(bodyParser.urlencoded({ extended: false }))
        this._instance.use(bodyParser.json());
        this._instance.use(cookieParser());
        this._instance.use(morgan('dev'));
    }

    private setRouters(routerInfos: IRouterConfig[]) {
        for(let r of routerInfos){
            this._instance.use(r.path, r.router);
        }
        this._instance.use(function(req: express.Request, res: express.Response){
            res.status(404).send('url does not exist!');
        })
    }
}