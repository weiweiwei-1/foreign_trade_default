<template>
  <div class="sgs-block">
    <img src="@/assets/images/wechat.jpg" alt="">
    扫码或搜索微信号 Kingvi_Optimus 添加好友进行反馈
  </div>
</template>

<script>
export default {
  name: "FtsSuggestions",
  setup() {

  }
}
</script>

<style scoped>
.sgs-block {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 1000px;
  height: 550px;
  background-color: rgb(250, 250, 250);
  border: 0.5px solid #e6e5e6;
}

img {
  max-width: 300px;
}
</style>