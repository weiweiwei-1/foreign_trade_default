import { createStore } from 'vuex'

export default createStore({
    state: {
        loginCode: -1000,
        loginRole: "",
        userName: "邂逅",
        onlineStatus: false,
        totalUnReadMsgCount: 0,
        newFriendCount: 0,
        // 剩余报价数
        quoteCount: -2,
        // 环境中获取的baseUrl的头部地址
        urlHeader: process.env.VUE_APP_API_URL,
        // 环境中获取的websocketUrl地址
        websocketUrl: process.env.VUE_APP_WEBSOCKET_URL,
        // 全局websocket变量，统筹全局websocket消息的发送和处理逻辑
        websocket: null,
        // 连接状态，1为已连上，0为正在连接，-1为完全断开，不再重连
        connectStatus: -1,
        // 默认重连次数
        defaultReconnectTimes: 180,
        // 最大重连次数，15min内不断重连，若一直失败，则放弃重连，若重连成功，则重置重连次数为90, 30min内不断重连，则重连次数为180
        maxReconnectTimes: 180,
        // 恢复重连的标志
        reconnectCircleMark: true,
        // 消息列表组件状态
        msgListComStatus: false,
        // 消息详情组件状态
        msgDetailComStatus: false,
    },
    mutations: {
        changeName (state, name) {
            state.userName = name;
        },
        changeRole (state, role) {
            state.loginRole = role
        },
        changeCode (state, code) {
            state.loginCode = code
        },
        changeOnlineStatus(state, status) {
            state.onlineStatus = status
        },
        changeTotalUnReadMsgCount(state, count) {
            state.totalUnReadMsgCount = count
        },
        changeNewFriendCount(state, count) {
            state.newFriendCount = count
        },
        changeQuoteCount(state, count) {
            state.quoteCount = count
        },
        setWebSocket(state, val) {
            state.websocket = val
        },
        changeConnectStatus(state, val) {
            state.connectStatus = val
        },
        changeMaxReconnectTimes(state, val) {
            state.maxReconnectTimes = val
        },
        changeReconnectCircleMark(state, val) {
            state.reconnectCircleMark = val
        },
        changeMsgListComStatus(state, val) {
            state.msgListComStatus = val
        },
        changeMsgDetailComStatus(state, val) {
            state.msgDetailComStatus = val
        },
    },
    actions: {
    },
    modules: {
    }
})
