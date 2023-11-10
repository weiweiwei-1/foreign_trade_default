<template>
  <div id="user">
    <a href="http://www.kingvi.online/fts" target="_blank">海外货物运费询价或查找优惠信息？点击此处</a>
    <div id="auth-user" v-if="showUser()" @click="showUserDetail">
      {{ $store.state.userName }}
    </div>
    <div id="login-register-trigger" v-else><!--v-if="showLogin()"-->
      <div @click="login" id="login">登录</div>
      |
      <div @click="register" id="register">注册</div>
    </div>
    <span v-if="quoteCount !== -1 && quoteCount !== -2" class="quote-remain">
      剩余报价:{{ quoteCount }}
    </span>
  </div>
  <login-register v-show="showLoginStatus" @closeWindow="closeWindow" :showLoginStatus="showLoginStatus"
                  :showType="showType" @changeShowType="changeShowType"></login-register>
  <edit-user v-if="showUserStatus" @closeUserWindow="closeUserWindow" :showUserStatus="showUserStatus"
             :user="user"></edit-user>
</template>

<script>
import LoginRegister from 'views/head/user/LoginRegister.vue'
import {ref, onMounted, watch, getCurrentInstance, onUnmounted, onBeforeUnmount} from 'vue'
import store from "@/store"
import {getLoginStatus, getUserInfo} from "network/user-fa"
import {getQuoteCount} from "@/network/quote"
import {addUnReadMsgCount, messageShow, resetLoginStatus} from "@/config/common"
import EditUser from 'views/head/user/EditUser.vue'
import {useRouter} from "vue-router"
import {addNewFriendCount} from "@/config/common"


