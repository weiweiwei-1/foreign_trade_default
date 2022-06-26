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
        position: relative;
        float: left;
        width: 1000px;
        height: 530px;
        background: #FFF;
    }
</style>