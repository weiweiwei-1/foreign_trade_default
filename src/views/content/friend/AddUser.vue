<template>
  <div id="user-block" @click="closeWindow">
    <div id="user-box">
      <div id="user-center">
        <div id="user-head">
          <div id="img-block">
            <img :src="$ftsImageUrl + ftsInfo.photo">
          </div>
        </div>
        <div id="user-detail">
          <ul>
            <li><span>名字</span>：<span class="fixed-content">{{ ftsInfo.name }}</span></li>
            <li><span>城市</span>：<span class="fixed-content">{{ ftsInfo.city }}</span></li>
            <li><span>性别</span>：<span class="fixed-content">{{ ftsInfo.sex }}</span></li>
            <li><span>年龄</span>：<span class="fixed-content">{{ ftsInfo.age }}</span></li>
            <li><span>工作年限</span>：<span class="fixed-content">{{ ftsInfo.workingTime }}</span></li>
            <li><span>公司</span>：<span class="fixed-content">{{ ftsInfo.company }}</span></li>
            <li><span>官网</span>：<span class="fixed-content">{{ ftsInfo.companyLink }}</span></li>
            <li><span>主营业务</span>：<span class="fixed-content">{{ ftsInfo.mainBussinessScope }}</span></li>
            <li><span>服务优势</span>：<span class="fixed-content">{{ ftsInfo.serviceAdvantage }}</span></li>
            <li><span></span><span class="fixed-content"></span></li>
          </ul>
        </div>
        <div class="add-mark">
          我是：<input type="text" class="input-text" v-model="sendMark">
        </div>
        <div class="add-button">
          <button @click="sendApply(ftsInfo.id)">申请好友</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {watch, ref, nextTick} from "vue"
import {getFtsInfo, sendFriendApply} from "network/friend"
import {messageShow} from "@/config/common"
import store from '@/store'

export default {
  name: "AddUser",
  props: {
    ftsId: {
      type: String,
      required: false,
      default: null
    },
    targetIndex: {
      type: String,
      required: false,
      default: null
    },
    friendStatus: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props, context) {
    const ftsInfo = ref(Object)
    const sendMark = ref(store.state.userName)
    //关闭窗口
    const closeWindow = (e) => {
      const center = document.querySelector("#user-center")
      if (center && !center.contains(e.target)) {
        context.emit('closeWindow')
      }
    }

    function textInvalid(target) {
      target.style.border = "1px solid red"
    }

    function textValid(target) {
      target.style.border = "1px solid deepskyblue"
    }

    const sendApply = (ftsId) => {
      const inputTarget = document.querySelector('.input-text')
      if (sendMark.value.trim().length === 0 || sendMark.value.trim().length > 10) {
        textInvalid(inputTarget)
      } else {
        textValid(inputTarget)
        const applyInfo = {
          receiverId: ftsId,
          senderName: sendMark.value.trim()
        }
        sendFriendApply(applyInfo).then(res => {
          switch (res.code) {
            case -3:
              messageShow('error', res.msg, 1000)
              context.emit('closeWindow', props.targetIndex)
              break
            case -2:
              messageShow('info', res.msg, 1000)
              context.emit('closeWindow', props.targetIndex)
              break
            case -1:
              messageShow('error', res.msg, 1000)
              break
            case 0:
              messageShow('success', res.msg, 1000)
              context.emit('closeWindow', props.targetIndex)
              break
            case 1:
              messageShow('success', res.msg, 1000)
              context.emit('closeWindow', props.targetIndex)
              break
            case 2:
              messageShow('success', res.msg, 1000)
              context.emit('closeWindow', props.targetIndex)
          }
        })
      }
    }

    watch(
        () => props.ftsId,
        (val, preVal) => {
          if (val !== null && val !== undefined) {
            const params = {
              ftsId: val
            }
            getFtsInfo(params).then(res => {
              switch (res.code) {
                case 1:
                  nextTick(() => {
                    ftsInfo.value = res.data
                  })
                  break
                case -1:
                  messageShow('error', res.msg, 1000)
                  break
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
      closeWindow,
      ftsInfo,
      sendMark,
      sendApply
    }
  }
}
</script>

<style scoped>
#user-block {
  position: absolute !important;
  z-index: 1005;
  display: -webkit-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

#user-box {
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

#user-center {
  width: 600px;
  height: 400px;
  background-color: white;
  text-align: center;
  border-radius: 10px;
}

#user-head {
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

#user-detail {
  display: flex;
  justify-content: center;
  width: 650px;
  height: 180px;
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

.add-mark {
  margin: 10px 0;
}

.add-button {
  margin: 20px 0;
}

input {
  border: 1px solid deepskyblue;
  outline: none;
  height: 25px;
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