export default {
  name: "UserInformation",
  components: {
    LoginRegister,
    EditUser,
  },
  setup(props, context) {
    //引入路由并路由初始化
    const route = useRouter()
    const showLoginStatus = ref(false)
    const showUserStatus = ref(false)
    const showType = ref("")
    const user = ref({})
    const quoteCount = ref(-2)
    const {proxy} = getCurrentInstance()


    const userEvent = new CustomEvent('user', {
      detail: {
        data: null
      }
    })

    const msgListEvent = new CustomEvent('msgList', {
      detail: {
        data: null
      }
    })

    const msgDetailEvent = new CustomEvent('msgDetail', {
      detail: {
        data: null
      }
    })

    function messageHandler(data) {
      let JSONBigString = require('json-bigint')({"storeAsString": true})
      let obj = JSONBigString.parse(data.detail.data)
      console.log('收到消息')
      switch (obj.messageType) {
        case 'sendMessage':
          if (store.state.msgListComStatus === false && store.state.msgDetailComStatus === false) {
            addUnReadMsgCount()
          }
          break
        case 'addFriend':
          if (store.state.msgListComStatus === false && store.state.msgDetailComStatus === false) {
            addUnReadMsgCount()
          }
          break
        case 'newFriend':
          messageShow('warning', obj.content + '申请添加您为好友！！！！', 3000)
          addNewFriendCount()
          break
        case 'sessionDestroyed':
          resetLoginStatus()
          alert('您已在其他地方登录，当前登录状态已失效，请重新登录')
          break
        case 'expiration':
          resetLoginStatus()
          let status = confirm('登录失效，点击确定重新登录')
          if (status === true) {
            showType.value = 'login'
            showLoginStatus.value = true
            status = false
          }
          break
        case 'unChat':
          messageShow('info', '为了安全，聊天功能已关闭，若需测试请联系管理员')
      }
    }

    //每次刷新页面，从后台请求用户角色信息，更新用户登录状态以及剩余报价数
    onMounted(() => {
      getLoginStatus().then(res => {
      })
      getQuoteCount().then(res => {
        if (res === -1) {
          messageShow('error', '后台错误，联系管理员', 1000)
        } else {
          quoteCount.value = res
          store.commit('changeQuoteCount', res)
        }
      })
      window.addEventListener('user', messageHandler)
    })

    // 重连间隔时间10s
    let reconnectTime = 10000

    // 心跳间隔时间45s
    let heartBeatTime = 45000

    // 心跳超时时间5s
    let heartBeatTimeout = 5000

    const WebSocketProxy = new Proxy(WebSocket, {
      construct: function (target, arg) {
        try {
          return new target(...arg)
        } catch (error) {
        }
      }
    })

    // 重连锁标志
    let lockReconnect = false

    // 重连定时器
    let reconnectTimer

    const createSocket = () => {
      if (store.state.maxReconnectTimes <= 0) {
        store.commit('changeConnectStatus', -1)
        return
      }
      try {
        store.commit('setWebSocket', new WebSocketProxy(proxy.$wsUrl))
        console.log('websocket的连接为：' + proxy.$wsUrl)
        store.commit('changeMaxReconnectTimes', store.state.maxReconnectTimes -= 1)
        if (store.state.maxReconnectTimes === 0) {
          store.commit('changeReconnectCircleMark', false)
        }
        init()
      } catch (e) {
        reconnect()
      }
    }

    const reconnect = () => {
      // 若达到最大重连次数，则不再执行重连操作
      if (lockReconnect || store.state.maxReconnectTimes <= 0) {
        if (store.state.maxReconnectTimes <= 0) {
          store.commit('changeConnectStatus', -1)
        }
        return
      }
      lockReconnect = true
      clearTimeout(reconnectTimer)
      if (store.state.reconnectCircleMark === true) {
        createSocket()
        lockReconnect = false
        store.commit('changeReconnectCircleMark', false)
      } else {
        reconnectTimer = setTimeout(() => {
          createSocket()
          lockReconnect = false
        }, reconnectTime)
      }
    }

    const heartCheck = {
      timeoutObj: setTimeout(() => {
      }),
      serverTimeoutObj: setInterval(() => {
      }),
      reset: function () {
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
        return this
      },
      start: function () {
        let self = this
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
        this.timeoutObj = setTimeout(function () {
          //这里发送一个心跳，后端收到后，返回一个心跳消息，
          try {
            store.state.websocket.send(JSON.stringify({
              "messageType": "ping"
            }))
          } catch (e) {
            reconnect()
            return
          }
          self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
            store.state.websocket.close()//如果onclose会执行reconnect，只需执行websocket.close()
          }, heartBeatTimeout)
        }, heartBeatTime)
      }
    }

    const init = () => {
      store.state.websocket.onopen = function (event) {
        lockReconnect = true
        store.commit('changeConnectStatus', 1)
        store.commit('changeMaxReconnectTimes', store.state.defaultReconnectTimes)
        store.commit('changeReconnectCircleMark', true)
        //心跳检测重置并发送心跳
        heartCheck.reset().start()
      }

      //接收到消息的回调方法
      store.state.websocket.onmessage = function (event) {
        lockReconnect = true
        heartCheck.reset().start()
        store.commit('changeConnectStatus', 1)
        userEvent.detail.data = event.data
        msgListEvent.detail.data = event.data
        msgDetailEvent.detail.data = event.data
        window.dispatchEvent(userEvent)
        window.dispatchEvent(msgListEvent)
        window.dispatchEvent(msgDetailEvent)
      }

      //连接发生错误的回调方法
      store.state.websocket.onerror = function (event) {
        lockReconnect = false
        store.commit('changeConnectStatus', 0)
        heartCheck.reset()
        reconnect()
      }

      //连接关闭的回调方法
      store.state.websocket.onclose = function (event) {
        lockReconnect = false
        store.commit('changeConnectStatus', 0)
        heartCheck.reset()//心跳检测
        reconnect()
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        store.state.websocket.close()
      }
    }

    reconnect()

    //点击切换到登录页面
    const login = () => {
      showLoginStatus.value = true
      showType.value = "login"
    }

    //点击切换到注册页面
    const register = () => {
      showLoginStatus.value = true
      showType.value = "register"
    }

    //关闭登录弹窗
    const closeWindow = () => {
      showLoginStatus.value = false
    }

    //关闭用户编辑弹窗
    const closeUserWindow = () => {
      showUserStatus.value = false
    }

    //子组件传值切换登录注册页面，该逻辑以UserInformation组件为主组件
    const changeShowType = (data) => {
      showType.value = data
    }

    //显示用户名
    const showUser = () => {
      return store.state.loginCode === 1000 && store.state.loginRole === 'fa'
    }

    //显示用户详情
    const showUserDetail = () => {
      getLoginStatus().then(res => {
        //当登录角色为货代，则向后台请求货代信息
        if (store.state.loginCode === 1000 && store.state.loginRole === "fa") {
          getUserInfo().then(res => {
            if (res !== null) {
              user.value = res.data
              store.commit('changeQuoteCount', user.value.sendQuoteCount)
              showUserStatus.value = true
            } else {
              messageShow('info', '请登录', 1000)
            }
          })
        } else {
          store.commit('changeQuoteCount', -1)
          store.commit('changeTotalUnReadMsgCount', 0)
          store.commit('changeNewFriendCount', 0)
        }
      })
    }

    //打开外贸页面
    const swapFtsIdentity = () => {
      const {href} = route.resolve({
        path: '/fts'
      })
      window.open(href, '_blank')
    }

    watch(
        () => store.state.quoteCount,
        (val, preVal) => {
          if (val !== undefined) {
            quoteCount.value = val
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    // 监控重连状态变化决定是否执行重连操作
    watch(
        () => store.state.reconnectCircleMark,
        (val, preVal) => {
          if (val === true && store.state.maxReconnectTimes === store.state.defaultReconnectTimes && store.state.connectStatus !== 1) {
            reconnect()
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    const removeListener = () => {
      window.removeEventListener('user', function () {
      })
      window.removeEventListener('msgList', function () {
      })
      window.removeEventListener('msgDetail', function () {
      })
    }

    onBeforeUnmount(() => {
      removeListener()
    })

    onUnmounted(() => {
      removeListener()
    })

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
      showUserDetail,
      swapFtsIdentity,
      quoteCount
    }
  }
}
</script>

<style scoped>
#user {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 550px;
  height: 100%;
  text-align: center
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
  position: relative;
  height: 15px;
  right: 30px;
  text-decoration: underline;
  font-size: 12px;
}

.quote-remain {
  position: absolute;
  right: 30px;
  top: 50px;
  height: 20px;
  display: inline-block;
  font-size: 13px;
}


</style>