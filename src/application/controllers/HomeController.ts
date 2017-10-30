import { RequestHandler, Request} from "express";
import { Controller, Handler, HttpMethod} from "../../core/controller/Controller";

export class HomeController extends Controller{
    constructor(){ super(); }

    @Handler({
        method: HttpMethod.GET,
        route: '/'
    })
    private greeting(req: Request){
        return 'Hello dear friend!';
    }

}