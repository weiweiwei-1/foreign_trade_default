import axios from 'axios';
import store from '@/store'
import {ElMessage} from 'element-plus'
import {messageShow} from "@/config/common";

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:8080/',
        // baseURL: 'http://kingvi.online/api/',
        // timeout: 3000
    })

    //请求拦截
    instance.interceptors.request.use(config => {
        //如果有一个接口需要认证才可以访问，就在这里统一设置
        return config
    }, err => {
        return Promise.reject(err)
    })

    //响应拦截
    instance.interceptors.response.use(res => {
            if (res.status === 200) {
                switch (res.data.code) {
                    case 1000:
                        //对处于已登录状态，但是不符合身份的点击操作进行拦截
                        store.commit('changeCode', res.data.code)
                        store.commit('changeRole', res.data.role)
                        store.commit('changeName', res.data.name)
                        if (res.data.interceptType === "intercept") {
                            if (res.data.role === "fts" || res.data.role === 'admin') {
                                ElMessage.info({
                                    message: '当前登录账号非货代账号，请登录货代身份账号再执行操作',
                                    duration: 1000
                                })
                                return
                            }
                        }
                        return res.data
                    case -1000:
                        //未登录状态，全部未登录相关的状态进行commit
                        store.commit('changeCode', -1000)
                        store.commit('changeRole', "")
                        store.commit('changeName', "")
                        if (res.data.interceptType === 'fail') {
                            ElMessage.info({
                                message: '请登录后再试',
                                duration: 1000
                            })
                            return
                        } else if (res.data.interceptType === 'pass') {
                            return res.data
                        }
                        return
                    default:
                        return res.data
                }
            }
        }, err => {
            // messageShow('error', err, 2000)
            messageShow('error', '网络已断开，请联网后再试', 2000)
            //如果有错误，显示错误信息
            return Promise.reject(err.response)
        }
    )
    return instance(config)
}