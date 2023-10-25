<template>
  <div id="chat-block">
    <div class="main-chat">
      <div class="main-msg-box-wrapper">
        <div class="msg-items">
          <div class="msg-area" v-for="item in messageList">
            <div class="chat-item">
              <div v-if="item.senderId !== faMsgInfo.faId" class="chat-profile-info">
                                <span class="profile-wrp">
                                    <span class="name-clearfix">
                                        <span class="user-name">{{ ftsMsgInfo.name }}</span><span class="msg-time">{{
                                        $filters.dateFormat(item.sendTime, "YYYY-MM-DD HH:mm:ss")
                                      }}</span>
                                    </span>
                                </span>
              </div>
              <div v-else class="chat-profile-info chat-profile-right">
                                <span class="profile-wrp profile-wrp-right">
                                    <span class="name-clearfix name-clearfix-right">
                                        <span class="user-name">{{ faMsgInfo.name }}</span><span class="msg-time">{{
                                        $filters.dateFormat(item.sendTime, "YYYY-MM-DD HH:mm:ss")
                                      }}</span>
                                    </span>
                                </span>
              </div>
              <div v-if="item.senderId !== faMsgInfo.faId" class="content-area">
                <div class="avatar">
                  <img :src="$ftsImageUrl + ftsMsgInfo.photo" alt="">
                </div>
                <div class="msg-bubble-box">
                  <div class="msg-bubble">
                    <pre>{{ item.content }}</pre>
                  </div>
                </div>
              </div>
              <div v-else class="content-area content-area-right">
                <div class="avatar avatar-right">
                  <img :src="$faImageUrl + faMsgInfo.photo" alt="">
                </div>
                <div class="msg-bubble-box">
                  <div class="msg-bubble">
                    <pre>{{ item.content }}</pre>
                  </div>
                  <div class="msg-read-status" v-if="item.status === '1'">
                    已读
                  </div>
                  <div class="msg-read-status" v-else>
                    未读
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="send-msg-box-wrapper">
      <div class="input-area">
        <div class="emo-block">
          <img src="@/assets/images/emo.png" alt="">
          <img src="@/assets/images/file.png" alt="">
        </div>
        <div class="msg-box">
          <textarea v-model="msgContent"></textarea>
        </div>
      </div>
      <div class="action-area" @click="sendMsg">
        发送
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch} from 'vue'
import {getFaInfo, getFtsMessageInfoBySenderId, getMessageContentBySenderId, readAllMessages} from 'network/message'
import store from '@/store'
import {addUnReadMsgCount, messageShow} from "@/config/common"

