import {request} from "./request"

export function getFtsInfoByPid(params) {
    return request({
        url: '/fa/quote/fts/info/pid',
        method: 'get',
        params
    })
}

export function getFtsInfoByFtsId(params) {
    return request({
        url: '/fa/quote/fts/info',
        method: 'get',
        params
    })
}
