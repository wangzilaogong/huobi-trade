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

###CONFIG
需要写入CONFIG
```javascript
  const config = {
    REST_URL:'http://api.huobi.pro',
    WS2_URL:'wss://api.huobi.pro/ws/v1',
    WS_URL:'wss://api.huobi.pro/ws',
    API_AK:'XXXXXX-XXXXXX-XXXXXX-XXXXXX',
    API_SK:'XXXXXX-XXXXXX-XXXXXX-XXXXXX',
    ACCOUNT_ID:'XXXXXX',
    DEFAULT_HEADERS : {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
    }
}

```