export default {
  name: "ChatDetail",
  props: {
    ftsId: {
      type: String,
      required: false,
      default: null
    },
    reMark: {
      type: String,
      required: false,
      default: null
    },
  },
  setup(props, context) {
    const {proxy} = getCurrentInstance()
    const messageList = ref(Object)
    const ftsId = ref(null)
    const faMsgInfo = ref(null)
    const ftsMsgInfo = ref(null)
    const msgContent = ref('')
    const sendDate = ref('')

    // 将最新消息直接定位到最底部
    function slideToBottom() {
      const wrapper = document.querySelector('.main-msg-box-wrapper')
      wrapper.scrollTop = wrapper.scrollHeight
    }

    function messageHandler(data) {
      let JSONbigString = require('json-bigint')({"storeAsString": true})
      let obj = JSONbigString.parse(data.detail.data)
      switch (obj.messageType) {
        case 'sendMessage':
          // 若当前窗口的ftsId和消息的senderId匹配，则将新消息直接添加到已有的messageList尾部，同时触发读消息
          if (ftsId.value === obj.senderId) {
            messageList.value.push(obj)
            const senderIdParam = {
              senderId: ftsId.value
            }
            readMsgInWin(senderIdParam)
            nextTick(() => {
              slideToBottom()
            })
          } else {
            let target = document.getElementById('fts-msg-list')
            if (!target) {
              addUnReadMsgCount()
            }
          }
          break
        case 'readMessage':
          const receiverId = obj.receiverId
          if (ftsId.value === receiverId) {
            setReadStatus(messageList)
          }
          break
        case 'sendSuccess':
          const message = {
            "senderId": faMsgInfo.value.faId,
            "receiverId": ftsId.value,
            "content": msgContent.value,
            "messageType": "sendMessage",
            "sendTime": sendDate.value
          }
          messageList.value.push(message)
          msgContent.value = ''
          nextTick(() => {
            slideToBottom()
          })
          break
        case 'sendFail':
          messageShow('error', '消息发送失败，确保他是您的好友或进行过报价', 1000)
          break
        case 'addFriend':
          if (obj.friendId === ftsId.value) {
            const message = {
              "senderId": ftsId.value,
              "receiverId": faMsgInfo.value.faId,
              "content": obj.content,
              "sendTime": obj.sendTime
            }
            messageList.value.push(message)
            nextTick(() => {
              slideToBottom()
            })
          } else {
            addUnReadMsgCount()
          }
          break
      }
    }

    const updateRemark = (data) => {
      ftsMsgInfo.value.name = data.detail.data.remark
    }

    const delFriend = (data) => {
      let ftsId = data.detail.ftsId
      if (ftsMsgInfo.value.id === ftsId) {
        context.emit('closeMsgShow')
      }
    }

    onMounted(() => {
      getFaInfo().then(res => {
        switch (res.code) {
          case 1:
            store.commit('changeMsgDetailComStatus', true)
            nextTick(() => {
              faMsgInfo.value = res.data
            })
            break
          case -1:
            messageShow('error', res.msg, 1000)
            break
        }
      })
      window.addEventListener('msgDetail', messageHandler)
      window.addEventListener('remarkUpdate', updateRemark)
      window.addEventListener('delFriend', delFriend)
    })

    onBeforeUnmount(() => {
      store.commit('changeMsgDetailComStatus', false)
      window.removeEventListener('msgDetail', messageHandler)
      window.removeEventListener('remarkUpdate', function () {
      })
      window.removeEventListener('delFriend', function () {
      })
    })

    onUnmounted(() => {
      store.commit('changeMsgDetailComStatus', false)
      window.removeEventListener('msgDetail', messageHandler)
      window.removeEventListener('remarkUpdate', function () {
      })
      window.removeEventListener('delFriend', function () {
      })
    })

    Date.prototype.Format = function (fmt) {
      let o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()// 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
        }
      }
      return fmt
    }

    function setReadStatus(messageList) {
      for (let item = 0; item < messageList.value.length; item++) {
        messageList.value[item].status = '1'
      }
    }

    // 发消息
    const sendMsg = () => {
      if (store.state.connectStatus !== 1) {
        messageShow('info', '请连上后再试', 1000)
        return
      }
      if (msgContent.value.trim().length >= 1000) {
        messageShow('info', '输入内容长度不能大于1000', 1000)
      } else if (msgContent.value.trim() === '') {
        messageShow('info', '请输入字符', 1000)
      } else {
        const message = {
          "receiverId": ftsId.value,
          "content": msgContent.value,
          "messageType": "sendMessage",
          "sendTime": new Date().Format("yyyy-MM-dd hh:mm:ss")
        }
        sendDate.value = message.sendTime
        store.state.websocket.send(JSON.stringify(message))
      }
    }

    // 窗口读消息函数
    function readMsgInWin(senderIdParam) {
      readAllMessages(senderIdParam).then(res => {
        switch (res.code) {
          case 1:
            nextTick(() => {
              slideToBottom()
            })
            break
          case -1:
            messageShow('error', '后台错误', 1000)
            break
        }
      })
    }

    // 读消息,list点击进入窗口读消息
    function readMessage(messageList) {
      let senderIdParam = null
      let unReadCount = 0
      for (let item = messageList.value.length - 1; item >= 0; item--) {
        if (messageList.value[item].senderId !== faMsgInfo.value.faId && messageList.value[item].status === '0') {
          senderIdParam = {
            senderId: ftsMsgInfo.value.ftsId
          }
          unReadCount += 1
        } else {
          break
        }
      }
      if (senderIdParam != null) {
        readMsgInWin(senderIdParam)
      }
      store.commit('changeTotalUnReadMsgCount', store.state.totalUnReadMsgCount - unReadCount)
    }

    // 通过changeType触发消息更新逻辑
    function messageChange() {
      const senderIdParam = {
        senderId: props.ftsId
      }
      getMessageContentBySenderId(senderIdParam).then(res => {
        if (res.data !== undefined) {
          messageList.value = res.data
          readMessage(messageList)
          nextTick(() => {
            slideToBottom()
          })
        }
      })
    }

    watch(
        () => props.ftsId,
        (val, preVal) => {
          if (val !== null && val !== undefined) {
            ftsId.value = val
            const param = {
              senderId: val
            }
            getFtsMessageInfoBySenderId(param).then(res => {
              if (res.data !== undefined) {
                ftsMsgInfo.value = res.data
                messageChange()
              }
            })
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    return {
      messageList,
      ftsMsgInfo,
      faMsgInfo,
      msgContent,
      sendMsg
    }
  }
}
</script>

<style scoped>
#chat-block {
  position: absolute;
  width: 750px;
  height: 485px;
  z-index: 1000;
}

