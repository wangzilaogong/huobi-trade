const HBOBJ = require('./hb_sdk')
console.log(HBOBJ)

const {HB_REST , HB_WS} = HBOBJ

HB_WS.initWs(`{
    "sub": "market.btcusdt.kline.5min",
    "id": "id1"
  }`,function(data){
      console.log(data)
  })

  HB_WS.initWs(`{
    "unsub": "market.btcusdt.kline.5min",
    "id": "id2"
  }`,function(data){
      console.log(data)
  })

