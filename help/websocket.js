const config = require('../config/config')
const WebSocket = require('ws')

const ws = new WebSocket(config.WS_URL)
module.exports = ws