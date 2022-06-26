<template>
    <div id="login-block" @click="closeWindow">
        <div id="login-box">
            <div id="login-center">
                <div id="nav-bar">
                    <div id="register" :class="{active:showActive('register')}" @click="showTab('register')">
                        注册
                    </div>
                    <div id="login" :class="{active:showActive('login')}" @click="showTab('login')">
                        登录
                    </div>
                    <div id="forget-password" :class="{active:showActive('forgetPassword')}" @click="showTab('forgetPassword')">
                        忘记密码
                    </div>
                </div>
                <register @closeWindowLink="closeWindowLink" v-show="showActive('register')"></register>
                <login @closeWindowLink="closeWindowLink" v-show="showActive('login')"></login>
                <forget-password v-show="showActive('forgetPassword')"></forget-password>
            </div>
        </div>
    </div>
</template>

<script>
    import NavBar from 'views/head/user/LoginNavBar.vue';
    import Login from 'views/head/user/Login.vue';
    import ForgetPassword from 'views/head/user/ForgetPassword.vue';
    import Register from 'views/head/user/Register.vue'
    export default {
        name: "LoginRegister",
        components: {
            NavBar,
            Login,
            ForgetPassword,
            Register
        },

        props: {
            showType: {
                type: String,
                required: true,
                default: "login"
            },
            showLoginStatus: {
                type: Boolean,
                required: true,
                default: false
            }
        },

        setup(props, context) {
            //切换显示类型
            const showTab = (data) => {
                context.emit('changeShowType', data);
            };
            //相关显示触发函数
            const showActive = (data) => {
                return props.showType === data;
            };
            //若点击范围是center外，且窗口show状态为true，则将show状态变化传递到父组件相关函数
            const closeWindow = (e) => {
                const center = document.querySelector("#login-center");
                if (center && !center.contains(e.target)) {
                    //如果父组件的状态为显示状态，则触发父组件的关窗函数
                    if (props.showLoginStatus === true) {
                        context.emit('closeWindow');
                    }
                }
            };

            const closeWindowLink = () => {
                context.emit('closeWindow');
            };
            return {
                showTab,
                showActive,
                closeWindow,
                closeWindowLink
            }

        },
    }
</script>

<style scoped>
    .active {
        color: blue;
    }

    #nav-bar {
        position: relative;
        left: 0;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width:100%;
        height: 80px;
        font: var(--font-size);
        font-weight: 500;
        color: #FFF;
        -webkit-tap-highlight-color: transparent;
        background-color: var(--color-tint);
        border-radius: 10px 10px 0 0;
    }

    #login-block {
        position: absolute;
        z-index: 1001;
        display: -webkit-box;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    #login-box {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.4);
    }

    #login-center {
        width: 450px;
        height: 440px;
        background-color: white;
        text-align: center;
        border-radius: 10px;
    }
</style>