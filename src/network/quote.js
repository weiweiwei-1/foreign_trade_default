import {request} from "./request";
import qs from 'qs';

export function sendQuote(quoteInfo) {
    return request({
        url: '/fa/quote/send',
        method: 'post',
        data: qs.stringify(quoteInfo)
    })
}

export function getQuoteList() {
    return request({
        url: '/fa/quote/list',
        method: 'get'
    })
}

export function getQuoteDetail(params) {
    return request({
        url: '/fa/quote/detail',
        method: 'get',
        params
    })
}

export function getMyQuote(params) {
    return request({
        url: '/fa/quote/sent',
        method: 'get',
        params
    })
}