import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { IServerConfig } from "../config/models";
import {IRouterConfig} from "../config/models";
import {Controller} from "./controller/models";
import * as morgan from "morgan";
import * as passport from "passport";
import { Router } from "express";


export class ExpressApplication {
    private _instance: express.Express;

    constructor(config: IServerConfig, controllers?: Array<Controller>){
        this._instance = express();
        this.configure(config);
        if (controllers) this.registerControllers(controllers);
    }

    get instance(){
        return this._instance;
    }

    private configure(config: IServerConfig){

        if (config.authStrategies) {
            for(let strategy of config.authStrategies) {
                passport.use(strategy);
            }
        }

        this._instance.set('port', config.port);
        this._instance.use(passport.initialize());
        this._instance.use(bodyParser.urlencoded({ extended: false }));
        this._instance.use(bodyParser.json());
        this._instance.use(cookieParser());
        this._instance.use(morgan('dev'));
    }

    private registerControllers(Controllers: Array<Controller>) {
        for(let Controller of Controllers) {
            let controller = new Controller();

            if ( typeof controller['__path'] === 'string' && controller['__router']){
                this._instance.use(controller['__path'], controller['__router']);
            }
        }

        this._instance.use(function(req: express.Request, res: express.Response){
            res.status(404).send('url does not exist!');
        })
    }
}