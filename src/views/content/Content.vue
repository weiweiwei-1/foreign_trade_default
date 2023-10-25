<template>
  <div id="content">
    <left-menu></left-menu>
    <my-main></my-main>
    <side-bar></side-bar>
  </div>
</template>

<script>
import LeftMenu from 'views/content/LeftMenu.vue'
import MyMain from 'views/content/MyMain.vue'
import SideBar from 'views/content/SideBar.vue'

export default {
  name: "Content",
  components: {
    LeftMenu,
    MyMain,
    SideBar
  }
}
</script>

<style scoped>
#content {
  display: -webkit-box;
  -webkit-box-flex: 1;
  -webkit-box-orient: horizontal;
  width: 1366px;
  height: 550px;
  top: 0;
}
</style>