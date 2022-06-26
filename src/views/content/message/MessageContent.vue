<template>
    <div id="message-content">
        <!--<router-view></router-view>-->
        非空白消息内容对象id显示+{{$route.params.ftsid}}
    </div>
</template>

<script>
    export default {
        name: "MessageContent",
        // props: ['ftsid']
    }
</script>

<style scoped>
    #message-content {
        width: 740px;
        height: 530px;
        background: forestgreen;
    }
</style>