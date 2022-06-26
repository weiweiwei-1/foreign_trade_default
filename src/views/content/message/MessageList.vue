<template>
    <div id="message-list">消息列表
        <message-item :messageItem="messageItem">
            <!--{{messageItem[1]}}-->
        </message-item>
    </div>
</template>

<script>
    import MessageItem from 'views/content/message/MessageItem.vue'
    export default {
        name: "MessageList",
        data() {
            return {
                messageItem: [
                    {ftsid:1},
                    {ftsid:2},
                    {ftsid:3},
                    {ftsid:4},
                    {ftsid:5},
                    {ftsid:6},
                ],
                // msg:""
            }
        },
        components: {
            MessageItem
        }
    }
</script>

<style scoped>
    #message-list {
        width:250px;
        height: 530px;
        background: deeppink;
    }
</style>