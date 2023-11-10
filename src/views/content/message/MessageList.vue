<template>
  <div class="wrapper">
    <div class="content">
      <div id="fts-msg-list">
        <slot name="message-list" v-for="(item, index) in messageList">
          <div class="fts-msg-item" @click="changeId(item.friendId, item.unReadMessageCount)"
               :class="{active:showActive(item.friendId)}">
            <div class="img-block">
              <img :src="$ftsImageUrl + item.friendPhoto" alt="">
            </div>
            <div class="fts-msg-avater">
              <div class="fts-name">{{ item.friendMark }}</div>
              <div class="fts-preview">{{ item.content }}</div>
            </div>
            <div class="fts-msg-time">
              <div class="send-msg-time">
                {{ $filters.dateFormat(item.sendTime, "YY-MM-DD") }}
              </div>
              <div class="unread-count" :id="item.friendId"
                   v-show="item.unReadMessageCount !== null && item.unReadMessageCount > 0">
                <span class="short-text" v-if="0 < item.unReadMessageCount && item.unReadMessageCount <= 99">{{
                    item.unReadMessageCount
                  }}</span>
                <span class="long-text" v-else>99+</span>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, nextTick, onUnmounted, onBeforeUnmount} from 'vue'
import {getMsgList} from 'network/message'
import store from '@/store'
import {addUnReadMsgCount, messageShow} from '@/config/common'

export default {
  name: "MessageList",
  emits: ['changeId'],
  setup(props, context) {
    const messageList = ref(Object)
    const activeId = ref('')

    function messageHandler(data) {
      let JSONbigString = require('json-bigint')({"storeAsString": true})
      let obj = JSONbigString.parse(data.detail.data)
      switch (obj.messageType) {
        case 'sendMessage':
          for (let i = 0; i < messageList.value.length; i++) {
            if (messageList.value[i].friendId === obj.senderId) {
              messageList.value[i].content = obj.content
              if (activeId.value !== obj.senderId) {
                messageList.value[i].unReadMessageCount++
                addUnReadMsgCount()
                if (messageList.value[i].unReadMessageCount === 1) {
                  let obj = messageList.value.splice(i, 1)[0]
                  messageList.value.unshift(obj)
                }
              }
              break
            }
          }
          break
        case 'hasRead':
          for (let i = 0; i < messageList.value.length; i++) {
            if (messageList.value[i].friendId === obj.senderId) {
              messageList.value[i].unReadMessageCount = 0
              break
            }
          }
          break
        case 'sendSuccess':
          for (let i = 0; i < messageList.value.length; i++) {
            if (messageList.value[i].friendId === obj.receiverId) {
              messageList.value[i].content = obj.content
              messageList.value[i].unReadMessageCount = 0
              break
            }
          }
          break
        case 'addFriend':
          nextTick(() => {
            addFriendMsgChange(obj)
          })
          break
      }
    }

    function updateRemark(data) {
      let ftsId = data.detail.data.ftsId
      let remark = data.detail.data.remark
      for (let i = 0; i < messageList.value.length; i++) {
        if (messageList.value[i].friendId === ftsId) {
          messageList.value[i].friendMark = remark
          break
        }
      }
    }

    const addListener = () => {
      window.addEventListener('msgList', messageHandler)
      window.addEventListener('remarkUpdate', updateRemark)
    }

    onMounted(() => {
      getMsgList().then(res => {
        switch (res.code) {
          case 1:
            store.commit('changeMsgListComStatus', true)
            nextTick(() => {
              messageList.value = res.data
              let unReadCount = 0
              for (let i = 0; i < messageList.value.length; i++) {
                if (messageList.value[i].unReadMessageCount > 0) {
                  unReadCount += messageList.value[i].unReadMessageCount
                }
              }
              store.commit('changeTotalUnReadMsgCount', unReadCount)
            })
            break
          case -1:
            messageShow('error', res.msg, 1000)
        }
      })
      addListener()
    })

    function addFriendMsgChange(obj) {
      let zeroMark = false
      let target = null
      let msgExist = false
      let index = 0
      for (let j = 0; j < messageList.value.length; j++) {
        if (messageList.value[j].friendId === obj.friendId && activeId.value !== obj.friendId) {
          msgExist = true
          messageList.value[j].unReadMessageCount += 1
          addUnReadMsgCount()
          messageList.value[j].content = obj.content
          if (messageList.value[j].unReadMessageCount === 1) {
            target = messageList.value[j]
            messageList.value.splice(j, 1)
            zeroMark = true
          }
          break
        } else if (messageList.value[j].friendId === obj.friendId && activeId.value === obj.friendId) {
          msgExist = true
          index = j
          break
        }
      }
      if (zeroMark === true) {
        nextTick(() => {
          messageList.value.unshift(target)
        })
      }
      if (!msgExist) {
        nextTick(() => {
          messageList.value.unshift(obj)
        })
      }
      if (obj.friendId === activeId.value) {
        nextTick(() => {
          messageList.value[index].content = obj.content
        })
      }
    }

    const updateListContent = (ftsId, content) => {
      for (let i = 0; i < messageList.value.length; i++) {
        if (messageList.value[i].friendId === ftsId && activeId.value === ftsId) {
          messageList.value[i].content = content
        } else if (messageList.value[i].friendId === ftsId && activeId.value !== ftsId) {
          messageList.value[i].content = content
          messageList.value[i].unReadMessageCount += 1
        }
      }
    }

    const removeListener = () => {
      window.removeEventListener('msgList', messageHandler)
      window.removeEventListener('remarkUpdate', function () {
      })
    }


    onBeforeUnmount(() => {
      store.commit('changeMsgListComStatus', false)
      removeListener()
    })

    onUnmounted(() => {
      store.commit('changeMsgListComStatus', false)
      removeListener()
    })

    const changeId = (ftsId) => {
      context.emit('changeId', ftsId)
      activeId.value = ftsId
    }

    const showActive = (id) => {
      return activeId.value === id
    }

    return {
      messageList,
      changeId,
      showActive,
      updateListContent
    }
  }
}
</script>

