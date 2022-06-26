<template>
    <div id="message">
        <message-list></message-list>
        <blank-content></blank-content>
    </div>
</template>

<script>
    import MessageList from 'views/content/message/MessageList.vue'
    import BlankContent from 'views/content/message/BlankContent.vue'
    export default {
        name: "Message",
        components: {
            MessageList,
            BlankContent
        }
    }
</script>

<style scoped>
    #message {
        display: flex;
        width: 990px;
        height: 530px;
    }
</style>