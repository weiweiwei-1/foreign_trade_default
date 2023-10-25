import store from '@/store'
import {ElMessage} from 'element-plus'

export const addUnReadMsgCount = () => {
    console.log('+1')
    store.commit('changeTotalUnReadMsgCount', store.state.totalUnReadMsgCount += 1)
}

export function delUnReadMsgCount(count) {
    store.commit('changeTotalUnReadMsgCount', store.state.totalUnReadMsgCount -= count)
}

export function addNewFriendCount() {
    store.commit('changeNewFriendCount', store.state.newFriendCount += 1)
}

export function delNewFriendCount() {
    store.commit('changeNewFriendCount', store.state.newFriendCount -= 1)
}

export function delQuoteCount() {
    store.commit('changeQuoteCount', store.state.quoteCount -= 1)
}

export function textInvalid(target) {
    target.style.border = "1px solid red";
}

export function textValid(target) {
    target.style.border = "1px solid deepskyblue"
}

export function messageShow(type, content, duration) {
    switch (type) {
        case 'success':
            ElMessage.success({
                message: content,
                duration: duration
            })
            break
        case 'info':
            ElMessage.info({
                message: content,
                duration: duration
            })
            break
        case 'warning':
            ElMessage.warning({
                message: content,
                duration: duration
            })
            break
        case 'error':
            ElMessage.error({
                message: content,
                duration: duration
            })
    }
}

export function resetLoginStatus() {
    store.commit('changeCode', -1000)
    store.commit('changeRole', "")
    store.commit('changeName', "")
    store.commit('changeNewFriendCount', 0)
    store.commit('changeTotalUnReadMsgCount', 0)
    store.commit('changeQuoteCount', -2)
}