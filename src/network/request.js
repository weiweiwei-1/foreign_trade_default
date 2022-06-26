import axios from 'axios';
import store from '@/store'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:8080/',
        // timeout: 3000
    });

    //请求拦截
    instance.interceptors.request.use(config=>{
        //如果有一个接口需要认证才可以访问，就在这里统一设置
        return config;
    }, err=>{
        return Promise.reject(err);
    });

    //响应拦截
    instance.interceptors.response.use(res => {
        if (res.status === 200) {
            switch (res.data.code) {
                case 1000:
                    //对处于已登录状态，但是不符合身份的点击操作进行拦截
                    store.commit('changeCode', res.data.code);
                    store.commit('changeRole', res.data.role);
                    store.commit('changeName', res.data.name);
                    console.log("名字");
                    console.log(store.state.loginCode);
                    console.log(store.state.userName);
                    if (res.data.interceptType === "intercept") {
                        if (res.data.role === "fa") {
                            alert("请登录货代账号");
                        } else if (res.data.role === "fts") {
                            alert("请登录外贸账号");
                        }
                    }
                    return res.data;
                case -1000:
                    //未登录状态，全部未登录相关的状态进行commit
                    store.commit('changeCode', -1000);
                    store.commit('changeRole', "");
                    store.commit('changeName', "");
                    return res.data;
                default:
                    return res.data;
            }
        }
    }, err => {
        alert('错误');
        //如果有错误，显示错误信息
        return Promise.reject(err.response);
    }

    );
    return instance(config);
}