import {request} from "./request";

export function getHomeProductList(params) {
    return request({
        url: 'fa/product/list',
        method: 'get',
        params
    })
}