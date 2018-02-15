import {Request} from "express";
import {Controller} from "../../core/controller/ControllerDecorator";
import {PgService} from "../../core/services/PgService";
import {arbitrageService} from "../servises/ArbitrageService";
import {pgArbitrageConfig} from "../../config/servicesConfig";
import {query as checkQuery, body as checkBody, param as checkParam} from "express-validator/check";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";
import { Get, Post } from "../../core/controller/HandlerDecorators";

@Controller('auth')
export class AuthController{

    pgService: PgService;

    constructor(){ 
        this.pgService = arbitrageService;        
    }

    @Post({
        route: '/login',
        validations: [
            checkBody(['username', 'password']).isLength({min: 1}),
        ]
    })
    private async insertActiveTransaction(req: Request) {
        const query = `
        select * 
        from arbitrage.users
        where name = '${req.body.username}'
        and password = '${req.body.password}'`
        console.log(query);
        const dbResp = await this.pgService.execute(query);
        return {
            success: !!dbResp.rows.length, 
            message: dbResp.rows.length ? '' : 'неверное имя пользователя или пароль',
            token: dbResp.rows.length ? dbResp.rows[0].id : null
        };
    }

    
}
