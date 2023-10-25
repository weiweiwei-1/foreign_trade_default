<template>
  <div id="home">
    <my-header></my-header>
    <content></content>
    <my-footer></my-footer>
  </div>

</template>

<script>
import MyHeader from 'views/head/MyHeader.vue'
import Content from 'views/content/Content.vue'
import MyFooter from "@/views/foot/MyFooter"

export default {
  name: "Home",
  components: {
    MyHeader,
    Content,
    MyFooter
  }
}
</script>

<style scoped>
#home {
  float: none;
  width: 1366px;
  height: 680px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  border: 0.5px solid #e6e5e6;
}


</style>