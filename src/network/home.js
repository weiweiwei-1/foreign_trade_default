import {request} from "./request";

export function getHomeProductList(params) {
    return request({
        url: 'fa/product/list',
        method: 'get',
        params
    })
}

export function getProductListFromSearchContent(params) {
    return request({
        url: 'fa/product/list/condition',
        method: 'get',
        params
    })
}