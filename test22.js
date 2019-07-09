const HBOBJ = require('./hb_sdk')


const {HB_REST , HB_WS} = HBOBJ

HB_WS.initWs(`{
    "sub": "market.btcusdt.kline.1D",
    "id": "id1"
  }`,function(data){
      console.log(data , 'KKKKKKKK')
  })