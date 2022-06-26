<template>
    <div id="user">
        <!--<router-link to="/fts">
            <div id="fts-identity-info">货代登录请点击这里！</div></router-link>-->
        <div id="identity-info" @click="swapFtsIdentity">外贸业务员登录请求点击这里！</div>
        <div id="auth-user" v-if="showUser(1000, 'fa')" @click="showUserDetail">
            {{$store.state.userName}}
        </div>
        <div id="login-register-trigger" v-if="showLogin()">
            <div @click="login" id="login">登录</div>|
            <div @click="register" id="register">注册</div>
        </div>

    </div>
    <login-register v-show="showLoginStatus" @closeWindow="closeWindow" :showLoginStatus="showLoginStatus" :showType="showType" @changeShowType="changeShowType"></login-register>
    <edit-user v-if="showUserStatus" @closeUserWindow="closeUserWindow" :showUserStatus="showUserStatus" :user="user"></edit-user>
</template>

<script>
    import LoginRegister from 'views/head/user/LoginRegister.vue'
    import {ref, onMounted} from 'vue'
    import store from "@/store"
    import {getLoginStatus, getUserInfo} from "network/user-fa"
    import EditUser from 'views/head/user/EditUser.vue'
    import { useRouter } from "vue-router";
    export default {
        name: "UserInformation",
        components: {
            LoginRegister,
            EditUser
        },
        setup(props, context) {
            //引入路由并路由初始化
            const route = useRouter();
            const showLoginStatus = ref(false);
            const showUserStatus = ref(false);
            const showType = ref("");
            const user = ref({});
            //每次刷新页面，都从后台请求，更新用户登录状态
            onMounted(() => {
                getLoginStatus().then(res => {
                })
            });

            //显示登录逻辑
            const showLogin = () => {
                return store.state.loginCode === -1000 || store.state.loginCode === 1000 && store.state.loginRole === "fts"
            };

            //点击登录按钮状态切换
            const login = () => {
                showLoginStatus.value = true;
                showType.value = "login";
            };

            //点击注册按钮状态切换
            const register = () => {
                showLoginStatus.value = true;
                showType.value = "register";
            };

            //子组件传值关闭弹窗
            const closeWindow = () => {
                showLoginStatus.value = false;
            };

            const closeUserWindow = () => {
                showUserStatus.value = false;
            };

            //子组件传值改变显示状态
            const changeShowType = (data) => {
                showType.value = data;
            };

            //显示用户名逻辑
            const showUser = (loginCode, loginRole) => {
                return store.state.loginCode === loginCode && store.state.loginRole === loginRole
            };

            //显示用户详情
            const showUserDetail = () => {
                getLoginStatus().then(res => {
                    //当登录角色为货代，则向后台请求货代信息
                    if (store.state.loginCode === 1000 && store.state.loginRole === "fa") {
                        getUserInfo().then(res => {
                            if (res !== null) {
                                user.value = res.data;
                                showUserStatus.value = true
                            } else {
                                alert('请登录！');
                            }
                        }).catch(err => {
                            alert(err);
                        })
                    } else {

                    }
                }).catch(err => {

                });

            };

            //打开外贸页面
            const swapFtsIdentity = () => {
                const {href} = route.resolve({
                    path: '/fts'
                });
                window.open(href, '_blank');
            };

            return {
                showLoginStatus,
                showUserStatus,
                showType,
                user,
                changeShowType,
                login,
                register,
                closeWindow,
                closeUserWindow,
                showUser,
                showLogin,
                showUserDetail,
                swapFtsIdentity
            }
        }
    }
</script>

<style scoped>
    #user {
        position: relative;
        display: flex;
        justify-content: flex-end;
        width: 450px;
        height: 100%;
        text-align: center;
        background: deeppink;
    }

    #login, #register {
        font-weight: bold;
        cursor: pointer;
    }

    #auth-user {
        position: relative;
        float: right;
        margin: 10px 20px 0 0;
        height: 22px;
        cursor: pointer;
        color: #FFFFFF;
    }

    span {
        color: black;
    }

    #login-register-trigger {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: baseline;
        margin: 10px 20px 0 0;
        width: 80px;
        height: 20px;
        color: #FFFFFF;
    }
    a {
        cursor: pointer;
        color: #FFFFFF;
    }

</style>