import {IServerConfig} from "../core/models/Server.model";
import {jwtStrategy} from "../application/guards/jwt/jwt.strategy"

 export const serverConfig: IServerConfig = {
     port: 3000,
     authStrategies: [jwtStrategy]
 };