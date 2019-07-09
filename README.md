# 火币交易api
### 主要是HB_REST和HB_WS 对象
常用的WS
```javascript
const HBOBJ = require('./hb_sdk')
const {HB_REST , HB_WS} = HBOBJ
HB_WS.initWs(`{
    "sub": "market.btcusdt.kline.5min",
    "id": "id1"
  }`,function(data){
      console.log(data）
  })
```

### 常用的REST
```javascript
async function test(){
const res =  await HB_REST.getAccount()
console.log(res.data[0].id)
test()
```