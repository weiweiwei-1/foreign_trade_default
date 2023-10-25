<template>
  <div class="approve">
    Copyright © 2023 kingvi all rights reserved，ICP证：<a href="https://beian.miit.gov.cn/" target="_blank" style="color: #939393">粤ICP备2023039020号</a>
    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030602007919">
      <img src="@/assets/images/approve.png" alt=""/>
      <p>粤公网安备
        44030602007919号
      </p>
    </a>
  </div>
</template>

<script>
export default {
  name: "MyFooter"
}
</script>

<style scoped>
.approve {
  display: -webkit-box;
  font-size: 11px;
  color: #939393;
  width:500px;
  margin:0 auto
}

p {
  float:left;
  height:20px;
  line-height:20px;
  margin: 0 0 0 5px;
  color: #939393
}

a {
  display:inline-block;
  text-decoration:none;
  height:20px;
  line-height:20px;
}

img {
  float: left;
}
</style>