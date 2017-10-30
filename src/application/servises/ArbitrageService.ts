import {PgService} from "../../core/services/PgService";
import {pgArbitrageConfig} from "../../config/servicesConfig";

class ArbitrageService extends PgService {

    constructor() {
        console.log('creating ArbitrageService')
        super(pgArbitrageConfig);
    }

    async getExchanges() {
        const query = 'select * from arbitrage.exchanges';

        const dbResp = await this.execute(query);

        return dbResp.rows;
    }
}

export const arbitrageService = new ArbitrageService();
