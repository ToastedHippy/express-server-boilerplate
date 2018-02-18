import {Router, RequestHandler, Request, Response, NextFunction} from "express";
import { HttpMethod, IResponseData, IHandler } from "../models/Handler.model";
import { ValidationChain, validationResult } from "express-validator/check";


export function Controller(path: string) {
    return function<T extends new(...args:any[])=>{}>(constructor:T):T {
        return class extends constructor {
            __path: string;
            __router: Router;
            __handlers: IHandler[]

            constructor(...args: any[]){
                super(...args);
                this.__path = path;
                this.__router = Router();
                this.registerHandlers();
            }

            registerHandlers() {
                if (this.__handlers) {
                    this.__handlers.forEach(h=>this.registerHandler(h))
                }
            }

            registerHandler(handler: IHandler) {
                const wrappedHandler = this.wrapHandler(handler.action),
                    validations = handler.validations || [],
                    guards = handler.guards || [];
        
                switch (handler.method){
                    case HttpMethod.ALL:
                        this.__router.all(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.DELETE:
                        this.__router.delete(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.GET:
                        this.__router.get(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.HEAD:
                        this.__router.head(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.OPTIONS:
                        this.__router.options(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.PATCH:
                        this.__router.patch(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.POST:
                        this.__router.post(handler.route, guards, validations, wrappedHandler);
                        break;
                    case HttpMethod.PUT:
                        this.__router.put(handler.route, guards, validations, wrappedHandler);
                        break;
                    default:
                        throw Error('incorrect http method')
                }
            }

            private wrapHandler(handler: RequestHandler): RequestHandler{
                handler = handler.bind(this);
        
                return function(req: Request, res: Response, next: NextFunction): Promise<any>{
        
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        res.status(422);
                        return Promise
                            .resolve(errors.mapped())
                            .then(error => res.json(<IResponseData>{error}));
                    } else {
                        return new Promise((resolve, reject) => {
                            try {
                                resolve(handler(req, res, next))
                            } catch (error) {
                                reject(error)
                            }
                        })
                        .then(data => res.json(<IResponseData>{data}))
                        .catch(error => {
                            res.status(500);
                            res.json(<IResponseData>{error})
                        })
                    }
                }
            }
        }
    }   
}


