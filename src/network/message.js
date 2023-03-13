import {request} from "./request";
import qs from 'qs';

export function getMsgListByPid(params) {
    return request({
        url: '/fa/message/list/pid/get',
        method: 'get',
        params
    })
}

export function getFaMessageListBySenderId(params) {
    return request({
        url: '/fa/message/list/sender/get',
        method: 'get',
        params
    })
}

export function getFtsMessageInfoByPid(params) {
    return request({
        url: '/fa/message/fts/info/pid',
        method: 'get',
        params
    })
}

export function getFtsMessageInfoBySenderId(params) {
    return request({
        url: '/fa/message/fts/info/sid',
        method: 'get',
        params
    })
}

export function getFaMsgInfo() {
    return request({
        url: '/fa/user/info',
        method: 'get'
    })
}

// 获取消息列表
export function getMsgList() {
    return request({
        url: '/fa/message/list',
        method: 'get'
    })
}

// 通过senderId获取消息内容
export function getMessageContentBySenderId(params) {
    return request({
        url: '/fa/message/content',
        method: 'get',
        params
    })
}

// 读所有消息
export function readAllMessages(params) {
    return request({
        url: '/fa/message/read',
        method: 'post',
        params
    })
}

// 获取fts个人信息
export function getFtsInfo(params) {
    return request({
        url: '/fa/message/fts/info',
        method: 'get',
        params
    })
}

// 获取fa个人信息
export function getFaInfo() {
    return request({
        url: '/fa/user/info',
        method: 'get',
    })
}