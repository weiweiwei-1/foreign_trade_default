<template>
  <div id="sideBar">
    <div class="search-block">
      <input type="text" v-model="friendCondition" @keyup="keySearch" placeholder="输入模糊名字或完整账号查询">
      <button @click="searchFriend">搜索</button>
    </div>
    <div class="wrapper">
      <ul>
        <li v-for="(item, index) in recommendList" @click="showTargetFtsUser(item.id, index)">
          <div class="img-block">
            <img :src="$ftsImageUrl + item.photo">
          </div>
          <div class="fts-name">
            <span>{{ item.name }}</span>
            <span v-if="item.onlineStatus === '1'">在线</span>
            <span v-else style="color: #9C9C9C">离线</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="fresh-btn" @click="refresh">刷新</div>
  </div>
  <add-user v-if="ftsUserShow" :ftsId="ftsId" :targetIndex="targetIndex" @closeWindow="closeWindow"></add-user>
</template>

<script>

import {getRecommendFriendList, getFriendListByCondition} from "network/friend"
import {onMounted, ref} from "vue"
import AddUser from "views/content/friend/AddUser.vue"
import {messageShow} from "@/config/common"

export default {
  name: "SideBar",

  components: {
    AddUser
  },

  setup(props, context) {
    const recommendList = ref(null)
    const ftsUserShow = ref(false)
    const ftsId = ref(null)
    const targetIndex = ref(null)
    const friendCondition = ref('')

    function refreshRecommend() {
      getRecommendFriendList().then(res => {
        switch (res.code) {
          case 1:
            recommendList.value = res.data
            break
          case -1:
            messageShow('error', res.msg, 1000)
            break
        }
      })
    }

    onMounted(() => {
      refreshRecommend()
    })

    const searchFriend = () => {
      if (friendCondition.value.trim() === '') {
        refreshRecommend()
      } else {
        const param = {
          'condition': friendCondition.value.trim()
        }
        getFriendListByCondition(param).then(res => {
          recommendList.value = res.data
        })
      }
    }

    const keySearch = (e) => {
      if (e.keyCode === 13) {
        searchFriend()
      }
    }

    const showTargetFtsUser = (id, index) => {
      ftsId.value = id
      targetIndex.value = index
      ftsUserShow.value = true
    }

    const closeWindow = (index) => {
      if (index !== undefined) {
        recommendList.value.splice(index, 1)
      }
      ftsUserShow.value = false
    }

    const refresh = () => {
      refreshRecommend()
    }

    return {
      friendCondition,
      searchFriend,
      keySearch,
      recommendList,
      ftsUserShow,
      ftsId,
      showTargetFtsUser,
      closeWindow,
      refresh,
      targetIndex
    }
  }
}

</script>

<style scoped>
#sideBar {
  position: relative;
  z-index: 1003;
  float: left;
  width: 266px;
  height: 550px;
  border: 1px solid #f2f2f2;
  background: white;
}

.search-block {
  width: 100%;
  height: 30px;
}

input, button {
  display: inline-block;
  height: 28px;
}

input {
  border: 1px solid black;
  outline: none;
  color: #999;
  padding: 3px;
  width: 205px;
  font-size: 12px;
  border-right: none;
}

button {
  cursor: pointer;
  width: 45px;
}

.wrapper {
  height: 480px;
  overflow-y: auto;
}

.fresh-btn {
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  color: blue;
}

::-webkit-scrollbar {
  display: none;
}

ul {
  display: block;
  position: relative;
  height: 100%;
  width: 265px;
  font-family: 'helvetica neue', tahoma, 'hiragino sans gb', stheiti, 'wenquanyi micro hei', sans-serif;
  overflow-x: hidden;
}

li {
  width: 100px;
  height: 150px;
  margin-left: 25px;
  margin-top: 15px;
  box-sizing: border-box;
  display: inline-block;
  float: left;
  font-size: 12px;
  border: 1px solid #f2f2f2;
  background: #fff;
  vertical-align: top;
  text-align: -webkit-match-parent;
  cursor: pointer;
}

img {
  width: 80px;
  height: 80px;
}

.fts-name {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fts-name span {
  display: inline-block;
  font: 12px/13px sans-serif;
  width: 80px;
  height: 25px;
  overflow: hidden;
}

.fts-name span:first-child {
  margin: 7px 0;
}

.fts-name span:last-child {
  display: inline-block;
  width: 60px;
  height: 15px;
  color: #00B82F;
}
</style>