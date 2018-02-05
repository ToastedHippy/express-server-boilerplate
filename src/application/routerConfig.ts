import { Router } from "express";
import { HomeController } from "./controllers/HomeController";
import { IRouterConfig } from "../config/models";
import {ArbitrageController} from "./controllers/ArbitrageController";
import {AuthController} from "./controllers/AuthController";
import {ProfileController} from "./controllers/ProfileController";

export const routerConfig: IRouterConfig[] = [
    {path: '/', router: new HomeController().router},
    {path: '/api/arbitrage', router: new ArbitrageController().router},
    {path: '/api/auth', router: new AuthController().router},
    {path: '/api/profile', router: new ProfileController().router},
];