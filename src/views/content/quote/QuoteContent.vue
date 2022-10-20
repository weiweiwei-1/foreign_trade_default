<template>
    <div id="quote-block">
        <div id="blank-content"><span id="quote-show" @click="quoteShowStatus=!quoteShowStatus">...</span><span id="fts-info-show" @click="ftsInfoShowStatus=!ftsInfoShowStatus">...</span></div>
        <div id="chat-content">
            <quote-detail :quoteShowStatus="quoteShowStatus" @closeQuoteShow="closeQuoteShow" :productId="productId"></quote-detail>
            <fts-info :ftsInfoShowStatus="ftsInfoShowStatus" @closeFtsInfoShow="closeFtsInfoShow" :productId="productId"></fts-info>
            <chat-detail :productId="productId"></chat-detail>
        </div>
        <!--显示内容为：{{$route.params.productId}}-->
    </div>
</template>
<script>
    import QuoteDetail from 'views/content/quote/QuoteDetail.vue'
    import FtsInfo from 'views/content/quote/FtsInfo.vue'
    import ChatDetail from 'views/content/message/ChatDetail.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { ref, watch } from 'vue'
    import { getQuoteDetail } from "network/quote"
    export default {
        name: "QuoteContent",
        components: {
            QuoteDetail,
            FtsInfo,
            ChatDetail
        },
        setup() {
            const router = useRouter();
            const route = useRoute();
            const quoteShowStatus = ref(false);
            const ftsInfoShowStatus = ref(false);
            const productId = ref(null);
            console.log(router.currentRoute.value.params.productId);
            const closeQuoteShow = () => {
                quoteShowStatus.value = false;
            }
            const closeFtsInfoShow = () => {
                ftsInfoShowStatus.value = false;
            }

            /*/!*由于消息详情组件复用，因此消息详情组件会接收到productId或者senderId的属性，传递deliverInfo对象
            其中deliverMessageType为传递类型，消息详情组件会判断传递类型，进而根据该类型选择后台请求消息的方式，
            data为传递的具体数据*!/
            const deliverInfo = {
                deliverMessageType: 'productId',
                data: productId.value
            }*/

            //检测到路由传值改变，新productId赋给旧productId
            function routerChange(data) {
                if (productId !== data) {
                    /*console.log("data改变，值为" + data);
                    console.log("productId当前值为：" + productId.value);*/
                    productId.value = data
                }
            }

            watch(
                ()=>route.params.productId,
                (val,preVal)=>{
                    //val为修改后的值,preVal为修改前的值
                    console.log('现在的值' + val);
                    routerChange(val);
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
                quoteShowStatus,
                ftsInfoShowStatus,
                productId,
                closeQuoteShow,
                closeFtsInfoShow,
            }
        }
    }
</script>

<style scoped>
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