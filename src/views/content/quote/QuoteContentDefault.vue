<template>
    <div id="quote-content-default">
        <div id="quote-block" v-show="quoteContentShow">
            <div id="blank-content"><span id="quote-show" @click="quoteShowStatus=!quoteShowStatus">...</span><span id="fts-info-show" @click="ftsInfoShowStatus=!ftsInfoShowStatus">...</span></div>
            <div id="chat-content">
                <quote-detail :quoteShowStatus="quoteShowStatus" @closeQuoteShow="closeQuoteShow" :productId="productId"></quote-detail>
                <fts-info :ftsInfoShowStatus="ftsInfoShowStatus" @closeFtsInfoShow="closeFtsInfoShow" :productId="productId"></fts-info>
                <chat-detail :productId="productId" @resetUnreadMsgCount="resetUnreadMsgCount"></chat-detail>
            </div>
        </div>
    </div>
</template>

<script>
    import QuoteDetail from 'views/content/quote/QuoteDetail.vue'
    import FtsInfo from 'views/content/quote/FtsInfo.vue'
    import ChatDetail from 'views/content/message/ChatDetail.vue'
    import { useRouter } from 'vue-router'
    import { ref, watch } from 'vue'
    import { getQuoteDetail } from "network/quote"
    export default {
        name: "QuoteContentDefault",

        props: {
            productId: {
                type: Number,
                required: false,
                default: null
            }
        },

        components: {
            QuoteDetail,
            FtsInfo,
            ChatDetail,
        },
        setup(props, context) {
            const router = useRouter();
            const quoteShowStatus = ref(false);
            const quoteContentShow = ref(false);
            const ftsInfoShowStatus = ref(false);
            const productId = ref(null);
            console.log(router.currentRoute.value.params.productId);
            const closeQuoteShow = () => {
                quoteShowStatus.value = false;
            }
            const closeFtsInfoShow = () => {
                ftsInfoShowStatus.value = false;
            }

            const resetUnreadMsgCount = (senderId) => {
                context.emit('resetUnreadMsgCount', senderId);
            }

            watch(
                ()=>props.productId,
                (val,preVal)=>{
                    //val为修改后的值,preVal为修改前的值
                    if (val !== null && val !== undefined) {
                        productId.value = val;
                        quoteContentShow.value = true
                    }
                },
                {
                    //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
                    //那么首次执行，val为默认值,preVal为undefined
                    immediate:true,
                    //这个参数代表监听对象时，可以监听深度嵌套的对象属性
                    //比如user是一个对象的话，可以监听到user.a.b.c，也就是user下的所有属性
                    deep:true,
                }
            )
            return {
                quoteContentShow,
                closeQuoteShow,
                closeFtsInfoShow,
                resetUnreadMsgCount,
                quoteShowStatus,
                ftsInfoShowStatus
            }
        }
    }
</script>

<style scoped>
    #quote-content-default {
        width: 750px;
        height: 528px;
        background: white;
        border: 0.5px solid #e6e5e6;
        border-left: transparent;
        position: relative;
        /*!*width: 750px;*/
        /*height: 528px;*/
        /*background: white;*/
        /*border: 0.5px solid #e6e5e6;*/
        /*border-left: transparent;*!*/
    }

    #quote-block {
        width: 750px;
        height: 530px;
        /*background: limegreen;*/
        /*border: 1px solid #e6e5e6;*/
    }

    #blank-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 45px;
        background: white;
    }

    span {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 8px;
        font-size: 30px;
        cursor: pointer;
    }

    #chat-content {
        display: -webkit-box;
        /*background: whitesmoke;*/
        /*margin: 0 0 0 10px;*/
    }
</style>