import {request} from "./request";
import qs from 'qs';
import store from '@/store'

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