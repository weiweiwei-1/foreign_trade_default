<template>
  <div id="register-content">
    <div id="email-block">
      <div class="text"><input @input='onEmailChange' @blur="onEmailInfo" @focus="onCancelEmailInfo" type="text"
                               v-model="account" id="register-email" placeholder="邮 箱"></div>
      <div class="error-block"><span class="error">{{ emailError }}</span></div>
    </div>
    <div id="password-block">
      <div class="text"><input @input='onPasswordChange' @blur="onPasswordInfo" @focus="onCancelPwdInfo" type="password"
                               v-model="password" id="register-password" placeholder="密码"></div>
      <div class="error-block"><span class="error">{{ passwordError }}</span></div>
    </div>
    <div id="password-confirm-block">
      <div class="text"><input @input='onPwdConfirmChange' @blur="onPwdConfirmInfo" @focus="onCancelPwdConfirmInfo"
                               type="password" v-model="passwordConfirm" id="password-confirm" placeholder="确认密码"></div>
      <div class="error-block"><span class="error">{{ confirmPasswordError }}</span></div>
    </div>
    <div class="send-code"><input @input='onSendCodeChange' @blur="onSendCodeInfo" type="text" v-model="code" id="code">
      <button id="send-code">发送验证码</button>
    </div>
    <div class="code-error"></div>
    <div class="register-block">
      <button id="register" @click="onSubmit">注册</button>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs} from 'vue'
import {register} from "network/user-fa"
import store from '@/store'
import {messageShow} from "@/config/common"

export default {
  name: "Register",
  setup(props, context) {
    const userInfo = reactive({
      account: '',
      password: '',
      passwordConfirm: '',
      code: '123456'
    })

    const errorInfo = reactive({
      emailError: null,
      passwordError: null,
      confirmPasswordError: null
    })

    const errorStatus = reactive({
      emailErrorStatus: false,
      passwordErrorStatus: false,
      confirmPwdErrorStatus: false,
      codeErrorStatus: false
    })

    //invalid为校验不通过的显示处理逻辑
    function emailInvalid(msg) {
      const target = document.querySelector('#register-email')
      errorInfo.emailError = msg
      target.style.border = "1px solid red"

    }

    //valid为校验通过的显示处理逻辑
    function emailValid() {
      const target = document.querySelector('#register-email')
      errorInfo.emailError = null
      target.style.border = "1px solid #ccc"
    }

    function passwordInvalid(msg) {
      const target = document.querySelector('#register-password')
      errorInfo.passwordError = msg
      target.style.border = "1px solid red"
    }

    function passwordValid() {
      const target = document.querySelector('#register-password')
      errorInfo.passwordError = null
      target.style.border = "1px solid #ccc"
    }

    function pwdConfirmInvalid(msg) {
      const target = document.querySelector('#password-confirm')
      errorInfo.confirmPasswordError = msg
      target.style.border = "1px solid red"
    }

    function pwdConfirmValid() {
      const target = document.querySelector('#password-confirm')
      errorInfo.confirmPasswordError = null
      target.style.border = "1px solid #ccc"
    }

    function sendCodeValid() {
      const target = document.querySelector('#code')
      target.style.border = "1px solid #ccc"
    }

    function sendCodeInvalid() {
      const target = document.querySelector('#code')
      target.style.border = "1px solid red"
    }

    //change为输入框字段实时改变的处理逻辑
    const onEmailChange = () => {
      const email = userInfo.account
      const emailErrorStatus = errorStatus.emailErrorStatus
      if (emailErrorStatus === true) {
        if (email.trim() === '') {
          emailInvalid(null)
        } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email.trim())) {
          emailInvalid(null)
        } else {
          emailValid()
        }
      }
    }

    //info为输入框失去焦点blur的处理逻辑
    const onEmailInfo = () => {
      errorStatus.emailErrorStatus = true
      const email = userInfo.account
      if (email.trim() === '') {
        emailInvalid('邮箱不能为空')
      } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email.trim())) {
        emailInvalid('邮箱格式错误')
      } else {
        emailValid()
      }
    }

    //cancel为输入框重新获取焦点focus的处理逻辑，重新获取焦点，错误的文字提示消失，但是边框提示依旧显示
    const onCancelEmailInfo = () => {
      errorInfo.emailError = null
    }

    const onPasswordChange = () => {
      const password = userInfo.password
      const passwordConfirm = userInfo.passwordConfirm
      const passwordErrorStatus = errorStatus.passwordErrorStatus
      const confirmPwdErrorStatus = errorStatus.confirmPwdErrorStatus
      if (passwordErrorStatus === true) {
        if (password.trim().length < 6 || password.trim().length > 15) {
          passwordInvalid(null)
          pwdConfirmValid()
        } else if (password !== passwordConfirm && confirmPwdErrorStatus === true) {
          pwdConfirmInvalid('前后密码不一致')
          passwordValid()
        } else if (password === passwordConfirm) {
          passwordValid()
          pwdConfirmValid()
        } else {
          passwordValid()
        }
      }
    }
    const onPasswordInfo = () => {
      errorStatus.passwordErrorStatus = true
      const password = userInfo.password
      const passwordConfirm = userInfo.passwordConfirm
      const confirmPwdErrorStatus = errorStatus.confirmPwdErrorStatus
      if (password.trim().length < 6 || password.trim().length > 15) {
        passwordInvalid('密码长度为6-15位')
      } else if (confirmPwdErrorStatus === true && password !== passwordConfirm) {
        pwdConfirmInvalid('前后密码不一致')
      } else {
        passwordValid()
      }
    }

    const onCancelPwdInfo = () => {
      errorInfo.passwordError = null
    }

    const onPwdConfirmChange = () => {
      const passwordError = errorInfo.passwordError
      const password = userInfo.password
      const passwordConfirm = userInfo.passwordConfirm
      const confirmPwdErrorStatus = errorStatus.confirmPwdErrorStatus
      if (passwordError === null && confirmPwdErrorStatus === true) {
        if (passwordConfirm !== password) {
          pwdConfirmInvalid(null)
        } else {
          pwdConfirmValid()
        }
      } else if (passwordError !== null) {
        pwdConfirmValid()
      }
    }

    const onPwdConfirmInfo = () => {
      errorStatus.confirmPwdErrorStatus = true
      const password = userInfo.password
      const passwordConfirm = userInfo.passwordConfirm
      const passwordError = errorInfo.passwordError
      if (errorStatus.passwordErrorStatus === true && passwordError === null) {
        if (passwordConfirm !== password) {
          pwdConfirmInvalid('前后密码不一致')
        } else {
          pwdConfirmValid()
        }
      } else if (errorStatus.passwordErrorStatus === false) {
        pwdConfirmValid()
      }
    }

    const onCancelPwdConfirmInfo = () => {
      errorInfo.confirmPasswordError = null
    }

    const onSendCodeChange = () => {
      const code = userInfo.code
      if (errorStatus.codeErrorStatus === true) {
        if (code === '' || !/^\d{6}$/.test(code)) {
          sendCodeInvalid()
        } else {
          sendCodeValid()
        }
      }
    }

    const onSendCodeInfo = () => {
      errorStatus.codeErrorStatus = true
      const code = userInfo.code
      if (code === '' || !/^\d{6}$/.test(code)) {
        sendCodeInvalid()
      } else {
        sendCodeValid()
      }
    }

    const onSubmit = () => {
      //前端校验没有错误才走url
      if (errorInfo.emailError === null && errorInfo.passwordError === null && errorInfo.confirmPasswordError === null && /^\d{6}$/.test(userInfo.code) && !(userInfo.email === '' || userInfo.password === '' || userInfo.passwordConfirm === '' || userInfo.code === '')) {
        register(userInfo).then(res => {
          switch (res.code) {
            case 1:
              //后台register返回的resultcode为0，1，-1，request的拦截器未拦截其状态，此处处理状态改变
              store.commit('changeCode', res.data.code)
              store.commit('changeRole', res.data.role)
              store.commit('changeName', res.data.name)
              context.emit('closeWindowLink')
              break
            case 0:
              res.error.emailError === null ? emailValid() : emailInvalid(res.error.emailError)
              errorStatus.emailErrorStatus = true
              res.error.passwordError === null ? passwordValid() : passwordInvalid(res.error.passwordError)
              errorStatus.passwordErrorStatus = true
              break
            case -1:
              messageShow('error', res.msg, 1000)
              break
            case -2:
              messageShow('info', res.msg, 1000)
              break
          }
        })
      } else {
        //未获取焦点的输入框为空时，点击注册按钮显示逻辑
        if (userInfo.account.trim() === '') {
          emailInvalid('邮箱不能为空')
        }
        if (userInfo.password.trim() === '') {
          passwordInvalid('密码不能为空')
        }
        if (userInfo.code === '') {
          sendCodeInvalid()
        }
      }

    }

    return {
      ...toRefs(userInfo),
      ...toRefs(errorInfo),
      ...toRefs(errorStatus),
      onEmailChange,
      onEmailInfo,
      onPasswordChange,
      onPasswordInfo,
      onCancelPwdInfo,
      onPwdConfirmChange,
      onCancelEmailInfo,
      onPwdConfirmInfo,
      onCancelPwdConfirmInfo,
      onSendCodeChange,
      onSendCodeInfo,
      onSubmit
    }
  }
}
</script>

