<template>
  <div id="permit-user-block" @click="closeWindow">
    <div id="user-box">
      <div id="permit-user-center">
        <div id="user-head">
          <div id="img-block">
            <img :src="$ftsImageUrl + ftsInfo.photo">
          </div>
        </div>
        <div id="user-detail">
          <ul>
            <li><span>昵称</span>：<span class="fixed-content">{{ ftsInfo.name }}</span></li>
            <li><span>城市</span>：<span class="fixed-content">{{ ftsInfo.city }}</span></li>
            <li><span>性别</span>：<span class="fixed-content">{{ ftsInfo.sex }}</span></li>
            <li><span>年龄</span>：<span class="fixed-content">{{ ftsInfo.age }}</span></li>
            <li><span>工作年限</span>：<span class="fixed-content">{{ ftsInfo.workingTime }}</span></li>
            <li><span>公司</span>：<span class="fixed-content">{{ ftsInfo.company }}</span></li>
            <li><span>店铺链接</span>：<span class="fixed-content">{{ ftsInfo.storeLink }}</span></li>
            <li><span>行业</span>：<span class="fixed-content">{{ ftsInfo.industry }}</span></li>
            <li><span>主要产品</span>：<span class="fixed-content">{{ ftsInfo.mainProduct }}</span></li>
            <li><span></span><span class="fixed-content"></span></li>
          </ul>
        </div>
        <div class="permit-mark">
          备注：<input type="text" class="permit-input-text" v-model="friendRemark">
        </div>
        <div class="permit-button">
          <button @click="permitApply(ftsInfo.id)" class="permit">通过申请</button>
          <button @click="rejectApply(ftsInfo.id)" class="reject">拒绝通过</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {watch, ref, nextTick} from "vue"
import {getFtsInfo, permitFriendApply, rejectFriendApply} from "network/friend"
import {delNewFriendCount, messageShow} from "@/config/common";

export default {
  name: "FtsPermitUser",
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
    }
  },
  setup(props, context) {
    const ftsInfo = ref(Object)
    const friendRemark = ref('')
    //关闭窗口
    const closeWindow = (e) => {
      const center = document.querySelector("#permit-user-center")
      if (center && !center.contains(e.target)) {
        context.emit('closeWindow')
      }
    }

    function textInvalid(target) {
      target.style.border = "1px solid red"
    }

    const permitApply = (ftsId) => {
      const inputTarget = document.querySelector('.permit-input-text')
      const param = {
        remark: friendRemark.value,
        ftsId: ftsId
      }
      if (friendRemark.value.trim().length === 0 || friendRemark.value.trim().length > 10) {
        textInvalid(inputTarget)
      } else {
        permitFriendApply(param).then(res => {
          switch (res.code) {
            case 1:
              messageShow('success', '已成功添加好友', 1000)
              delNewFriendCount()
              context.emit('closeWindow', props.targetIndex)
              break
            case -1:
              messageShow('error', res.msg, 1000)
          }
        })
      }
    }

    const rejectApply = (ftsId) => {
      var r = confirm("您确认要拒绝好友申请吗!")
      if (r === true) {
        const param = {
          ftsId: ftsId
        }
        rejectFriendApply(param).then(res => {
          switch (res.code) {
            case 1:
              context.emit('closeWindow', props.targetIndex)
              messageShow('success', '已成功拒绝申请', 1000)
              delNewFriendCount()
              break
            case -1:
              messageShow('error', res.msg, 1000)
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
                    friendRemark.value = ftsInfo.value.name
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
      ftsInfo,
      closeWindow,
      permitApply,
      rejectApply,
      friendRemark
    }
  }
}
</script>

<style scoped>
#permit-user-block {
  /*position: fixed;*/
  position: absolute;
  z-index: 1007;
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

#permit-user-center {
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

.permit-mark {
  margin: 10px 0;
}

.permit-button {
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
  border-radius: 20px;
  font-size: 15px;
  font-family: '微软雅黑', "宋体", "Arial Narrow", Helvetica, sans-serif;
  cursor: pointer;
  color: white;
  margin: 0 30px;
}

.permit {
  background-color: dodgerblue;
}

.reject {
  background-color: red;
}
</style>