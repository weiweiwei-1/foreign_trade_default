import {request} from "./request";

export function getActivityInfo() {
    return request({
        url: '/fa/recommend/info',
        method: 'get',
    })
}

export function sendActivityInfo(activityInfo) {
    return request({
        url: 'fa/recommend/send',
        method: 'post',
        data: activityInfo,
        contentType: "multipart/form-data",
    })
}