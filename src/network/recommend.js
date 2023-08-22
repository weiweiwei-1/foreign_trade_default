import {request} from "./request";
import qs from 'qs';

export function getActivityInfo() {
    return request({
        url: '/fa/recommend/info',
        method: 'get',
    })
}