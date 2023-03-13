<template>
    <div id="quote">
        <quote-list @changeId="changeId"></quote-list>
        <quote-content-default :productId="productId" @resetUnreadMsgCount="resetUnreadMsgCount"></quote-content-default>
    </div>
</template>

<script>
    import { ref } from "vue"
    import QuoteList from 'views/content/quote/QuoteList.vue'
    import QuoteContentDefault from 'views/content/quote/QuoteContentDefault.vue'
    export default {
        name: "Quote",
        components: {
            QuoteContentDefault,
            QuoteList
        },
        setup(props, context) {
            const productId = ref(null);
            const resetMsgId = ref(null);
            const changeId = (id) => {
                console.log('id为：' + id);
                productId.value = id
            }

            const resetUnreadMsgCount = (senderId) => {
                resetMsgId.value = senderId
            }

            return {
                changeId,
                productId,
                resetUnreadMsgCount
            }
        }
    }
</script>

<style scoped>
    #quote {
        display: flex;
        width: 1000px;
        height: 530px;
    }
</style>