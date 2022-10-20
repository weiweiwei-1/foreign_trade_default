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
        user-select: text;
        /*.router-link-active{
            color: rgb(198, 197, 197);
        }*/
    }

    a {
        font-weight: bold;
        color: #2c3e50;

        /*&.router-link-exact-active {
            color: var(--color-high-text);
        }*/
    }

    div {
        display: block;
    }

    /*body, html {
        width: 100%;
        height: 100%;
        overflow: hidden;
        color: #222;
        font-size: 14px;
        line-height: 1.3em;
        font-family: \\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587,Tahoma,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,STHeiti,WenQuanYi Micro Hei,SimSun,sans-serif!important;
        -webkit-font-smoothing: antialiased;
        !*vertical-align: baseline;*!
    }
*/
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
