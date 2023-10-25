<template>
  <div id="header">
    <my-pic></my-pic>
    <send-activity></send-activity>
    <user-information></user-information>
  </div>
</template>

<script>
import MyPic from 'views/head/advertisement/FamousStation.vue'
import SendActivity from 'views/head/sendActivity/SendActivity.vue'
import UserInformation from 'views/head/user/UserInformation.vue'

export default {
  name: "MyHeader",
  components: {
    MyPic,
    SendActivity,
    UserInformation
  }
}
</script>

<style scoped>
#header {
  display: -webkit-box;
  -webkit-box-flex: 1;
  -webkit-box-orient: horizontal;
  width: 1366px;
  height: 75px;
  background-color: hotpink;
}
</style>