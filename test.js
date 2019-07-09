const HBOBJ = require('./hb_sdk')
console.log(HBOBJ)

const {HB_REST , HB_WS} = HBOBJ

HB_WS.initWs(`{
    "sub": "market.btcusdt.kline.5min",
    "id": "id1"
  }`,function(data){
      console.log(data)
  })