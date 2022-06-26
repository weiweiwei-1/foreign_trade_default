import { createStore } from 'vuex'

export default createStore({
    state: {
        loginCode: -1000,
        loginRole: "",
        userName: "邂逅"
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
        }
    },
    actions: {
    },
    modules: {
    }
})
