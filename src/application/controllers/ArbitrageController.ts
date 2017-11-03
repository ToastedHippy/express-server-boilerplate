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

    // @Handler({
    //     method: HttpMethod.GET,
    //     route: '/get-chart',
    //     validations: [
    //         checkQuery(['pair']).isInt(),
    //         checkQuery(['period']).isInt()
    //     ]
    // })
    // private async getChart(req: Request) {
		
	// 	let startTime: number,
	// 		timeDiff: number,
	// 		nth: number,
	// 		now = moment().add(5, 'h');

	// 	switch (+req.query.period) {
	// 		case 1: // 6h
	// 			startTime = now.clone().subtract(15, 'm').unix();
	// 			break;
	// 		case 2: // 24 h
	// 			startTime = now.clone().subtract(30, 'm').unix();
	// 			break;
	// 		case 3: // 2 d
	// 			startTime = now.clone().subtract(2, 'h').unix();
	// 			break;
	// 		case 4: // 4 d
	// 			startTime = now.clone().subtract(4, 'h').unix();
	// 			break;
	// 		case 5: // 1 w
	// 			startTime = now.clone().subtract(1, 'd').unix();
	// 			break;
	// 		default:
	// 			startTime = now.clone().subtract(15, 'm').unix();
	// 			break;
	// 	}

	// 	timeDiff = (now.unix() - startTime) / 60;

	// 	nth = Math.round(timeDiff / 1500)

	// 	if (nth < 1) {
	// 		nth = 1;
	// 	}

    //     const query = `
    //         select * 
    //         from arbitrage.get_chart_data_by_exchanges(${req.query.pair}, ${nth}, ${startTime})
	// 	`;
		
	// 	console.log(query);
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows.map(e => {
    //         for (let key in e) {
    //             if (key === 'time_s') {
    //                 e['time'] = moment(e[key] * 1000).subtract(5,'h').unix()*1000; // set UTC time
    //             } else {
    //                 e[key] = e[key] ? +e[key] : null;
    //             }
    //         }
    //         return e;
    //     });
    // }


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
			startTime: number,
			timeStep: number,
			now = moment().add(5, 'h');
		
			switch (+req.query.period) {
				case 1: // 6h
					startTime = now.clone().subtract(6, 'h').unix();
					break;
				case 2: // 24h
					startTime = now.clone().subtract(24, 'h').unix();
					break;
				case 3: // 2 d
					startTime = now.clone().subtract(2, 'd').unix();
					break;
				case 4: // 4 d
					startTime = now.clone().subtract(4, 'd').unix();
					break;
				case 5: // 1 w
					startTime = now.clone().subtract(1, 'w').unix();
					break;
				default:
					startTime = now.clone().subtract(15, 'm').unix();
					break;
			}

			switch (+req.query.step) {
				case 1: // 15m
					timeStep = 15;
					break;
				case 2: // 30 m
					timeStep = 30;
					break;
				case 3: // 2 h
					timeStep = 120;
					break;
				case 4: // 4 h
					timeStep = 240;
					break;
				case 5: // 1 d
					timeStep = 1440;
					break;
				default:
					timeStep = 15;
					break;
			}

        const exchangesQ = 'select * from arbitrage.a_exchanges where enabled = true';

        const activeExch = await this.pgService.execute(exchangesQ);

        if (activeExch.rows.length) {
            for (let exch of activeExch.rows) {
                let query = `select * from arbitrage.get_all_stepped_data_by_indicators(${req.query.pair}, ${exch.ex_id}, ${startTime}, ${timeStep})`;
                console.log(query);
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
