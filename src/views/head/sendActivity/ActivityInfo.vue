<template>
  <div id="activity-block" @click="closeWindow">
    <div id="activity-box">
      <div id="activity-center">
        <div id="header">
          <div id="img-block">
            <input title="点击选择更换图片(小于3M),建议宽度1:1" type="file" @change="uploadImage" class="img-file"
                   accept="image/gif,image/jpeg,image/jpg,image/png">
            <img :src="image">
          </div>
          <button v-show="deleteBtnShow" class="del-img" @click="deleteImage">删除图片</button>
        </div>
        <ul>
          <li>
            <div class="info-key">关键字词:</div>
            <div class="info-value"><input type="text" v-model="keyWords" id="keyWords" @change="keyWordCheck"></div>
          </li>
          <li>
            <div class="info-key">活动描述:</div>
            <div class="info-value" id="info-content"><textarea v-model="description" id="description"
                                                                @change="descriptionCheck"></textarea></div>
          </li>
        </ul>
        <div id="send-block">
          <button @click="sendActivity">推送优惠</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, toRefs, onMounted, reactive, getCurrentInstance, nextTick} from 'vue'
import {getActivityInfo, sendActivityInfo} from "network/recommend"
import {messageShow} from "@/config/common"

export default {
  name: "ActivityInfo",
  setup(props, context) {
    const {proxy} = getCurrentInstance()
    const activityInfo = ref(Object)
    const editActivityInfo = reactive({
      photo: null,
      keyWords: null,
      description: null
    })
    const originImageUrl = ref(require('@/assets/images/upload.png'))
    const imageHeader = ref('')
    const image = ref(originImageUrl.value)
    const deleteBtnShow = ref(false)
    // 文件错误标志
    const fileErr = ref(false)
    // 关键词错误标志
    const keyWordErr = ref(false)
    // 描述错误标志
    const descriptionErr = ref(false)

    onMounted(() => {
      getActivityInfo().then(res => {
        if ((typeof res.data) !== 'undefined') {
          activityInfo.value = res.data
          editActivityInfo.photo = activityInfo.value.activityPhoto
          editActivityInfo.keyWords = activityInfo.value.keyWords
          editActivityInfo.description = activityInfo.value.description
          if (activityInfo.value.activityPhoto !== null) {
            if (activityInfo.value.mark === '1') {
              imageHeader.value = proxy.$recommendVerifyImageUrl
            } else {
              imageHeader.value = proxy.$recommendImageUrl
            }
            nextTick(() => {
              originImageUrl.value = imageHeader.value + activityInfo.value.activityPhoto
              image.value = originImageUrl.value
            })
          }
        }
      })
    })

    // 发送优惠活动信息
    const closeWindow = (e) => {
      const center = document.querySelector("#activity-center")
      if (center && !center.contains(e.target)) {
        context.emit('closeWindow')
      }
    }

    //获取上传照片在本地的路径
    const getObjectURL = (file) => {
      var url = null
      // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }

    //替换图像
    const uploadImage = (e) => {
      const imageTarget = document.querySelector("#img-block > img")
      imageTarget.style.border = "transparent"
      if (e.target.files.length !== 0) {
        const file = e.target.files[0]
        if (getObjectURL(file) !== null) {
          image.value = getObjectURL(file)
          deleteBtnShow.value = true
          if (file.size > 3 * 1024 * 1024) {
            textInvalid(imageTarget)
            fileErr.value = true
            messageShow('error', '上传图片不能大于3M', 2000)
          } else {
            textValid(imageTarget)
            fileErr.value = false
          }
        } else {
          image.value = originImageUrl.value
          fileErr.value = true
        }
      } else {
        image.value = originImageUrl.value
        deleteBtnShow.value = false
      }
    }

    // 删除图片
    const deleteImage = () => {
      const target = document.querySelector(".img-file")
      const imageTarget = document.querySelector("#img-block > img")
      target.value = null
      imageTarget.style.border = "transparent"
      image.value = originImageUrl.value
      deleteBtnShow.value = false
    }

    // 错误提示，边框变红
    const textInvalid = (target) => {
      target.style.border = "1px solid red"
    }

    // 初始化边框默认状态
    const textValid = (target) => {
      target.style.border = "1px solid deepskyblue"
    }

    //判断文件是否加载到页面，否则红框提示
    const fileJudge = (fileTarget, imageTarget, fileErr) => {
      if (fileTarget.files.length !== 0) {
        const file = fileTarget.files[0]
        if (file.size > 3 * 1024 * 1024) {
          textInvalid(imageTarget)
          fileErr.value = true
        }
      }
    }

    /**
     * target:输入框对象，input:输入框字段，err：error字段，short：最小长度，long：最大长度
     * nullStatus：是否允许为空，1为允许空，0不允许空
     * 整个函数对相关输入对象的长度进行判断，若不符合需求则做出相应的提示
     */
    const lengthJudge = (target, input, err, short, long, nullStatus) => {
      if (nullStatus === 0) {
        if (input == null || input.trim().length < short || input.trim().length > long) {
          err.value = true
          textInvalid(target)
        } else {
          err.value = false
          textValid(target)
        }
      } else if (input !== null && parseInt(input.trim().length) > 0 && (input.trim().length < short || parseInt(input.trim().length) > long)) {
        err.value = true
        textInvalid(target)
      } else {
        err.value = false
        textValid(target)
      }
    }

    // 点击发送
    const sendActivity = () => {
      const fileTarget = document.querySelector('.img-file')
      const file = document.querySelector('.img-file').files[0]
      const imageTarget = document.querySelector('#img-block > img')
      const keyWordTarget = document.querySelector('#keyWords')
      const descriptionTarget = document.querySelector('#description')
      // 若一开始的图片为空，且未加载图片文件，则标红提示
      if (activityInfo.value.activityPhoto === null) {
        console.log('活动图为：' + activityInfo.value.activityPhoto)
        if (fileTarget.files.length === 0) {
          textInvalid(imageTarget)
          console.log('空了')
          fileErr.value = true
        }
      }
      fileJudge(fileTarget, imageTarget, fileErr)
      lengthJudge(keyWordTarget, editActivityInfo.keyWords, keyWordErr, 2, 15, 0)
      lengthJudge(descriptionTarget, editActivityInfo.description, descriptionErr, 2, 100, 0)
      console.log(fileErr.value)
      console.log(keyWordErr.value)
      console.log(descriptionErr.value)
      if (!fileErr.value && !keyWordErr.value && !descriptionErr.value) {
        const formData = new FormData
        formData.append('photo', file)
        formData.append('keyWords', editActivityInfo.keyWords)
        formData.append('description', editActivityInfo.description)
        sendActivityInfo(formData).then(res => {
          switch (res.code) {
            case -1:
              messageShow('error', '系统错误', 1000)
              break
            case 0:
              messageShow('error', '出错', 1000)
              break
            case 1:
              messageShow('success', '发送成功，等待管理员审核', 1000)
              break
          }
        })
      }
    }

    // 实时检测关键词长度
    const keyWordCheck = () => {
      const keyWordTarget = document.querySelector('#keyWords')
      lengthJudge(keyWordTarget, editActivityInfo.keyWords, keyWordErr, 2, 15, 0)
    }

    // 实时检测描述内容长度
    const descriptionCheck = () => {
      const descriptionTarget = document.querySelector('#description')
      lengthJudge(descriptionTarget, editActivityInfo.description, descriptionErr, 2, 100, 0)
    }

    return {
      closeWindow,
      ...toRefs(editActivityInfo),
      image,
      uploadImage,
      deleteBtnShow,
      deleteImage,
      sendActivity,
      keyWordCheck,
      descriptionCheck
    }
  }
}
</script>

<style scoped>
#activity-block {
  /*position: fixed;*/
  position: absolute;
  z-index: 1007;
  display: -webkit-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

#activity-box {
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

#activity-center {
  width: 500px;
  height: 450px;
  background: white;
  border-radius: 10px;
}

