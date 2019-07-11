# 火币交易api
### 主要是HB_REST和HB_WS 对象
常用的WS
```javascript
const HBOBJ = require('huobi-trade')
const {HB_REST , HB_WS} = HBOBJ
HB_WS.initWs(`{
    "sub": "market.btcusdt.kline.5min",
    "id": "id1"
  }`,function(data){
      console.log(data)
  })
```

### 常用的REST
```javascript
async function test(){
const res =  await HB_REST.getCommonSymbols()
console.log(res)
}
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
### NOW SUPPORT MORE RESTFULL API
|  API   | DESCRIBTION  |
|  :----:  | ----  |
| getCommonSymbols  | 获取所有的交易对 |
| getAllCurrencys  | 获取所有币种 |
| getCurrentTime  | 获取当前系统时间 |
| getHistoryKline  | 获取历史kline数据 |
| getTicker  | 获取聚合行情数据 |
| getAllTickers  | 所有交易对的最新Tickers |
| getDepth  | 指定交易对的当前市场深度数据 |
| getLastestTrade  | 指定交易对最新的一个交易记录 |
| getHistoryTrade  | 指定交易对近期的所有交易记录 |
| get24hMarket  | 最近24小时行情数据 |
| getAccount  | 获取accountInfo |
| getBalance  | 查询指定账户的余额 |
| postOrder  | 下单 |
| cancelOrder  | 取消订单 |
| getUndoneOrders  | 查询已提交但是仍未完全成交或未被撤销的订单 |
| cancelListOrders  | 发送批量撤销订单 |
| getOrderDetail  | 查询已提交但是仍未完全成交或未被撤销的订单 |
| getHistoryOrders  | 接口基于搜索条件查询历史订单 |
| get48hHistoryOrders  | 口基于搜索条件查询最近48小时内历史订单 |


















