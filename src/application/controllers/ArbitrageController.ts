import {Request} from "express";
import {Controller, Handler, HttpMethod} from "../../core/controller/Controller";
import {PgService} from "../../core/services/PgService";
import {pgArbitrageConfig} from "../../config/servicesConfig";
import {query as checkQuery} from "express-validator/check"

export class ArbitrageController extends Controller{

    pgService: PgService;

    constructor(){ 
        super();
        this.pgService = new PgService(pgArbitrageConfig);        
    }


    @Handler({
        method: HttpMethod.GET,
        route: '/get-exchanges',
    })    
    private async getExchanges(req: Request){
        const query = 'select * from arbitrage.exchanges';
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows;
    }

    @Handler({
        method: HttpMethod.GET,
        route: '/get-test',
        validations: [
            checkQuery(['country-id', 'region-id']).isInt(),
            checkQuery(['date-start']).isISO8601()
        ]
    })
    private async getTest(req: Request){
        return 'test';
    }

    @Handler({
        method: HttpMethod.GET,
        route: '/get-pairs'
    })
    private async getPairs(req: Request) {
        const query = `
            select pair_id as id,
                pair_name as name,
                base_cur_id,
                market_cur_id
            from arbitrage.a_pairs
        `;
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows;
    }

    @Handler({
        method: HttpMethod.GET,
        route: '/get-table',
        validations: [
            checkQuery(['pair', 'min', 'max']).isInt()
        ]
    })
    private async getTable(req: Request) {
        const query = `
            select * 
            from arbitrage.get_data_graf(${req.query.pair}, ${req.query.min}, ${req.query.max})
        `;
        console.log(query);
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows.map(r => {
            return {
                time: r.time,
                pairs_name: r.pairs_name,
                exchanges_a: r.exchanges_a,
                exchanges_a_name: r.exchanges_a_name,
                exchanges_b: r.exchanges_b,
                exchanges_b_name: r.exchanges_b_name,
                lowest_ask: r.lowest_ask ? +r.lowest_ask : null,
                base_volume_a: r.base_volume_a ? +r.base_volume_a : null,
                last: r.last ? +r.last : null,
                base_volume_b: r.base_volume_b ? +r.base_volume_b : null,
                ask: r.ask ? +r.ask : null,
                ask_percent: r.ask_percent ? +r.ask_percent : null,
                ask_diff: r.ask_diff ? +r.ask_diff : null
            }
        });
    }

    // @Handler({
    //     method: HttpMethod.GET,
    //     route: '/get-chart'
    // })
    // private async getChart(req: Request) {
    //     const query = `
    //         select * 
    //         from arbitrage.get_chart_data(1, 1)
    //     `;
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows.map(e => {
    //         return {
    //             time_ms: e.time_ms * 1000,
    //             plx_lowest: e.plx_lowest ? +e.plx_lowest : e.plx_lowest,
    //             plx_highest: e.plx_highest ? +e.plx_highest : e.plx_highest,
    //             plx_volume: e.plx_volume ? +e.plx_volume : e.plx_volume,
    //         };
    //     });
    // }


    @Handler({
        method: HttpMethod.GET,
        route: '/get-chart',
        validations: [
            checkQuery(['pair']).isInt()
        ]
    })
    private async getChart(req: Request) {
        let activeExchProms: Promise<any>[] = [],
            activeExchNames: string[] = [];

        const exchangesQ = 'select * from arbitrage.a_exchanges where enabled = true';

        const activeExch = await this.pgService.execute(exchangesQ);

        if (activeExch.rows.length) {
            for (let exch of activeExch.rows) {
                let query = `select * from arbitrage.get_chart_data(${req.query.pair}, 50, ${exch.ex_id})`;
                console.log(query);
                activeExchProms.push(this.pgService.execute(query));
                activeExchNames.push(exch.name);
            }
        }

        const dbResp = await Promise.all(activeExchProms);


        return activeExchNames.map((e,i) => {
            return {
                name: e,
                data: dbResp[i].rows.map((r:any) => {
                    return {
                        time: +r.time_s * 1000,
                        lowest: r.lowest ? +r.lowest : null,
                        highest: r.highest ? +r.highest : null,
                        volume: r.volume ? +r.volume : null
                    }
                })
            }
        })
        
    }
}
