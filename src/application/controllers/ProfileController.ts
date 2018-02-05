import {Request} from "express";
import {Controller, Handler, HttpMethod} from "../../core/controller/Controller";
import {PgService} from "../../core/services/PgService";
import {arbitrageService} from "../servises/ArbitrageService";
import {pgArbitrageConfig} from "../../config/servicesConfig";
import {query as checkQuery, body as checkBody, param as checkParam} from "express-validator/check";
import * as moment from "moment";


export class ProfileController extends Controller{

    pgService: PgService;

    constructor(){ 
        super();
        this.pgService = arbitrageService;        
    }

    @Handler({
        method: HttpMethod.POST,
        route: '/get-secrets',
        validations: [
            checkBody(['userId']).isInt(),
        ]
    })
    private async getSecrets(req: Request) {
        const query = `select * from arbitrage.get_personal_area(${req.body.userId})`
        console.log(query);
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows;
    }

    @Handler({
        method: HttpMethod.POST,
        route: '/update-secrets',
        validations: [
            checkBody(['id', 'userId', 'exchangeId']).isInt(),
        ]
    })
    private async updateSecrets(req: Request) {
        const query = `select * from arbitrage.upadate_personal_area(${req.body.id}, ${req.body.userId}, ${req.body.exchangeId}, '${req.body.apiKey || ''}', '${req.body.secretKey || ''}');`
        console.log(query);
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows;
    }

    @Handler({
        method: HttpMethod.POST,
        route: '/insert-secrets',
        validations: [
            checkBody(['userId', 'exchangeId']).isInt(),
        ]
    })
    private async insertSecrets(req: Request) {
        const query = `select * from arbitrage.insert_personal_area(${req.body.userId}, ${req.body.exchangeId}, '${req.body.apiKey || ''}', '${req.body.secretKey || ''}');`
        console.log(query);
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows;
    }

    @Handler({
        method: HttpMethod.POST,
        route: '/delete-secrets',
        validations: [
            checkBody(['id', 'userId']).isInt(),
        ]
    })
    private async deleteSecrets(req: Request) {
        const query = `select * from arbitrage.delete_personal_area(${req.body.id}, ${req.body.userId});`
        console.log(query);
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows;
    }
    
}
