import {Handler, RequestHandler, Router} from "express";
import {ValidationChain} from "express-validator/check"

export interface IResponseData {
    error?: any,
    data?: any;
}

export interface HandlerOptions {
    route: string;
    guards?: Handler[];
    validations?: ValidationChain[]
}

export interface IController {
    __path: string;
    __router: Router;
}

export interface IHandler extends HandlerOptions {
    method: HttpMethod;
    action: RequestHandler;
}

export interface HandlerOptions {
    route: string;
    validations?: ValidationChain[]
}

export enum HttpMethod {
    GET,
    POST,
    PATCH,
    PUT,
    DELETE,
    HEAD,
    OPTIONS,
    ALL
}

export interface Controller {
    new (...args: any[]): any
}