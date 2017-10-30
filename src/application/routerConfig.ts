import { Router } from "express";
import { HomeController } from "./controllers/HomeController";
import { IRouterConfig } from "../config/models";
import {ArbitrageController} from "./controllers/ArbitrageController";

export const routerConfig: IRouterConfig[] = [
    {path: '/', router: new HomeController().router},
    {path: '/arbitrage', router: new ArbitrageController().router}
];