<template>
  <div id="fa-friend-block" @click="closeWindow" v-show="showStatus">
    <div id="friend-box">
      <div id="friend-center">
        <div id="friend-head">
          <div id="img-block">
            <img :src="$ftsImageUrl + ftsInfo.photo">
          </div>
        </div>
        <div id="friend-detail">
          <ul>
            <li><span>名字</span>：<span class="fixed-content">{{ ftsInfo.name }}</span></li>
            <li><span>备注</span>：<input type="text" v-model="remark" :readonly="readStatus"><span
                class="fixed-content"></span></li>
            <li><span>城市</span>：<span class="fixed-content">{{ ftsInfo.city }}</span></li>
            <li><span>性别</span>：<span class="fixed-content">{{ ftsInfo.sex }}</span></li>
            <li><span>年龄</span>：<span class="fixed-content">{{ ftsInfo.age }}</span></li>
            <li><span>工作年限</span>：<span class="fixed-content">{{ ftsInfo.workingTime }}</span></li>
            <li><span>公司</span>：<span class="fixed-content">{{ ftsInfo.company }}</span></li>
            <li><span>店铺链接</span>：<span class="fixed-content">{{ ftsInfo.companyLink }}</span></li>
            <li><span>行业</span>：<span class="fixed-content">{{ ftsInfo.industry }}</span></li>
            <li><span>主要产品</span>：<span class="fixed-content">{{ ftsInfo.mainProduct }}</span></li>
            <li><span>微信</span>：<span class="fixed-content"></span></li>
            <li><span>手机号</span>：<span class="fixed-content"></span></li>
            <li><span>邮箱</span>：<span class="fixed-content"></span></li>
            <li><span></span><span class="fixed-content"></span></li>
          </ul>
        </div>
        <div class="add-button" v-if="friendStatus === 1">
          <button @click="edit">{{ editText }}</button>
          <button @click="saveReMark" :disabled="disable">保存</button>
          <button @click="deleteFriend(ftsInfo.id)">删除好友</button>
        </div>
        <div class="add-button" v-else>
          <button @click="showAddFriendBlock">添加好友</button>
        </div>
      </div>
    </div>
  </div>
  <add-friend :addFriendShowStatus="addFriendShowStatus" @closeAddFriendWindow="closeAddFriendWindow"
              :ftsId="ftsId" @setFriendStatus="setFriendStatus"></add-friend>
</template>

<script>
import {watch, ref, nextTick, onUnmounted, onBeforeUnmount} from "vue"
import {getFriendInfoDetail, saveFriendReMark, deleteFaFriend} from "network/friend"
import {messageShow} from "@/config/common"
import AddFriend from 'views/content/quote/AddFriend.vue'

