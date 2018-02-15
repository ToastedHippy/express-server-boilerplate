import {HTTPServer} from "./core/HTTPServer";
import {serverConfig} from "./config/serverConfig";
import { ArbitrageController } from "./application/controllers/ArbitrageController";
import { HomeController } from "./application/controllers/HomeController";
import { AuthController } from "./application/controllers/AuthController";
import { ProfileController } from "./application/controllers/ProfileController";

new HTTPServer(serverConfig, [
    HomeController,
    ArbitrageController
]).start();