import * as webSocketConfig from '@/config/websocket'
export function initWebsocket(ws) {
    if ('WebSocket' in window) {
        ws = new WebSocket(webSocketConfig.webSocketUrl);//WebSocket对应的地址
    }
    else if ('MozWebSocket' in window) {
        ws = new MozWebSocket(webSocketConfig.webSocketUrl);//SockJS对应的地址
    }
    else {
        ws = new SockJS(webSocketConfig.webSocketUrl); //SockJS对应的地址
    }
    return ws
}

