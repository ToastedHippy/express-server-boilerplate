import {Request} from "express";
import {Controller} from "../../core/controller/ControllerDecorator";
import {query as checkQuery, body as checkBody, param as checkParam} from "express-validator/check";
import * as jwt from "jsonwebtoken";
import { Get, Post } from "../../core/controller/HandlerDecorators";
import * as bcrypt from "bcrypt"
import {jwtSecret} from "../../config/auth.config";

@Controller('/auth')
export class AuthController{

    pswdSaltRounds = 12;
    jwtSecret = jwtSecret;
    jwtExpiresIn = '5m';

    @Post({
        route: '/login',
        validations: [
            checkBody(['login', 'password']).isLength({min: 1}),
        ]
    })
    async login(req: Request) {

        let users = [
            {id: 1, login: 'user1', password: 'passwordU1'},
            {id: 2, login: 'user2', password: 'passwordU2'}
        ];

        for(let user of users) {
            let hashedPswd = await bcrypt.hash(user.password, this.pswdSaltRounds)
            user.password = hashedPswd;
        }


        let user = await Promise.resolve(users.find(u => u.login === req.body.login));

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
