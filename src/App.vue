<template>
  <home></home>
</template>
<script>
import Home from 'views/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}

</script>
<style lang="scss">
@import "assets/css/base.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  user-select: text;
}

[hidden] {
  display: none !important;
}

a {
  font-weight: bold;
  color: #2c3e50;

  &.router-link-exact-active {
    color: var(--color-high-text);
  }
}

div {
  display: block;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 22px;
  background-color: #999;
}

::-webkit-scrollbar-thumb {
  border-radius: 9px;
  background-color: #ccc;
}

::-webkit-scrollbar-track-piece {
  background-color: transparent;
}
</style>
