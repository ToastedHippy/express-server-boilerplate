import {Request} from "express";
import {Controller} from "../../core/controller/ControllerDecorator";
import {Get, Post} from "../../core/controller/HandlerDecorators";
import {arbitrageService} from "../servises/ArbitrageService";
import {query as checkQuery, body as checkBody, param as checkParam} from "express-validator/check";
import * as moment from "moment";


@Controller('/arbitrage')
export class ArbitrageController {

    constructor(){}


    @Get({
        route: '/exchanges',
    })    
    private async getExchanges(){
        return await arbitrageService.getExchanges();
    }


    @Get({
        route: '/pairs'
    })
    private async getPairs(req: Request) {
       return arbitrageService.getPairs();
    }

    @Get({
        route: '/arbitrage',
    })
    private async getArbitrage(req: Request) {

        const pairs = req.query.pairs ? req.query.pairs.split(',') : [];
        const dbResp = await arbitrageService.getArbitrage(pairs);
        return dbResp.map(r => {
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

    @Get({
        route: '/exchanges-data'
    })
    private async getExchangesData(req: Request) {
        const pairs = req.query.pairs ? req.query.pairs.split(',') : [];
        const dbResp = await arbitrageService.getExchangesData(pairs);

        return dbResp.map(r => {
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



    // @Post({
    //     route: '/transaction',
    //     validations: [
    //         checkBody(['userId', 'pair_id', 'exchanges_a', 'exchanges_b']).isInt(),
    //         checkBody(['volumeXMR', 'minProfit']).isFloat(),
    //     ]
    // })
    // private async insertActiveTransaction(req: Request) {
    //     const query = `
    //     select * 
    //     from arbitrage.insert_active(${req.body.userId}, ${req.body.pair_id}, ${req.body.exchanges_a}, ${req.body.exchanges_b}, ${req.body.minProfit}, '${req.body.volumeXMR}')`
    //     console.log(query);
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows && dbResp.rows.length ? dbResp.rows[0].insert_active : null;
    // }


    // @Get({
    //     route: '/transactions',
    //     validations: [
    //         checkBody(['userId']).isInt(),
    //     ]
    // })
    // private async getTransactions(req: Request) {
    //     const query = `
    //         select * 
    //         from arbitrage.active_transactions(${req.body.userId})
    //         order by id
    //     `;
    //     // console.log(query)
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows.map(r => {
    //         return {
    //             id: r.id,
    //             exchanges_a_name: r.exchanges_a_name,
    //             pair_name: r.pair_name,
    //             exchanges_b_name: r.exchanges_b_name,              
    //             lowest_ask_a: r.lowest_ask_a ? +r.lowest_ask_a : null,
    //             base_volume_a: r.base_volume_a ? +r.base_volume_a : null,
    //             bid_a: r.bid_a ? +r.bid_a : null,
    //             ex_fee_a: r.ex_fee_a ? +r.ex_fee_a : null,
    //             profit_a: r.profit_a ? +r.profit_a : null,
    //             bid_b: r.bid_b ? +r.bid_b : null,
    //             volume_transaction: r.volume_transaction ? +r.volume_transaction : null,
    //             lowest_ask_b: r.lowest_ask_b ? +r.lowest_ask_b : null,
    //             ex_fee_b: r.ex_fee_b ? +r.ex_fee_b : null,
    //             profit_b: r.profit_b ? +r.profit_b : null,
    //             ask_bid: r.ask_bid ? +r.ask_bid : null,
    //             comparison_price: r.comparison_price ? +r.comparison_price : null,
    //             all_profit: r.all_profit ? +r.all_profit : null
    //         }
    //     });
    // }

    // @Post({
    //     route: '/transactions/delete',
    //     validations: [checkBody(['userId', 'id']).isInt()]
    // })
    // private async deleteTransaction(req: Request) {
    //     const query = `
    //     select *  from arbitrage.delete_transaction(${req.body.userId}, ${req.body.id})`;
    //     console.log(query);
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows && dbResp.rows.length ? dbResp.rows[0].delete_transaction : null;
    // }

    // @Post({
    //     route: '/transactions/history',
    //     validations: [checkBody(['userId']).isInt()]
    // })
    // private async getTransactionsHistory(req: Request) {
    //     const query = `
    //         select * 
    //         from arbitrage.get_history(${req.body.userId})
    //         order by id
    //     `;
    //     console.log(query);
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows.map(r => {
    //         return {
    //             id: r.id,
    //             exchanges_a_name: r.exchanges_a_name,
    //             pair_name: r.pair_name,
    //             exchanges_b_name: r.exchanges_b_name,              
    //             lowest_ask_a: r.lowest_ask_a ? +r.lowest_ask_a : null,
    //             base_volume_a: r.base_volume_a ? +r.base_volume_a : null,
    //             bid_a: r.bid_a ? +r.bid_a : null,
    //             ex_fee_a: r.ex_fee_a ? +r.ex_fee_a : null,
    //             profit_a: r.profit_a ? +r.profit_a : null,
    //             bid_b: r.bid_b ? +r.bid_b : null,
    //             volume_transaction: r.volume_transaction ? +r.volume_transaction : null,
    //             lowest_ask_b: r.lowest_ask_b ? +r.lowest_ask_b : null,
    //             ex_fee_b: r.ex_fee_b ? +r.ex_fee_b : null,
    //             profit_b: r.profit_b ? +r.profit_b : null,
    //             ask_bid: r.ask_bid ? +r.ask_bid : null,
    //             all_profit: r.all_profit ? +r.all_profit : null
    //         }
    //     });
    // }

    // @Post({
    //     route: '/transactions/history/delete',
    //     validations: [checkBody(['userId', 'id']).isInt()]
    // })
    // private async deleteTransactionFromHistory(req: Request) {
    //     const query = `
    //     select *  from arbitrage.delete_personal_history(${req.body.userId}, ${req.body.id})`;
    //     console.log(query);
    //     const dbResp = await this.pgService.execute(query);
    //     return dbResp.rows && dbResp.rows.length ? dbResp.rows[0].delete_transaction : null;
    // }
}
