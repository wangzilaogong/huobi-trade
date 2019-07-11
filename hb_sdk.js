
const config = require('./config/config')
const HTTPOBJ = require('./help/httpHelp')

const urlUtil = require('url')
const moment = require('moment')
const pako = require('pako');
const ws = require('./help/websocket')

const HOST = urlUtil.parse(config.REST_URL).host 

function get_commonQuery() { // 参数
    return {
        AccessKeyId: config.API_AK,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}


function get_queryParams(data){
    let dataParams = []
    for (let item in data){
        dataParams.push(item + '=' + encodeURIComponent(data[item]))
    }
    let queryParams = dataParams.sort().join('&')
    return queryParams
}


console.log(HOST,'now request HOST') // api.huobi.pro

function hanldeZipToString(data){
    return JSON.parse(pako.inflate(data,{
        to:'string'
    }))
}


const HB_REST = {
    /************市场数据***************/
    getCommonSymbols:()=>{ //获取所有的交易对
        const path = `/v1/common/symbols`
        return HTTPOBJ.call_api('GET',path)
    },
    getAllCurrencys:()=>{ // 获取所有币种
        const path = `/v1/common/currencys`
        return HTTPOBJ.call_api('GET',path)
    },
    getCurrentTime:()=>{ // 获取当前系统时间
        const path = `/v1/common/timestamp`
        return HTTPOBJ.call_api('GET',path)
    },
    getHistoryKline:(symbol,period,size)=>{ //获取历史kline 数据
        const path = `/market/history/kline`
        const queryParams =  {
            symbol,period,size
        }
        const payload = get_queryParams(queryParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getTicker:(symbol)=>{ //获取聚合行情数据
        const path = `/market/detail/merged`
        const queryParams =  {
            symbol
        }
        const payload = get_queryParams(queryParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getAllTickers:()=>{ //所有交易对的最新 Tickers
        const path = `/market/tickers`
        return HTTPOBJ.call_api('GET',path)
    },
    getDepth:(symbol , depth,type)=>{ //此接口返回指定交易对的当前市场深度数据。
        const path = `/market/depth`
        const queryParams = {
            symbol,
            depth,
            type
        }
        const payload = get_queryParams(queryParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getLastestTrade:(symbol)=>{ //此接口返回指定交易对最新的一个交易记录。
        const path = `/market/trade`
        const queryParams = {
            symbol
        }
        const payload = get_queryParams(queryParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getHistoryTrade:(symbol,size)=>{ //此接口返回指定交易对近期的所有交易记录。
        const path = `/market/history/trade`
        const queryParams = {
            symbol,
            size
        }
        const payload = get_queryParams(queryParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    get24hMarket:(symbol)=>{ //最近24小时行情数据
        const path = `/market/detail`
        const queryParams = {
            symbol
        }
        const payload = get_queryParams(queryParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    /************* 账户相关*********************/
    getAccount :() =>{ //获取accountInfo
        const path = `/v1/account/accounts`
        const commonQuery = get_commonQuery()
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,commonQuery)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getBalance:(account_id)=>{ // 查询指定账户的余额
        const path = `/v1/account/accounts/${account_id}/balance`
        const commonQuery = get_commonQuery()
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,commonQuery)
        return HTTPOBJ.call_api('GET',path,payload)
    },

    /************交易相关***************/
    postOrder:(type , symbol , amount,price ,source)=>{
        const postBody = {
           'account-id':config.ACCOUNT_ID,
            symbol:symbol,
            type:type,
            amount:amount,
            price:price,
            source:source || 'api'
        }
        const path = `/v1/order/orders/place`
        const commonQuery = get_commonQuery()
        const payload = HTTPOBJ.sign_sha('POST',HOST,path,commonQuery)
        return HTTPOBJ.call_api('POST',path,payload,postBody)
    },
    cancelOrder:(order_id)=>{
        const postBody = {
            'order-id':order_id,
         }
        const path = `/v1/order/orders/${order_id}/submitcancel`
        const commonQuery = get_commonQuery()
        const payload = HTTPOBJ.sign_sha('POST',HOST,path,commonQuery)
        return HTTPOBJ.call_api('POST',path,payload,postBody)
    },
    getUndoneOrders:(symbol,side,size)=>{ //查询已提交但是仍未完全成交或未被撤销的订单
        const commonQuery = get_commonQuery()
        const getParams = {
            'account-id':config.ACCOUNT_ID,
            symbol:symbol,
            side:side || 'both',
            size :size || 10,
            ...commonQuery
         }
        const path = `/v1/order/openOrders`
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,getParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    cancelListOrders:(symbol , side ,size)=>{ //此接口发送批量撤销订单的请求
        const commonQuery = get_commonQuery()
        const postBody = {
            'account-id':config.ACCOUNT_ID,
            symbol:symbol,
            side:side || 'both',
            size :size || 10,
         }
        const path = `/v1/order/orders/batchCancelOpenOrders`
        const payload = HTTPOBJ.sign_sha('POST',HOST,path,commonQuery)
        return HTTPOBJ.call_api('POST',path,payload,postBody)
    },
    getOrderDetail:(order_id)=>{ //查询已提交但是仍未完全成交或未被撤销的订单
        const commonQuery = get_commonQuery()
        const getParams = {
            'order-id':order_id,
            ...commonQuery
         }

        const path = `/v1/order/orders/${order_id}`
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,getParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getOrderDetail:(order_id)=>{ //此接口返回指定订单的成交明细
        const commonQuery = get_commonQuery()
        const getParams = {
            'order-id':order_id,
            ...commonQuery
         }
        const path = `/v1/order/orders/${order_id}/matchresults`
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,getParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    //https://huobiapi.github.io/docs/spot/v1/cn/#d72a5b49e7
    getHistoryOrders:(searchQuery)=>{ //****/此接口基于搜索条件查询历史订单
        const commonQuery = get_commonQuery()
        const getParams = {
            ...searchQuery,
            ...commonQuery
         }
        const path = `/v1/order/orders`
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,getParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    //https://huobiapi.github.io/docs/spot/v1/cn/#48
    get48hHistoryOrders:(searchQuery)=>{ //****/此接口基于搜索条件查询最近48小时内历史订单
        const commonQuery = get_commonQuery()
        const getParams = {
            ...searchQuery,
            ...commonQuery
         }
        const path = `/v1/order/history`
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,getParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    //https://huobiapi.github.io/docs/spot/v1/cn/#0fa6055598
    get48hHistoryOrders:(searchQuery)=>{ //****/此接口基于搜索条件查询当前和历史成交记录。
        const commonQuery = get_commonQuery()
        const getParams = {
            ...searchQuery,
            ...commonQuery
            }
        const path = `/v1/order/matchresults`
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,getParams)
        return HTTPOBJ.call_api('GET',path,payload)
    },
}









// HB 的websocket 接口
const HB_WS = {
    initWs:(theme ,f)=>{ 
        ws.on('open',()=>{
            console.log('************* WEBSOCKET OPEN **********')
            HB_WS.subscribe(theme)
        })
        ws.on('message',(data)=>{
            let message = hanldeZipToString(data)
            if(message.ping){
                //receive ping & send pong 
                ws.send(JSON.stringify({pong:message.ping}))
            }else if(message.tick){
                f(message.tick)
            }
        })
        ws.on('close',()=>{
        console.log('************* WEBSOCKET CLOSE **********')
        initWs(theme,f)
        
        })
        ws.on('error', err =>{
            console.log('ws error' ,err)
        initWs(theme,f)

        })
    },
     subscribe:(theme)=>{
        console.log('************* SEND THEME**********')
        ws.send(theme)
  }
  
}

async function aaaa(){
// const res =  await HB_REST.getAccount()
// console.log(res.data[0].id,'sss2')
// const qq = await HB_REST.getBalance(res.data[0].id)
// console.log(qq.data.list,'sss')
// qq.data.list.map((item)=>{
//     console.log(item)
// })
// const res2 = await HB_REST.postOrder('sell-limit', 'hptusdt',21,0.15492)
// console.log(res2 ,'result')
// const rrrr = await HB_REST.cancelOrder(39831136241)
// console.log(rrrr ,'result')
// console.log(ws,'sss')
// const res = await HB_REST.get24hHistoryOrders()
// console.log(res)
Object.keys(HB_REST).map((I)=>{
    console.log(I)
})
}
aaaa()

exports.HB_REST = HB_REST
exports.HB_WS = HB_WS