#header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 0;
}

#header .del-img {
  position: absolute;
  cursor: pointer;
  left: 390px;
  margin: 5px 0;
  color: rgb(91, 192, 222);
  background: 0;
  outline: 0;
  border: 1px solid rgb(91, 192, 222);
  text-align: center;
  font-size: 16px;
  border-radius: 12px;
  width: 80px;
  height: 30px;
}

img {
  width: 250px;
  height: 250px;
  cursor: pointer;
}

ul, li {
  display: flex;
  flex-direction: row;
}

ul li:first-child {
  margin: 0 30px 0 0;
}

li div {
  font-size: 12px;
}

ul {
  width: 100%;
  height: 120px;
}

li {
  width: 220px;
  height: 25px;
  vertical-align: middle;
}

.info-key {
  width: 100px;
}

input, textarea {
  width: 165px;
  border: 1px solid deepskyblue;
  outline: none;
  border-radius: 3px;
}

input {
  height: 20px;
}

#img-block {
  width: 250px;
  height: 250px;
  text-align: center;
  display: block;
  position: relative;
}

.img-file {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  outline: 0;
  cursor: pointer;
  opacity: 0;
  background: #42b983;
}

textarea {
  height: 120px;
}

#info-content {
  width: 200px;
  height: 250px;
}

#send-block {
  width: 100%;
  margin: 20px 0;
}

button {
  width: 100px;
  height: 25px;
  background-color: rgb(255, 57, 24);
  cursor: pointer;
  color: white;
  border-radius: 8px;
  border: 0 transparent;
  outline: 0
}
</style>