.main-chat {
  position: relative;
  -webkit-box-flex: 1;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  width: 750px;
  height: 410px;
  background: rgb(248, 251, 255);
}

.main-msg-box-wrapper {
  position: relative;
  flex: 1;
  -webkit-box-flex: 1;
  overflow: hidden;
  width: inherit;
  height: inherit;
  overflow-y: auto;
}

.main-msg-box-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: rgb(248, 251, 255);
}

.main-msg-box-wrapper::-webkit-scrollbar-thumb {
  width: 8px;
  height: 8px;
  border-radius: 22px;
  background-color: #999;
}

.msg-items {
  position: absolute;
  box-sizing: border-box;
  min-height: 100%;
  min-width: 550px;
  width: 100%;
  padding: 4px 16px 16px;
}

.chat-item {
  margin-top: 20px;
  margin-bottom: 22px;
  border: 1px solid transparent;
}

.chat-profile-info {
  display: flex;
  max-height: 21px;
}

.content-area {
  display: flex;
  flex-direction: row;
}

.profile-wrp {
  display: inline-flex;
  float: left;
  padding-left: 45px;
}

.name-clearfix, .user-name, .msg-time {
  display: inline-flex;
}

.user-name, .msg-time {
  margin-bottom: 4px;
  text-align: left;
  overflow: hidden;
}

.user-name {
  max-width: 100px;
  color: #8e97a1;
  font-size: 12px;
}

.msg-time {
  color: #bdbebf;
  font-size: 12px;
  margin: 0 6px;
  line-height: 21px;
  transform: scale(.9);
}

.avatar, .avatar img {
  width: 38px;
  height: 38px;
  margin-left: 0;
  margin-right: 7px;
  cursor: pointer;
}

.msg-bubble-box {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 500px;
}

.chat-item .msg-bubble {
  position: relative;
  min-height: 21px;
  float: left;
  clear: both;
  padding: 5px 11px;
  border: 1px solid #e1e0e4;
  border-radius: 6px;
  background-color: #fff;
  line-height: 1.5;
  overflow: hidden;
  width: 100% !important;
  max-width: none;
  box-sizing: border-box;
}

.msg-bubble {
  margin-bottom: 3px;
}

pre {
  text-align: left;
  max-width: 100%;
  word-break: normal;
  word-wrap: break-word;
  white-space: pre-wrap;
  color: #222;
  font-size: 14px;
  line-height: 1.3em;
  font-family: \\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587, Tahoma, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, STHeiti, WenQuanYi Micro Hei, SimSun, sans-serif !important;
}

.msg-read-status {
  text-align: left;
  font-style: italic;
  font-size: 10px;
}

.send-msg-box-wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #e6e5e6;
  width: 750px;
  height: 95px;
  border-top: 1px solid #e6e5e6;
}

.input-area {
  width: 672px;
  height: 100%;
}

.emo-block {
  display: flex;
  padding: 7px 7px 7px 13px;
  width: 90%;
  justify-content: flex-start;
}

.emo-block img {
  width: 18px;
  height: 18px;
  margin: 0 4px;
}

.msg-box {
  width: 100%;
  height: 63px;
  box-sizing: border-box;
  position: relative;
  flex: 1;
  display: flex;
  padding: 0 1px 0 10px;
}

textarea {
  position: relative;
  width: calc(100% - 12px);
  height: calc(100% - 7px);
  resize: none;
  border: 0;
  background-color: transparent;
  flex: 1;
  box-sizing: border-box;
  padding: 6px;
  color: #222;
  font-size: 14px;
  line-height: 1.2em;
  border-radius: 3px;
  outline: 0;
}

.action-area {
  position: relative;
  width: 77px;
  height: 100%;
  border-left: 1px solid #e6e5e6;
  color: rgb(7, 193, 96);
  line-height: 95px;
  background-color: rgb(233, 233, 233);
}

img, .action-area {
  cursor: pointer;
}

/*下面是右边显示的定义属性*/
.chat-profile-right {
  flex-direction: row-reverse;
}

.avatar-right {
  margin: 0 0 0 7px;
}

.profile-wrp-right {
  padding: 0 45px 0 0;
}

.name-clearfix-right {
  flex-direction: row-reverse;
}

.content-area-right {
  flex-direction: row-reverse;
  padding: 0 0 0 45px;
}
</style>