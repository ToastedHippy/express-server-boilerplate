import {PgService} from "../../core/services/PgService";
import {pgArbitrageConfig} from "../../config/servicesConfig";

class ArbitrageService extends PgService {

    constructor() {
        console.log('creating ArbitrageService')
        super(pgArbitrageConfig);
    }
}

export const arbitrageService = new ArbitrageService();
