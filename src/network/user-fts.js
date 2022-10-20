import {request} from "./request";

export function getFtsInfo(params) {
    return request({
        url: '/fa/quote/fts/info',
        method: 'get',
        params
    })
}

export function getFriendStatus(params) {
    return request({
        url: '/fa/quote/fts/status/friend',
        method: 'get',
        params
    })
}
