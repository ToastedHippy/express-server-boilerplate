import {Handler, RequestHandler} from "express";
import {ValidationChain} from "express-validator/check"

export interface IResponseData {
    error?: any,
    data?: any;
}

export interface HandlerOptions {
    route: string;
    guard?: Handler;
    validations?: ValidationChain[]
}


export interface IHandler extends HandlerOptions {
    method: HttpMethod;
    action: RequestHandler;
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