<style scoped>

span {
  color: #ca0c16;
}

#register-content {
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: lightgrey;
  width: 100%;
  height: 360px;
  border-radius: 0 0 10px 10px;
}

input {
  outline: 0;
  border-radius: 8px;
  font-size: 17px;
  border: 1px solid #ccc;
}

button {
  border-radius: 8px;
  border: 0;
  outline: 0
}

#email-block {
  margin: 20px 0 0 0;
}

#email-block, #password-block, #password-confirm-block {
  width: 100%;
  height: 70px
}

.text {
  width: 100%;
  height: 60px
}

.error-block {
  width: 100%;
  height: 19px
}

#register-email, #register-password, #password-confirm {
  position: relative;
  width: 272px;
  height: 35px;
  top: 20px
}

#register-password, #password-confirm {
  letter-spacing: 1px
}

.send-code {
  margin: 14px 0 0 0;
}

#send-code {
  width: 83px;
  height: 28px;
  position: relative;
  left: 10px;
  color: white;
  background-color: #317ef3;
  border-color: transparent;
  cursor: pointer
}

.code-error {
  width: 100%;
  height: 20px;
  color: red
}

#register {
  width: 160px;
  height: 40px;
  border-color: transparent;
  cursor: pointer;
  color: white;
  font: 1.25rem Arial, Serilf;
  border-radius: 8px;
  background-color: rgb(255, 68, 0);
}

.register-block {
  width: 100%;
  height: 40px;
  margin: 5px 0 0 0
}

#code {
  width: 80px;
  height: 25px;
  border-radius: 10px;
  outline: 0;
  border: 1px solid deepskyblue
}
</style>