import { Request, Response, NextFunction, RequestHandler, Router } from "express";
import { Controller, HttpMethod, HandlerOptions} from "./Controller";


export type ReqHandlerRegistrator = (Router: Router) => void

export function Handler(options: HandlerOptions){
    return function (target: Controller, propertyKey: string, descriptor: PropertyDescriptor){
        
        if (!target.handlers) {
            target.handlers = [];
        }
    
        target.handlers.push({...options, action: descriptor.value});
    }
}
