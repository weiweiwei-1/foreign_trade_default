<template>
  <div class="pwd-block" @click="closeWindow">
    <div class="pwd-center">
      <input class="pwd" type="password" placeholder="原密码:6-15位" v-model="originPwd" @input="checkOrigin">
      <input class="pwd" type="password" placeholder="新密码:6-15位" v-model="newPwd" @input="checkNew">
      <input class="pwd" type="password" placeholder="确认新密码:6-15位" v-model="confirmPwd" @input="checkConfirm">
      <button @click="submitPwd">提交修改</button>
    </div>
  </div>
</template>

<script>
import {updatePwd} from 'network/user-fa'
import {textInvalid, textValid, messageShow} from '@/config/common'
import {ref} from "vue"

export default {
  name: "UpdatePwd",

  setup(props, context) {
    const originPwd = ref('')
    const newPwd = ref('')
    const confirmPwd = ref('')
    const originErr = ref(false)
    const newErr = ref(false)
    const confirmErr = ref(false)
    const closeWindow = (e) => {
      const center = document.querySelector(".pwd-center")
      if (center && !center.contains(e.target)) {
        context.emit('closePwdWin')
      }
    }

    const checkOrigin = () => {
      const target = document.querySelectorAll('.pwd')[0]
      if (originPwd.value.trim().length < 6 || originPwd.value.trim().length > 15) {
        originErr.value = true
        textInvalid(target)
      } else {
        originErr.value = false
        textValid(target)
      }
    }

    const checkNew = () => {
      const target = document.querySelectorAll('.pwd')[1]
      if (newPwd.value.trim().length < 6 || newPwd.value.trim().length > 15) {
        newErr.value = true
        textInvalid(target)
      } else {
        newErr.value = false
        textValid(target)
      }
    }

    const checkConfirm = () => {
      const target = document.querySelectorAll('.pwd')[2]
      if (confirmPwd.value !== newPwd.value) {
        confirmErr.value = true
        textInvalid(target)
      } else {
        confirmErr.value = false
        textValid(target)
      }
    }

    const submitPwd = () => {
      const originTarget = document.querySelectorAll('.pwd')[0]
      const newTarget = document.querySelectorAll('.pwd')[1]
      if (originErr.value === false && newErr.value === false && confirmErr.value === false) {
        const param = {
          'originPwd': originPwd.value,
          'newPwd': newPwd.value
        }
        updatePwd(param).then(res => {
          switch (res) {
            case -2:
              textInvalid(originTarget)
              messageShow('info', '原密码错误', 1000)
              break
            case 0:
              textInvalid(newTarget)
              messageShow('info', '密码格式不符', 1000)
              break
            case 1:
              messageShow('success', '密码修改成功', 1000)
              context.emit('closePwdWin')
              break
            case -1:
              messageShow('error', '后台错误，联系管理员', 1000)
              break
          }
        })
      }
    }

    return {
      originPwd,
      newPwd,
      confirmPwd,
      closeWindow,
      checkOrigin,
      checkNew,
      checkConfirm,
      submitPwd
    }
  }
}
</script>

<style scoped>
.pwd-block {
  /*position: fixed;*/
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1009;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.pwd-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  background-color: white;
  text-align: center;
  border-radius: 10px;
}

input {
  width: 250px;
  height: 30px;
  outline: none;
  margin: 20px 0;
  border: 1px solid deepskyblue;
  border-radius: 5px;
}

button {
  width: 100px;
  height: 30px;
  line-height: 20px;
  border: transparent;
  border-radius: 5px;
  font-size: 15px;
  font-family: '微软雅黑', "宋体", "Arial Narrow", Helvetica, sans-serif;
  cursor: pointer;
  color: white;
  background-color: rgb(255, 57, 24);
}
</style>