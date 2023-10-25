<template>
  <div id="main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "MyMain"
}
</script>

<style scoped>
#main {
  float: left;
  width: 1000px;
  height: 550px;
  background: #FFF;
  border-bottom: 1px solid #f2f2f2;
}
</style>