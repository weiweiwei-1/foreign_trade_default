<template>
  <div>
    <transition>
      <div id="fts-info" v-show="ftsInfoShow()">
        <div class="image-content">
          <img :src="$ftsImageUrl + ftsInfo.photo">
        </div>
        <div>
          <ul>
            <li><span class="key">昵称</span>：<span class="val">{{ ftsInfo.name }}</span></li>
            <li><span class="key">城市</span>：<span class="val">{{ ftsInfo.city }}</span></li>
            <li><span class="key">公司</span>：<span class="val">{{ ftsInfo.company }}</span></li>
            <li><span class="key">官网</span>：<span class="val">{{ ftsInfo.storeLink }}</span></li>
            <li><span class="key">行业</span>：<span class="val">{{ ftsInfo.industry }}</span></li>
            <li><span class="key">主要产品</span>：<span class="val">{{ ftsInfo.mainProduct }}</span></li>
          </ul>
        </div>
        <div class="detail-panel" @click="showFriendInfo">
          <span v-if="friendStatus === 0">更多资料></span>
          <span v-else>好友编辑</span>
        </div>
        <div id="friend-block" v-if="friendStatus === 0" style="border-top: none" @click="showAddFriendWindow">
          添加好友>
        </div>
      </div>
    </transition>
    <add-friend v-if="addFriendShowStatus" @closeAddFriendWindow="closeAddFriendWindow"
                :ftsId="ftsInfo.id + ''"></add-friend>
    <friend-info :showStatus="showStatus" :friendStatus="friendStatus"
                 @closeFriendInfo="closeFriendInfo" :ftsId="ftsId + ''" ref="friendInfoChild"></friend-info>
  </div>
</template>

<script>
import AddFriend from 'views/content/quote/AddFriend.vue'
import AddUser from 'views/content/friend/AddUser.vue'
import FriendInfo from "views/content/friend/FriendInfo.vue"
import {nextTick, ref, watch, onMounted} from 'vue'
import {getFtsInfoByFtsId} from "network/user-fts"
import {getFriendStatus} from "network/friend"
import {messageShow} from "@/config/common"

export default {
  name: "FtsInfo",
  components: {
    AddFriend,
    AddUser,
    FriendInfo
  },
  props: {
    ftsInfoShowStatus: {
      type: Boolean,
      required: true,
      default: false
    },
    ftsId: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props, context) {
    const ftsInfo = ref(Object)
    const friendStatus = ref(0)
    const addFriendShowStatus = ref(false)
    const showStatus = ref(false)
    const changeMark = ref(true)
    const friendInfoChild = ref(null)
    const ftsInfoShow = () => {
      return props.ftsInfoShowStatus
    }

    const showFtsInfo = () => {
      if (changeMark.value === true) {
        const param = {
          'ftsId': props.ftsId,
        }
        getFtsInfoByFtsId(param).then(res => {
          if (res.code === 1) {
            nextTick(() => {
              ftsInfo.value = res.data
            })
          } else if (res.code === -1) {
            messageShow('error', res.msg, 1000)
          }
        })
        getFriendStatus(param).then(res => {
          if (res.code === 1) {
            friendStatus.value = res.data
          }
        });
        // 从后台获取到数据后，将changeMark置为false
        changeMark.value = false
      }
    }

    onMounted(() => {
      showStatus.value = false
    })

    const showFriendInfo = () => {
      showStatus.value = true
      friendInfoChild.value.loadFriendInfo()
    }

    const closeAddFriendWindow = () => {
      addFriendShowStatus.value = false;
    };

    const showAddFriendWindow = () => {
      addFriendShowStatus.value = true;
    }

    const closeFriendInfo = () => {
      showStatus.value = false
    }

    document.addEventListener("click", e => {
      const btnTarget = document.querySelector('#fts-info-show');
      const insideTarget = document.querySelector('#fts-info');
      if (btnTarget && !btnTarget.contains(e.target) && insideTarget && !insideTarget.contains(e.target)) {
        context.emit('closeFtsInfoShow');
      }
    })

    watch(
        () => props.ftsId,
        (val, preVal) => {
          if (val !== null && val !== undefined) {
            changeMark.value = true
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    return {
      ftsInfoShow,
      ftsInfo,
      friendStatus,
      addFriendShowStatus,
      closeAddFriendWindow,
      showAddFriendWindow,
      showFtsInfo,
      showStatus,
      closeFriendInfo,
      showFriendInfo,
      friendInfoChild
    }
  }
}
</script>

<style scoped>
#fts-info {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 500px;
  z-index: 1002;
  width: 250px;
  height: 505px;
  background: whitesmoke;
  font: 15px/20px Arial, sans-serif;
}

.v-enter-active {
  animation: slidein 0.5s linear;
}

.v-leave-active {
  animation: slidein 0.5s linear reverse;
}

@keyframes slidein {
  from {
    transform: translateX(100%);
    /*正数为右滑，负数为左滑*/
  }
  to {
    transform: translateX(0px);
  }
}

.image-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 100px;
  border-bottom: 1px solid lightgrey
}

img {
  width: 41px;
  height: 41px;
}

ul {
  margin: 0 0 0 10px;
}

li, .key, .val {
  display: inline-block;
  vertical-align: middle;
}

li {
  width: 100%;
  list-style: none;
  text-align: left;
  margin: 8px 0;
}

.key {
  width: 64px;
  height: 21px;
  text-align: justify;
  -moz-text-align-last: justify;
  text-align-last: justify;
  padding: 0;
}

.val {
  text-align: left;
  width: 150px;
  height: 21px;
  overflow: hidden;
}

.detail-panel, #friend-block {
  width: 200px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid lightgrey;
  border-top: 1px solid lightgrey;
  cursor: pointer;
}

.detail-panel {
  margin: 20px 0 0 0;
}

#friend-block {
  border-bottom: 1px solid lightgrey;
}
</style>