import {Request} from "express";
import {Controller, Handler, HttpMethod} from "../../core/controller/Controller";
import {PgService} from "../../core/services/PgService";
import {pgArbitrageConfig} from "../../config/servicesConfig";
import {query as checkQuery} from "express-validator/check";
import * as moment from "moment";


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
        method: HttpMethod.POST,
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
        method: HttpMethod.POST,
        route: '/get-arbitrage'
    })
    private async getTable(req: Request) {
        const query = `
            select * 
            from arbitrage.get_data_graf('{${req.body.pairs ? req.body.pairs : ''}}', 0, 99999999)
        `;
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
				fee_a: r.fee_a ? +r.fee_a : null,
				ex_fee_a: r.ex_fee_a ? +r.ex_fee_a : null,
				fee_b: r.fee_b ? +r.fee_b : null,
				ex_fee_b: r.ex_fee_b ? +r.ex_fee_b : null,
                last: r.last ? +r.last : null,
                base_volume_b: r.base_volume_b ? +r.base_volume_b : null,
				profit: r.profit ? +r.profit : null
            }
        });
    }

    @Handler({
        method: HttpMethod.POST,
        route: '/get-exchanges-data'
    })
    private async gedExchangesData(req: Request) {
        const query = `
            select * 
            from arbitrage.get_data_exchanges('{${req.body.pairs ? req.body.pairs : ''}}', 0, 99999999)
        `;
        const dbResp = await this.pgService.execute(query);
        return dbResp.rows.map(r => {
            return {
                time: r.time,
                pair_id: r.pair_id,
                pairs_name: r.pairs_name,
                exchanges_a: r.exchanges_a,
                exchanges_a_name: r.exchanges_a_name,
                exchanges_b: r.exchanges_b,
                exchanges_b_name: r.exchanges_b_name,
                lowest_ask: r.lowest_ask ? +r.lowest_ask : null,
				base_volume_a: r.base_volume_a ? +r.base_volume_a : null,
				fee_a: r.fee_a ? +r.fee_a : null,
				ex_fee_a: r.ex_fee_a ? +r.ex_fee_a : null,
				fee_b: r.fee_b ? +r.fee_b : null,
				ex_fee_b: r.ex_fee_b ? +r.ex_fee_b : null,
                last: r.last ? +r.last : null,
                base_volume_b: r.base_volume_b ? +r.base_volume_b : null,
				ask_bid: r.ask_bid ? +r.ask_bid : null
            }
        });
    }


    @Handler({
        method: HttpMethod.GET,
        route: '/get-chart',
        validations: [
			checkQuery(['pair']).isInt(),
			checkQuery(['period']).isInt(),
			checkQuery(['step']).isInt()
        ]
    })
    private async getChart(req: Request) {
        let activeExchProms: Promise<any>[] = [],
			activeExchNames: string[] = [],
            startTime: string,
            diffNum: number = 6,
            diffPart: moment.DurationInputArg2 = 'h',
			timeStep: string = '15 munute',
			now = moment();
		
			switch (+req.query.period) {
                case 1: // 6h
                    diffNum = 6;
                    diffPart = 'h';
					break;
                case 2: // 24h
                    diffNum = 24;
                    diffPart = 'h';
					break;
                case 3: // 2 d
                    diffNum = 2;
                    diffPart = 'd';
					break;
                case 4: // 4 d
                    diffNum = 4;
                    diffPart = 'd';
					break;
                case 5: // 1 w
                    diffNum = 1;
                    diffPart = 'w';
					break;
				default:
					break;
            }
            
            startTime = now.clone().startOf('minute').subtract(diffNum, diffPart).format('YYYY-MM-DD HH:mm');

			switch (+req.query.step) {
				case 1: // 15m
					timeStep = '15 minute';
					break;
				case 2: // 30 m
					timeStep = '30 minute';
					break;
				case 3: // 2 h
					timeStep = '2 hour';
					break;
				case 4: // 4 h
					timeStep = '4 hour';
					break;
				case 5: // 1 d
					timeStep = '1 day';
					break;
				default:
					break;
			}

        const exchangesQ = 'select * from arbitrage.a_exchanges where enabled = true and ex_id in (104, 101)';

        const activeExch = await this.pgService.execute(exchangesQ);

        if (activeExch.rows.length) {
            for (let exch of activeExch.rows) {
                let query = `select * from arbitrage.get_stepped_data_since(${req.query.pair}, ${exch.ex_id}, '${startTime}', '${now.format('YYYY-MM-DD HH:mm')}', '${timeStep}')`;
                // console.log(query);
                activeExchProms.push(this.pgService.execute(query));
                activeExchNames.push(exch.name);
            }
        }
        const dbResp = await Promise.all(activeExchProms);

		let priceChartData: {
			name: string;
			time: number;
			value: number;
		}[] = [];

		let	volumeChartData: {
			name: string;
			data: {
				time: number;
				value: number;
			}[]
		}[] = [];

		activeExchNames.forEach((e, i) => {

			let volumeData: {
				time: number;
				value: number;
			}[] = [];

			dbResp[i].rows.forEach((r: any) => {
				if (r.value) {
					if (r.indicator == 3) {
						volumeData.push({
							time: moment(r.time_s * 1000).subtract(5,'h').unix()*1000, // set UTC time,,
							value: r.value ? +r.value : null
						});
					} else {
						priceChartData.push({
							name: `${e}_${r.indicator}`,
							time: moment(r.time_s * 1000).subtract(5,'h').unix()*1000, // set UTC time,
							value: r.value ? +r.value : null
						})
					}
				}
			});

			volumeChartData.push(
				{
					name: e,
					data: volumeData
				}
			);

        })

        return {
			priceChartData: priceChartData,
			volumeChartDate: volumeChartData
		}
        
    }
}
