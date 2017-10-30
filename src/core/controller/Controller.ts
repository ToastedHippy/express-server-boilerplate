import {Router, RequestHandler, Request, Response, NextFunction} from "express";
import { check, validationResult, ValidationChain } from "express-validator/check";
import {Handler} from "./HandlerDecorator";
import {IResponseData, IHandler, HttpMethod, HandlerOptions} from "./models"

export {Handler, HttpMethod, HandlerOptions};


export abstract class Controller{
    private _router: Router;
    private _handlers: IHandler[];
    testThis: Object;

    constructor(){
        this.testThis = this;

        this._router = Router();
        for (let handler of this._handlers || []) {
            this.registerHandler(handler);
        }
    }

    get handlers(){
        return this._handlers;
    }

    set handlers(value: IHandler[]){
        this._handlers = value;
    }

    get router(){
        return this._router;
    }

    private registerHandler(handler: IHandler) {
        const wrappedHandler = this.wrapHandler(handler.action),
            validations = handler.validations || [];

        switch (handler.method){
            case HttpMethod.ALL:
                this.router.all(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.DELETE:
                this.router.delete(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.GET:
                this.router.get(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.HEAD:
                this.router.head(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.OPTIONS:
                this.router.options(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.PATCH:
                this.router.patch(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.POST:
                this.router.post(handler.route, validations, wrappedHandler);
                break;
            case HttpMethod.PUT:
                this.router.put(handler.route, validations, wrappedHandler);
                break;
            default:
                throw Error('incorrect http method')
        }
    }

    private wrapHandler(handler: RequestHandler): RequestHandler{
        handler = handler.bind(this);

        return async function(req: Request, res: Response, next?: NextFunction){
            let result: IResponseData = {};

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422);
                result.errors = errors.mapped();
            } else {

                try {
                    result.data = await handler(req, res, next);
                } catch (error) {
                    res.status(500);
                    result.errors = error;
                }
            }
            res.json(result);
        }
    }

}