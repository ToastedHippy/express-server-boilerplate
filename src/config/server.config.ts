import {IServerConfig} from "./models";
import {jwtStrategy} from "../application/guards/jwt/jwt.strategy"

 export const serverConfig: IServerConfig = {
     port: 3000,
     authStrategies: [jwtStrategy]
 };