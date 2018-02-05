import {Request} from "express";
import {Controller, Handler, HttpMethod} from "../../core/controller/Controller";
import {PgService} from "../../core/services/PgService";
import {arbitrageService} from "../servises/ArbitrageService";
import {pgArbitrageConfig} from "../../config/servicesConfig";
import {query as checkQuery, body as checkBody, param as checkParam} from "express-validator/check";
import * as moment from "moment";


export class AuthController extends Controller{

    pgService: PgService;

    constructor(){ 
        super();
        this.pgService = arbitrageService;        
    }

    @Handler({
        method: HttpMethod.POST,
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
