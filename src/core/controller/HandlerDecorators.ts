import { HandlerOptions, HttpMethod } from "./models";

function createHandler(method: HttpMethod, options: HandlerOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.__handlers) {
            target.__handlers = [];
        }
        target.__handlers.push({...options, method, action: descriptor.value});
    }
}

export function Get(options: HandlerOptions) {
    return createHandler(HttpMethod.GET, options);
}

export function Post(options: HandlerOptions) {
    return createHandler(HttpMethod.POST, options);
}
