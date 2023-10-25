<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="menu">
    <slot name="market">
      <router-link to="/market">
        <div class="sub-menu">
          <img src="@/assets/images/market.png" alt="">
          市场
        </div>
      </router-link>
    </slot>
    <slot name="message">
      <router-link to="/message">
      <span v-show="unReadMsgCount > 0">
        <span class="short-text" v-if="0 < unReadMsgCount && unReadMsgCount <= 99">{{ unReadMsgCount }}</span>
        <span class="long-text" v-else>99+</span>
      </span>
        <div class="sub-menu">
          <img src="@/assets/images/message.png" alt="">
          消息
        </div>
      </router-link>
    </slot>
    <slot name="quote">
      <router-link to="/quote">
        <div class="sub-menu">
          <img src="@/assets/images/quote.png" alt="">
          报价
        </div>
      </router-link>
    </slot>
    <slot name="friend">
      <router-link to="/friend">
        <span v-show="newFriendCount > 0">
          <span class="short-text" v-if="0 < newFriendCount && newFriendCount <= 99">{{ newFriendCount }}</span>
          <span class="long-text" v-else>99+</span>
        </span>
        <div class="sub-menu">
          <img src="@/assets/images/friend.png" alt="">
          好友
        </div>
      </router-link>
    </slot>
    <slot name="suggestion">
      <router-link to="/suggestion">
        <div class="sub-menu">
          <img src="@/assets/images/suggestion.png" alt="">
          反馈
        </div>
      </router-link>
    </slot>
  </div>
</template>

<script>
import store from '@/store'
import {watch, ref, onMounted} from "vue"
import {getUnReadMsgCount} from 'network/message'
import {getNewFriendCount} from 'network/friend'
import {messageShow} from "@/config/common"

export default {
  name: "LeftMenu",

  setup() {
    const unReadMsgCount = ref(0)
    const newFriendCount = ref(0)

    onMounted(() => {
      window.addEventListener('onmessageWS', function (data) {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss') + '监听到的数据是' + data.detail.data)
      })

      getUnReadMsgCount().then(res => {
        if (res === -1) {
          messageShow('error', '后台错误，联系管理员', 1000)
        } else {
          unReadMsgCount.value = res
          store.commit('changeTotalUnReadMsgCount', res)
        }
      })
      getNewFriendCount().then(res => {
        if (res === -1) {
          messageShow('error', '后台错误，联系管理员', 1000)
        } else {
          newFriendCount.value = res
          store.commit('changeNewFriendCount', res)
        }
      })
    })

    watch(
        () => store.state.totalUnReadMsgCount,
        (val, preVal) => {
          if (val !== undefined) {
            unReadMsgCount.value = val
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    watch(
        () => store.state.newFriendCount,
        (val, preVal) => {
          if (val !== null && val !== undefined) {
            newFriendCount.value = val
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    return {
      unReadMsgCount,
      newFriendCount,
    }
  }
}
</script>

<style scoped>
#menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
  z-index: 1003;
  float: left;
  width: 100px;
  height: 550px;
  background-color: rgb(245, 245, 245);
}

.sub-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
}

.short-text, .long-text {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  left: 18px;
  top: 10px;
  line-height: 15px;
  border: none;
  text-align: center;
  background: rgb(247, 76, 49);
  color: white;
  font: 12px normal iconfont;
}

.long-text {
  width: 30px;
  border-radius: 20px;
}

img {
  margin-bottom: 4px;
  width: 25px;
  height: 25px;
}
</style>