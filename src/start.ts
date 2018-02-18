import {HTTPServer} from "./core/HTTPServer";
import {serverConfig} from "./config/server.config";

import { HomeController } from "./application/controllers/HomeController";
import { AuthController } from "./application/controllers/AuthController";

new HTTPServer(serverConfig, 
    [
        AuthController,
        HomeController,
    ]
).start();
