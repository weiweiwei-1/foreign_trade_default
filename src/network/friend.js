import {request} from "./request";
import qs from 'qs';

export function sendFriendApply(applyInfo) {
    return request({
        url: '/fa/friend/apply/send',
        method: 'post',
        data: qs.stringify(applyInfo)
    })
}