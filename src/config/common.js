import store from '@/store'

export const addUnReadMsgCount = () => {
    store.commit('changeTotalUnReadMsgCount', store.state.totalUnReadMsgCount += 1)
}

export function delUnReadMsgCount(count) {
    store.commit('changeTotalUnReadMsgCount', store.state.totalUnReadMsgCount -= count)
}