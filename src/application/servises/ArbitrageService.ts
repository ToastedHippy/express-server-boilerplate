import {PgService} from "../../core/services/PgService";
import {pgArbitrageConfig} from "../../config/servicesConfig";

class ArbitrageService extends PgService {

    constructor() {
        super(pgArbitrageConfig);
    }

    async getExchanges(){
        const query = `select * from arbitrage.get_actual_exchanges();`;
        const dbResp = await this.execute(query);
        return dbResp.rows;
    }

    async getPairs() {
        const query = `
            select pair_id as id,
                pair_name as name,
                base_cur_id,
                market_cur_id
            from arbitrage.a_pairs
        `;
        const dbResp = await this.execute(query);
        return dbResp.rows;
    }

    async getArbitrage(pairs: number[]) {
        const query = `
            select * 
            from arbitrage.get_data_graf('{${pairs || ''}}', 0, 99999999)
        `;
        const dbResp = await this.execute(query);
        return dbResp.rows;
    }

    async getExchangesData(pairs: number[]) {
        const query = `
            select * 
            from arbitrage.get_data_exchanges('{${pairs || ''}}', 0, 99999999)
        `;
        const dbResp = await this.execute(query);
        return dbResp.rows;
    }
    
}

export const arbitrageService = new ArbitrageService();
