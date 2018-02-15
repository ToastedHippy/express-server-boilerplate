import {Router, RequestHandler, Request, Response, NextFunction} from "express";
import { HttpMethod, IResponseData, IController, IHandler } from "./models";
import { ValidationChain, validationResult } from "express-validator/check";


export function Controller(path: string) {
    return function<T extends new(...args:any[])=>{}>(constructor:T):T {
        return class extends constructor implements IController {
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
                    validations = handler.validations || [];
        
                switch (handler.method){
                    case HttpMethod.ALL:
                        this.__router.all(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.DELETE:
                        this.__router.delete(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.GET:
                        this.__router.get(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.HEAD:
                        this.__router.head(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.OPTIONS:
                        this.__router.options(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.PATCH:
                        this.__router.patch(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.POST:
                        this.__router.post(handler.route, validations, wrappedHandler);
                        break;
                    case HttpMethod.PUT:
                        this.__router.put(handler.route, validations, wrappedHandler);
                        break;
                    default:
                        throw Error('incorrect http method')
                }
            }

            private wrapHandler(handler: RequestHandler): RequestHandler{
                handler = handler.bind(this);
        
                return function(req: Request, res: Response, next?: NextFunction): Promise<any>{
        
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        res.status(422);
                        return Promise
                            .resolve(errors.mapped())
                            .then(error => res.json(<IResponseData>{error}));
                    } else {
                        return Promise
                            .resolve(handler(req, res, next))
                            .then(result => res.json(<IResponseData>{data: result}))
                            .catch(errors => {
                                res.status(500);
                                res.json(<IResponseData>{error: errors})}
                            );
                    }
                }
            }
        }
    }   
}


