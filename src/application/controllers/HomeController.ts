import { RequestHandler, Request} from "express";
import {Controller} from "../../core/decorators/Controller.decorator";
import { Get, Post } from "../../core/decorators/Handler.decorator";
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