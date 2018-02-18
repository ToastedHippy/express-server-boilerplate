import * as passportJWT from "passport-jwt";
import {jwtSecret} from "../../../config/auth.config" 

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;


let jwtOptions: passportJWT.StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
}

export const jwtStrategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  // usually this would be a database call:
  next(null, {id: jwt_payload.userId});
});
