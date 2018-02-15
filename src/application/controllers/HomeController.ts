import { RequestHandler, Request} from "express";
import { Controller } from "../../core/controller/ControllerDecorator";
import { Get } from "../../core/controller/HandlerDecorators";

@Controller('/')
export class HomeController{


    @Get({
        route: '/'
    })
    private greeting(){
        return 'Hello dear friend!';
    }

}