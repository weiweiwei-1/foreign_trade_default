<template>
  <div class="wrapper">
    <div class="content">
      <div id="friend-icon">
        <div id="friend-exist" :class="{active:showActive('exist')}">
          <img src="@/assets/images/friend_icon.png" @click="showTab('exist')">
        </div>
        <div id="add-friend" :class="{active:showActive('add')}">
          <img src="@/assets/images/add_friend_icon.png" @click="showTab('add')">
          <span v-if="newFriendCount > 0">{{ newFriendCount }}</span>
        </div>
      </div>
      <div v-if='showType === "exist"' class="exist-friend-list">
        <div class="exist-friend-item" v-for="(item, index) in friendList" @click="chatFriend(item.id, index)"
             :class="{active1:showFriendActive(item.id)}">
          <div class="fts-img-block">
            <img :src="$ftsImageUrl + item.photo" alt="">
          </div>
          <div class="name">{{ item.friendMark }}</div>
        </div>
      </div>
      <div v-else class="add-friend-list">
        <div class="add-friend-item" v-for="(item, index) in addFriendList"
             @click="permitUserShow(item.senderId, index)" :class="{active2:showAddFriendActive(item.senderId)}">
          <div class="img-block">
            <img :src="$ftsImageUrl + item.photo">
          </div>
          <div class="add-friend-avater">
            <div class="apply-name">{{ item.name }}</div>
            <div class="apply-remark">我是{{ item.senderName }}</div>
          </div>
          <div class="edit">
            <button class="permit">通过</button>
            <button class="reject">拒绝</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <permit-user v-if="ftsUserShow" :ftsId="ftsId" :targetIndex="permitIndex" @closeWindow="closeWindow"></permit-user>
</template>

<script>
import {nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch} from 'vue'
import {getFriendList, getFriendApplyList, getNewFriendCount} from "network/friend"
import PermitUser from 'views/content/friend/PermitUser.vue'
import store from "@/store"
import {messageShow} from "@/config/common"

export default {
  name: "FtsFriendList",
  components: {
    PermitUser
  },
  props: {
    targetIndex: {
      type: Number,
      required: false,
      default: null
    }
  },
  setup(props, context) {
    const showType = ref("exist")
    const friendList = ref(null)
    const addFriendList = ref(null)
    const ftsUserShow = ref(false)
    const ftsId = ref(null)
    const changeIndex = ref(null)
    const permitIndex = ref(null)
    const newFriendCount = ref(store.state.newFriendCount)
    const closeWindow = (index) => {
      if (index !== undefined) {
        addFriendList.value.splice(index, 1)
      }
      ftsUserShow.value = false
      // 关闭窗口，添加好友列表的选项颜色变白，ftsId置为-1
      const target = document.querySelectorAll('.add-friend-item')[permitIndex.value]
      target.style.background = 'white'
      ftsId.value = -1
    }
    const showActive = (data) => {
      return showType.value === data
    }

    const showFriendActive = (data) => {
      return ftsId.value === data
    }

    const showAddFriendActive = (data) => {
      return ftsId.value === data
    }
    const showTab = (data) => {
      showType.value = data
      ftsId.value = -1
    }

    function error(msg) {
      messageShow('error', msg, 1000)
    }

    const chatFriend = (id, index) => {
      context.emit('changeFtsId', id, index)
      ftsId.value = id
      changeIndex.value = index
    }

    const permitUserShow = (id, index) => {
      ftsId.value = id
      permitIndex.value = index
      ftsUserShow.value = true
    }

    const deleteFriend = (data) => {
      console.log('删除好友触发')
      let ftsId = data.detail.data.ftsId
      for (let i = 0; i < friendList.value.length; i++) {
        if (friendList.value[i].id === ftsId) {
          friendList.value.splice(i, 1)
          break
        }
      }
    }

    const updateRemark = (data) => {
      let obj = data.detail.data
      let ftsId = obj.ftsId
      let remark = obj.remark
      for (let i = 0; i < friendList.value.length; i++) {
        if (friendList.value[i].id === ftsId) {
          friendList.value[i].friendMark = remark
          break
        }
      }
    }

    onMounted(() => {
      window.addEventListener('remarkUpdate', updateRemark)
      window.addEventListener('delFriend', deleteFriend)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('remarkUpdate', function () {
      })
      window.removeEventListener('delFriend', function () {
      })
    })

    onUnmounted(() => {
      window.removeEventListener('remarkUpdate', function () {
      })
      window.removeEventListener('delFriend', function () {
      })
    })

    watch(
        () => showType.value,
        (val, preVal) => {
          if (val === 'exist') {
            getFriendList().then(res => {
              switch (res.code) {
                case 1:
                  nextTick(() => {
                    friendList.value = res.data
                  })
                  break
                case -1:
                  error(res.msg)
              }
            })
            getNewFriendCount().then(res => {
              switch (res) {
                case -1:
                  messageShow('error', '后台错误，联系管理员', 1000)
                  break
                default:
                  store.commit('changeNewFriendCount', res)
              }
            })
          } else {
            getFriendApplyList().then(res => {
              switch (res.code) {
                case 1:
                  nextTick(() => {
                    addFriendList.value = res.data
                  })
                  break
                case -1:
                  error(res.msg)
              }
            })
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
      showActive,
      showTab,
      showType,
      friendList,
      addFriendList,
      ftsUserShow,
      permitUserShow,
      ftsId,
      closeWindow,
      showFriendActive,
      showAddFriendActive,
      chatFriend,
      deleteFriend,
      permitIndex,
      newFriendCount
    }
  }
}
</script>

<style scoped>
.active {
  background: rgb(250, 157, 59);
}

.active1, .active2 {
  background: rgb(230, 229, 229);
}

.wrapper {
  width: 250px;
  height: 550px;
  overflow: hidden;
  border: 1px solid rgb(220, 220, 220);
  z-index: 1003;
  background: rgb(255, 255, 255);
}

::-webkit-scrollbar {
  display: none;
}

#friend-icon {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 60px;
}

#friend-exist, #add-friend {
  width: 125px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(220, 220, 220);
}

.fts-img-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 100%;
  margin: 0 0 0 7px;
}

#add-friend span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  text-align: center;
  background: rgb(247, 76, 49);
  color: white;
  font: 12px normal iconfont;
}

img {
  width: 45px;
  height: 45px;
  cursor: pointer;
}

.exist-friend-item, .add-friend-item {
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

.exist-friend-list, .add-friend-list {
  width: 100%;
  height: 490px;
  overflow-y: auto;
}

.add-friend-avater {
  text-align: left;
  width: 115px;
  height: 40px;
  margin: 0 0 0 4px;
}

.add-friend-avater div {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.name, .apply-name, .apply-remark {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 18px;
}

.name {
  width: 180px;
  text-align: left;
}

.apply-name {
  width: 90px;
}

.apply-remark {
  width: 120px;
}

.apply-remark {
  font-size: 12px;
  color: #9C9C9C;
  margin: 8px 0 0 0
}

.edit {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40px;
  height: 40px;
  margin: 0 0 0 20px;
}

button {
  color: white;
  height: 18px;
  width: 40px;
  border: none;
  cursor: pointer;
  line-height: 18px;
  /*font-size: 4px;*/
}

.permit {
  background: rgb(26, 173, 25);
}

.reject {
  background: rgb(255, 0, 0)
}

</style>