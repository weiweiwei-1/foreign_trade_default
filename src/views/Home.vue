<template>
    <div id="home">
        <my-header></my-header>
        <content></content>
    </div>
</template>

<script>
    import MyHeader from 'views/head/MyHeader.vue'
    import content from 'views/content/Content.vue'
    export default {
        name: "Home",
        components: {
            MyHeader,
            content
        }
    }
</script>

<style scoped>
    #home {
        float: none;
        width: 1366px;
        height: 625px;
        position: fixed;
        right: 0;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        display: -webkit-box;
        -webkit-box-orient: vertical;
    }

</style>