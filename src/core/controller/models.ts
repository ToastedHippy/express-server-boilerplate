import {RequestHandler} from "express";
import {ValidationChain} from "express-validator/check"

export interface IResponseData {
    errors?: any,
    data?: any;
}

export interface HandlerOptions {
    method: HttpMethod;
    route: string;
    validations?: ValidationChain[]
}

export interface IHandler extends HandlerOptions {
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