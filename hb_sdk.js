
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

console.log(HOST) // api.huobi.pro

function hanldeZipToString(data){
    return JSON.parse(pako.inflate(data,{
        to:'string'
    }))
}


const HB_REST = {
    getAccount :function(){ //获取account_id
        const path = `/v1/account/accounts`
        const commonQuery = get_commonQuery()
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,commonQuery)
        return HTTPOBJ.call_api('GET',path,payload)
    },
    getBalance:(account_id)=>{
        const path = `/v1/account/accounts/${account_id}/balance`
        const commonQuery = get_commonQuery()
        const payload = HTTPOBJ.sign_sha('GET',HOST,path,commonQuery)
        return HTTPOBJ.call_api('GET',path,payload)
    },
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
    }
}

// HB 的websocket 接口
const HB_WS = {
    initWs:(theme ,f)=>{ 
        // const themeStore = theme
        // const fStore = f
        ws.on('open',()=>{
            console.log('************* WEBSOCKET OPEN **********')
            HB_WS.subscribe(theme)
        })
        ws.on('message',(data)=>{
            let message = hanldeZipToString(data)
            if(message.ping){
                ws.send(JSON.stringify({pong:message.ping}))
            }else if(message.tick){
                f(message.tick)
            }
            //receive ping & send pong 
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

// async function aaaa(){
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
// }
// aaaa()

exports.HB_REST = HB_REST
exports.HB_WS = HB_WS