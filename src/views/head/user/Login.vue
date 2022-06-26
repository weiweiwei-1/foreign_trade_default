<template>
    <div id="login-content">
        <div class="block" id="email-block">
            <div class="content">
                <input @blur="onEmailInfo" @focus="onCancelEmailInfo" type="text" id="login-email" v-model="email" placeholder="输入邮箱">
            </div>
            <div class="error-block">
                <span>{{emailError}}</span>
            </div>
        </div>
        <div class="block">
            <div class="content">
                <input @blur="onPasswordInfo" @focus="onCancelPwdInfo" type="password" id="login-password" v-model="password" placeholder="输入密码">
            </div>
            <div class="error-block">
                <span>{{passwordError}}</span>
            </div>
        </div>
        <div id="rememberMe-block">
            <input id="rememberMe" type="checkbox">
            <span id="rememberMe-text">记住我</span>
        </div>
        <div id="login-btn">
            <button id="login" @click="onSubmit">登录</button>
        </div>
    </div>
</template>

<script>
    import {reactive, toRefs} from 'vue';
    import {login} from "network/user-fa";
    import store from 'store/'
    export default {
        name: "Login",
        setup(props, context) {
            const userInfo = reactive({
                email: '',
                password: '',
            });

            const errorInfo = reactive({
                emailError: null,
                passwordError: null,
            });

            function emailInvalid(msg) {
                const target = document.querySelector('#login-email');
                target.style.border = "1px solid red";
                errorInfo.emailError = msg
            }

            function emailValid() {
                const target = document.querySelector('#login-email');
                target.style.border = "1px solid #ccc";
                errorInfo.emailError = null
            }

            function passwordInvalid(msg) {
                const target = document.querySelector('#login-password');
                target.style.border = "1px solid red";
                errorInfo.passwordError = msg
            }

            function passwordValid() {
                const target = document.querySelector('#login-password');
                target.style.border = "1px solid #ccc";
                errorInfo.passwordError = null
            }

            //输入框失去焦点页面逻辑处理
            const onEmailInfo = () => {
                const email = userInfo.email;
                if (email.trim() === '') {
                    emailInvalid('邮箱不能为空')
                } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email.trim())) {
                    emailInvalid('邮箱格式错误')
                } else {
                    emailValid()
                }
            };

            //输入框重新获取焦点页面逻辑处理
            const onCancelEmailInfo = () => {
                emailValid()
            };

            const onPasswordInfo = () => {
                const password = userInfo.password;
                if (password.trim().length < 6 || password.trim().length > 15) {
                    passwordInvalid('密码长度为6-15位')
                }
            };

            const onCancelPwdInfo = () => {
                passwordValid()
            };

            const onSubmit = () => {
                if (errorInfo.emailError == null && errorInfo.passwordError == null) {
                    login(userInfo).then(res => {
                        switch (res.code) {
                            case 1:
                                store.commit('changeCode', res.data.code);
                                store.commit('changeRole', res.data.role);
                                store.commit('changeName', res.data.name);
                                context.emit('closeWindowLink');
                                console.log("登录成功");
                                break;
                            case 0:
                                res.error.emailError === null ? emailValid() : emailInvalid(res.error.emailError);
                                res.error.passwordError === null ? passwordValid() : passwordInvalid(res.error.passwordError);
                                break;
                            case -1:
                                alert(res.msg); break
                        }
                    }).catch(err => {
                        alert("请求出错！联系管理员");
                        console.log(err);
                    })
                }
            };

            return {
                ...toRefs(userInfo),
                ...toRefs(errorInfo),
                onEmailInfo,
                onCancelEmailInfo,
                onPasswordInfo,
                onCancelPwdInfo,
                onSubmit
            }
        }
    }
</script>

<style scoped>

    span {
        color: #ca0c16;
    }

    input {
        outline: 0;
        border-radius: 8px;
        font-size: 17px;
        border: 1px solid #ccc;
    }

    #login-content {
        position: relative;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: lightgrey;
        width: 100%;
        height: 360px;
        border-radius: 0 0 10px 10px;
    }

    #email-block {
        margin: 15px 0 0 0;
    }

    .block {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        text-align: center;
        width: 450px;
        height: 100px;
    }

    .content {
        width: 100%;
        display: block;
        text-align: center;
        height: 60px;
    }

    #login-email, #login-password {
        letter-spacing: 1px;
        position: relative;
        width: 286px;
        height: 37px;
        top: 20px;
    }

    .error-block {
        position: relative;
        top: 0;
        height: 20px;
        text-align: center;
    }

    #rememberMe-block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        margin: 0 0 25px 0;
        text-align: center;
    }

    #rememberMe-text {
        position: relative;
        left: 5px;
        font-size: 15px;
        color: dodgerblue;
    }

    #login {
        width:160px;
        height:40px;
        border-color:transparent;
        cursor:pointer;
        color:white;
        font:1.25rem Arial,Serilf;
        border-radius: 8px;
        background-color:rgb(255, 68, 0);
    }
</style>