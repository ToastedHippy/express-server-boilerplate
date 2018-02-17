import { RequestHandler, Request} from "express";
import { Controller } from "../../core/controller/ControllerDecorator";
import { Get } from "../../core/controller/HandlerDecorators";
import {jwtGuard} from "../guards/jwt/jwt.guard";

@Controller('/')
export class HomeController{


    @Get({
        route: '/',
        guards: jwtGuard
    })
    greeting(){
        return 'Hello dear friend!';
    }

}