export default {
  name: "FtsFriendInfo",
  components: {
    AddFriend
  },
  props: {
    ftsId: {
      type: String,
      required: false,
      default: null
    },
    friendStatus: {
      type: Number,
      required: false,
      default: 0
    },
    showStatus: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  emits: ['closeFriendInfo', 'delTargetFriend', 'closeWindow'],
  setup(props, context) {
    const ftsInfo = ref(Object)
    const remark = ref('')
    const editText = ref('修改备注')
    const readStatus = ref(false)
    const disable = ref(false)
    // ftsId改变标志
    const changeMark = ref(true)
    const addFriendShowStatus = ref(false)

    //关闭窗口
    const closeWindow = (e) => {
      const center = document.querySelector("#friend-center")
      if (center && !center.contains(e.target)) {
        context.emit('closeFriendInfo')
      }
    }

    //可编辑显示
    const editShow = () => {
      const textTarget = document.querySelector("li > input")
      editText.value = "取消"
      readStatus.value = false
      disable.value = false
      textTarget.style.border = '1px solid deepskyblue'
    }

    //不可编辑显示
    const editHide = () => {
      const textTargets = document.querySelector("li > input")
      editText.value = "修改备注"
      readStatus.value = true
      disable.value = true
      textTargets.style.border = '1px solid transparent'
    }

    const textInvalid = (target) => {
      target.style.border = '1px solid red'
    }

    const edit = () => {
      if (editText.value === '修改备注') {
        editShow()
      } else if (editText.value === '取消') {
        remark.value = ftsInfo.value.reMark
        editHide()
      }
    }

    const setFriendStatus = (status) => {
        context.emit('setFriendStatus', status)
    }

    // 加载好友信息
    const loadFriendInfo = () => {
      if (changeMark.value === true) {
        const param = {
          ftsId: props.ftsId
        }
        getFriendInfoDetail(param).then(res => {
          switch (res.code) {
            case 1:
              nextTick(() => {
                ftsInfo.value = res.data
                remark.value = ftsInfo.value.reMark
              })
              break
            case -1:
              messageShow('error', res.msg, 1000)
              break
          }
        })
        changeMark.value = false
      }
    }

    // 初始化一个修改备注监听器
    const remarkEvent = new CustomEvent('remarkUpdate', {
      detail: {
        data: null
      }
    })

    // 初始化一个删除好友监听器
    const delFriendEvent = new CustomEvent('delFriend', {
      detail: {
        data: null
      }
    })

    // 组件销毁移除监听器
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

    // 保存好友备注修改
    const saveReMark = () => {
      const target = document.querySelector('li > input')
      if (remark.value.trim().length === 0 || remark.value.trim().length > 10) {
        textInvalid(target)
      } else {
        const params = {
          ftsId: ftsInfo.value.id,
          remark: remark.value
        }
        saveFriendReMark(params).then(res => {
          switch (res.code) {
            case 1:
              ftsInfo.value.reMark = remark.value
              remarkEvent.detail.data = {
                'ftsId': ftsInfo.value.id,
                'remark': remark.value
              }
              window.dispatchEvent(remarkEvent)
              editHide()
              break
            case -1:
              messageShow('error', res.msg, 1000)
              break
            case 0:
              messageShow('info', res.msg, 1000)
              remark.value = ftsInfo.value.reMark
              editHide()
              context.emit('setFriendStatus', 0)
          }
        })
      }
    }

    const delSuccess = (type, msg) => {
      messageShow(type, msg, 1000)
      context.emit('setFriendStatus', 0)
    }

    // 删除好友
    const deleteFriend = (id) => {
      var r = confirm("您确认要删除好友吗!")
      if (r === true) {
        const params = {
          ftsId: id
        }
        deleteFaFriend(params).then(res => {
          switch (res.code) {
            case 1:
              delSuccess('success', '成功删除')
              delFriendEvent.detail.data = {
                'ftsId': id
              }
              window.dispatchEvent(delFriendEvent)
              break
            case -1:
              messageShow('error', res.msg, 1000)
              break
            case 0:
              delSuccess('info', res.msg)
              delFriendEvent.detail.data = {
                'ftsId': id
              }
              window.dispatchEvent(delFriendEvent)
          }
        })
      }
    }

    const showAddFriendBlock = () => {
      addFriendShowStatus.value = true
    }

    const closeAddFriendWindow = () => {
      addFriendShowStatus.value = false
    }

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
      ftsInfo,
      closeWindow,
      remark,
      deleteFriend,
      saveReMark,
      editText,
      readStatus,
      disable,
      editHide,
      editShow,
      edit,
      loadFriendInfo,
      addFriendShowStatus,
      showAddFriendBlock,
      closeAddFriendWindow,
      setFriendStatus
    }
  }
}
</script>

<style scoped>
#fa-friend-block {
  position: absolute;
  z-index: 1009;
  display: -webkit-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

#friend-box {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

#friend-center {
  width: 650px;
  height: 450px;
  background-color: white;
  text-align: center;
  border-radius: 10px;
}

#friend-head {
  width: 650px;
  height: 100px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: 5px 0
}

#img-block {
  width: 100px;
  height: 100px;
  text-align: center;
  display: block;
  position: relative;
}

#friend-detail {
  display: flex;
  justify-content: center;
  width: 650px;
  height: 250px;
}

img {
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

ul {
  display: block;
  width: 600px;
  height: 250px;
  list-style: none;
  margin: 0 0 0 15px;
}

li {
  display: inline-block;
  text-align: left;
  width: 280px;
  height: 20px;
  margin: 7px 0;
  vertical-align: middle;
}

li span:first-child {
  display: inline-block;
  vertical-align: middle;
  width: 64px;
  text-align: justify;
  text-align-last: justify;
  padding: 0;
}

li span:last-child {
  display: inline-block;
  vertical-align: middle;
  width: 190px;
  overflow: hidden;
}

.add-button {
  margin: 20px 0;
}

input {
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  outline: none;
  height: 25px;
  border-radius: 5px;
}

button {
  width: 100px;
  height: 30px;
  line-height: 20px;
  border: transparent;
  border-radius: 20px;
  font-size: 15px;
  font-family: '微软雅黑', "宋体", "Arial Narrow", Helvetica, sans-serif;
  cursor: pointer;
  color: white;
  background-color: dodgerblue;
  margin: 0 30px;
}

button:last-child {
  background-color: red;
}
</style>