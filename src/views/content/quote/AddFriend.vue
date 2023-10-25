<template>
  <div id="add-friend-content" @click="closeAddFriendWindow">
    <div id="add-friend-center">
      <div class="text">验证信息</div>
      <span class="text-area">我是：<input @input='markChange' v-model="senderName" class="text-input" type="text"></span>
      <button class="button-bar" @click="sendApply">发送申请</button>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import {sendFriendApply} from "network/friend"
import {messageShow} from "@/config/common";

export default {
  name: "AddFriend",
  props: {
    ftsId: {
      type: String,
      required: true,
      default: null
    },
  },
  setup(props, context) {
    const senderName = ref("")
    const closeAddFriendWindow = (e) => {
      const clickTarget = document.querySelector('#add-friend-center')
      if (clickTarget && !clickTarget.contains(e.target)) {
        context.emit('closeAddFriendWindow')
      }
    };

    function textInvalid(target) {
      target.style.border = "1px solid red"
    }

    function textValid(target) {
      target.style.border = "1px solid deepskyblue"
    }

    const markChange = () => {
      const target = document.querySelector('.text-input');
      textValid(target)
    }

    const sendApply = () => {
      const inputTarget = document.querySelector(".text-input");
      if (senderName.value.trim().length === 0 || senderName.value.trim().length > 10) {
        textInvalid(inputTarget);
      } else {
        textValid(inputTarget);
        const applyInfo = {
          receiverId: props.ftsId,
          senderName: senderName.value.trim()
        };
        sendFriendApply(applyInfo).then(res => {
          switch (res.code) {
            case -1:
              messageShow('error', res.msg, 1000)
              break;
            case 0:
              messageShow('warning', res.msg, 1000)
              break;
            case 1:
              context.emit('closeAddFriendWindow');
              messageShow('success', "申请成功，等待好友通过", 1000)
              break;
          }
        })
      }
    }

    return {
      closeAddFriendWindow,
      sendApply,
      senderName,
      markChange
    }
  }
}
</script>

<style scoped>
#add-friend-content {
  /*position: fixed;*/
  position: absolute;
  z-index: 1013;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
}

#add-friend-center {
  width: 300px;
  height: 200px;
  background: whitesmoke;
  border-radius: 5px;
}

.text, .text-area, .button-bar {
  display: inline-block;
}

.text {
  margin: 5px 0 10px 0;
}

.text-area {
  margin: 15px 0;
}

.text-input {
  border: 1px solid deepskyblue;
  outline: none;
  height: 25px;
  border-radius: 5px;
}

.button-bar {
  margin: 20px 0;
  width: 80px;
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