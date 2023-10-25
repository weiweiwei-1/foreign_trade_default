<template>
  <div id="send-block">
    优惠<img src="@/assets/images/upload.png" alt="" @click="activityInfoShow">推送
  </div>
  <activity-info v-if="showStatus" @closeWindow="closeWindow"></activity-info>
</template>

<script>
import ActivityInfo from "views/head/sendActivity/ActivityInfo"
import {ref} from 'vue'

export default {
  name: "SendActivity",
  components: {
    ActivityInfo
  },
  setup(props, context) {
    const showStatus = ref(false)
    const activityInfoShow = () => {
      showStatus.value = true
    }

    const closeWindow = () => {
      showStatus.value = false
    }

    return {
      showStatus,
      activityInfoShow,
      closeWindow
    }
  }
}
</script>

<style scoped>
#send-block {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 266px;
  height: 100%;
  text-align: center;
}

img {
  width: 80px;
  height: 80px;
  cursor: pointer;
}
</style>