<style scoped>

.active {
  background: rgb(230, 229, 229);
}

.wrapper {
  width: 250px;
  height: 550px;
  overflow: hidden;
  border: 1px solid rgb(220, 220, 220);
  z-index: 1003;
}

#fts-msg-list {
  position: relative;
  display: block;
  top: 0;
  left: 0;
  overflow-y: auto;
  width: 100%;
  height: 550px;
  background: rgb(255, 255, 255);
}

::-webkit-scrollbar {
  display: none;
}

.fts-msg-item {
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 65px;
  cursor: pointer;
  color: #222;
  font: 14px normal iconfont;
  border-bottom: 1px solid #eaeaea;
}

.img-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 100%;
  margin: 0 0 0 7px;
}

img {
  width: 41px;
  height: 41px;
}

.fts-msg-avater {
  text-align: left;
  width: 115px;
  height: 40px;
  margin: 0 0 0 4px;
}

.fts-msg-avater div {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.fts-name, .fts-preview {
  width: 100%;
  height: 18px;
}

.fts-preview, .send-msg-time, .unread-count {
  font-size: 12px;
  color: #9C9C9C;
}

.fts-preview, .unread-count {
  margin: 5px 0 0 0;
}

.fts-msg-time {
  width: 70px;
  height: 40px;
  text-align: center;
}

.send-msg-time, .unread-count {
  height: 18px;
  color: rgb(190, 190, 190);
}

span {
  display: inline-block;
  height: 16px;
  line-height: 15px;
  border: none;
  text-align: center;
  background: rgb(247, 76, 49);
  color: white;
}

.short-text {
  width: 16px;
  border-radius: 50%;
}

.long-text {
  width: 30px;
  border-radius: 20px;
}
</style>