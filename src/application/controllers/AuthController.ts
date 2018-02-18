import {Request} from "express";
import {Controller} from "../../core/controller/ControllerDecorator";
import {query as checkQuery, body as checkBody, param as checkParam} from "express-validator/check";
import * as jwt from "jsonwebtoken";
import { Get, Post } from "../../core/controller/HandlerDecorators";
import * as bcrypt from "bcrypt"
import {jwtSecret} from "../../config/auth.config";
import {someDBService} from "../servises/someDB.service";

@Controller('/auth')
export class AuthController{

    jwtSecret = jwtSecret;
    jwtExpiresIn = '5m';

    @Post({
        route: '/login',
        validations: [
            checkBody(['login', 'password']).isLength({min: 1}),
        ]
    })
    async login(req: Request) {

        let user = await someDBService.getUserByLogin(req.body.login);

        if(user) {
            let matchedPswd = await bcrypt.compare(req.body.password, user.password)
            
            if(matchedPswd) {
                const payload = {userId: user.id, userName: user.login};
                const token = jwt.sign(payload, this.jwtSecret,{expiresIn: this.jwtExpiresIn});
                return {token};
                
            } else {
                throw('неверный пароль')
            }
        } else {
            throw('пользователя не существует')
        }
    }

    
}
