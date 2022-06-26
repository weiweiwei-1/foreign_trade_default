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
        height: 100%;
        width: 100%;
        text-align: center;
        color: #2c3e50;
        .router-link-active{
            color:white;
        }
    }

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: var(--color-high-text);
        }
    }

</style>
