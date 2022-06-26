import {request} from "./request";
import qs from 'qs';
import store from '@/store'

//注册
export function register(data) {
    return request({
        url: '/fa/user/register',
        method: 'post',
        data: qs.stringify(data)
    })
}
//登录
export function login(data) {
    return request({
        url: '/fa/user/login',
        method: 'post',
        data: qs.stringify(data)
    })
}

//获取当前用户状态
export function getLoginStatus() {
    return request({
        url: '/user/user-status',
        method: 'get'
    })
}

//获取用户信息
export function getUserInfo() {
    return request({
        url: '/fa/user/user-info',
        method: 'get'
    })
}

//编辑用户信息
export function editUser(userInfo) {
    return request({
        url: "fa/user/edit",
        method: "post",
        data: userInfo,
        contentType: "multipart/form-data",
        // processData: false,
    })
}

//退出登录
export function logout() {
    return request({
        url: '/fa/user/logout',
        method: 'post'
    })
}

//恢复未登录状态，将相关字段的值置为默认值
export function resumeUnLogin() {
    store.commit('changeCode', -1000);
    store.commit('changeRole', "");
    store.commit('changeName', "邂逅");
}
