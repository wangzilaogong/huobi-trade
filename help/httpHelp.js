const config = require('../config/config')
const CryptoJS = require('crypto-js')
const HmacSHA256 = require('crypto-js/hmac-sha256')
const http  = require('request')

// sign for request 
function sign_sha(method, baseurl, path, data){

    // 请求参数sort & 编码
    let dataParams = []
    for (let item in data){
        dataParams.push(item + '=' + encodeURIComponent(data[item]))
    }
    let queryParams = dataParams.sort().join('&')

    // 加 \n
    let meta = ''
    if(data){
     meta = [method , baseurl , path,queryParams].join('\n')
    }else{
     meta = [method , baseurl , path].join('\n')
    }

    // 与秘钥生产签名
    let hashDone = HmacSHA256(meta ,config.API_SK)

    //都得转义
    let  Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hashDone))
    queryParams += `&Signature=${Signature}`
    return queryParams
}

// get请求
function CALL_GET(url ,opts){
        const httpOpts = {
            url: url,
            method: 'get',
            timeout: opts.timeout || 3000,
            headers: opts.headers || config.DEFAULT_HEADERS,
            proxy: opts.proxy || ''
        }
        return new Promise((resolve , reject) =>{
            http.get(
                httpOpts,
                function (error, response, body) {
                    if (error) {
                        reject(error)
                    } else{
                        if(response.statusCode == 200){
                            resolve(JSON.parse(body))
                        }else{
                            reject(response.statusCode)
                        }
                    }
                }
            )
        })
}

// post 请求
function CALL_POST(url ,body,opts){
    const httpOpts = {
        url: url,
        method: 'POST',
        body:JSON.stringify(body),
        timeout: opts.timeout || 3000,
        headers: opts.headers || config.DEFAULT_HEADERS,
    }
    return new Promise((resolve , reject) =>{
        http.post(
            httpOpts,
            function (error, response, body) {
                if (error) {
                    reject(error)
                } else{
                    if(response.statusCode == 200){
                        resolve(body)
                    }else{
                        reject(response.statusCode)
                    }
                }
            }
        )
    })
}


const call_api = (method, path, payload, body)=>{

    const url = `${config.REST_URL}${path}?${payload}`
    console.log(url,'sdsdsdsssd')
    if( method === 'GET'){
        const opts = {

        }
        return CALL_GET(url ,opts)
    }
    if( method === 'POST'){
        const opts = {
            
        }
       return CALL_POST(url,body,opts)

    }
}

exports.call_api = call_api
exports.sign_sha = sign_sha

