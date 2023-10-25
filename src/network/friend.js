import {request} from "./request";
import qs from 'qs';

export function getRecommendFriendList() {
    return request({
        url: '/fa/friend/recommend',
        method: 'get'
    })
}

export function getFriendListByCondition(params) {
    return request({
        url: '/fa/friend/recommend/condition',
        method: 'post',
        params
    })
}

export function getFtsInfo(params) {
    return request({
        url: '/fa/friend/recommend/info',
        method: 'get',
        params
    })
}

export function sendFriendApply(data) {
    return request({
        url: '/fa/friend/apply',
        method: 'post',
        data: qs.stringify(data)
    })
}

export function getFriendList() {
    return request({
        url: '/fa/friend/list/',
        method: 'get',
    })
}

export function getFriendApplyList() {
    return request({
        url: '/fa/friend/apply/list/',
        method: 'get',
    })
}

export function permitFriendApply(params) {
    return request({
        url: '/fa/friend/apply/permit',
        method: 'post',
        params
    })
}

export function rejectFriendApply(params) {
    return request({
        url: '/fa/friend/apply/reject',
        method: 'post',
        params
    })
}

export function getNewFriendCount() {
    return request({
        url: '/fa/friend/apply/count',
        method: 'get',
    })
}

export function getFriendInfoDetail(params) {
    return request({
        url: '/fa/friend/info/detail',
        method: 'get',
        params
    })
}

export function saveFriendReMark(params) {
    return request({
        url: '/fa/friend/remark/save',
        method: 'post',
        params
    })
}

export function deleteFaFriend(params) {
    return request({
        url: '/fa/friend/delete',
        method: 'post',
        params
    })
}

export function getFriendStatus(params) {
    return request({
        url: '/fa/friend/status',
        method: 'get',
        params
    })
}

