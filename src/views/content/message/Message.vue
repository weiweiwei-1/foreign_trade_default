<template>
    <div id="fts-message-content">
        <message-list @changeId="changeId" :resetMsgId="resetMsgId"></message-list>
        <message-content-default :ftsId="ftsId" :unReadMsgCount="unReadMsgCount" @resetUnreadMsgCount="resetUnreadMsgCount"></message-content-default>
    </div>
</template>

<script>
    import MessageList from 'views/content/message/MessageList.vue'
    import MessageContentDefault from 'views/content/message/MessageContentDefault.vue'
    import { ref, onMounted, watch } from 'vue'
    export default {
        name: "Quote",
        components: {
            MessageList,
            MessageContentDefault
        },
        setup() {
            const ftsId = ref(null);
            const unReadMsgCount = ref(null);
            const resetMsgId = ref(null);
            const changeId = (id, count) => {
                ftsId.value = id;
                unReadMsgCount.value = count;
            }

            const resetUnreadMsgCount = (senderId) => {
                resetMsgId.value = senderId
            }
            return {
                changeId,
                ftsId,
                unReadMsgCount,
                resetUnreadMsgCount,
                resetMsgId
            }
        }
    }
</script>

<style scoped>
    #fts-message-content {
        display: flex;
        width: 1000px;
        height: 530px;
    }
</style>