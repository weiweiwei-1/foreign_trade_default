<template>
    <div>
        <transition>
            <div id="quote-detail" v-show="quoteShow(productId)">
                <div id="img-block">
                    <img :src="$productImageUrl + productInfo.photo" alt="产品图">
                </div>
                <!--<div class="title">这是标题</div>-->
                <ul>
                    <li><span>产品名</span>：<span class="value">{{productInfo.productName}}</span></li>
                    <li><span>运输路径</span>：<span class="value">{{productInfo.origin}}->{{productInfo.destinationCountry}}</span></li>
                    <li><span>详细地址</span>：<span class="value">{{productInfo.destination}}</span></li>
                    <li><span>重量</span>：<span class="value">{{productInfo.weight}}kg</span></li>
                    <li><span>体积</span>：<span class="value">{{productInfo.volumn}}</span></li>
                    <li><span>带电</span>：<span class="value" v-if="productInfo.charger === '1'">是</span>
                    <span v-else>否</span></li>
                    <li><span>认证</span>：<span class="value" v-if="productInfo.certificate === '1'">有</span>
                    <span v-else>无</span></li>
                    <li><span>实单</span>：<span class="value" v-if="productInfo.realOrder === '1'">是</span>
                    <span v-else>否</span></li>
                    <li><span>发布时间</span>：<span class="value">{{productInfo.sendTime}}</span></li>
                    <li><span>剩余报价</span>：<span class="value">{{productInfo.quoteCount}}</span></li>
                    <li class="remark"><span class="remark-key">备注</span>：<span class="remark-content">{{productInfo.remark}}</span></li>
                </ul>
                <div id="quote-info">
                    <div>我的报价</div>
                    <span>报价：{{sentQuote.price}}元</span>
                    <span>方式：{{sentQuote.shippingWay}}</span>
                    <span>排仓：{{sentQuote.arrangeTime}}天</span>
                    <span>运输：{{sentQuote.deliverTime}}天</span>
                    <div style="margin: 15px 0;">{{ $filters.dateFormat(sentQuote.sendTime, "YYYY-MM-DD") }}</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { ref, watch, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { getQuoteDetail, getMyQuote } from "network/quote"
    import { ElMessage } from 'element-plus'
    export default {
        name: "QuoteDetail",
        props: {
            quoteShowStatus: {
                type: Boolean,
                required: true,
                default: false
            },
            productId: {
                type: String,
                required: true,
                default: null
            },
        },

        setup(props, context) {
            const router = useRouter();
            const route = useRoute();
            const a = ref(route.params.productId);
            const productInfo = ref(Object);
            const sentQuote = ref(Object);
            const oldProductId = ref(null);
            onMounted(() => {
                document.addEventListener("click", e => {
                    const btnTarget = document.querySelector('#quote-show');
                    const insideTarget = document.querySelector('#quote-detail');
                    if (btnTarget && !btnTarget.contains(e.target) && insideTarget && !insideTarget.contains(e.target)) {
                        context.emit('closeQuoteShow');
                    }
                });
            });

            const quoteShow = (productId) => {
                //检测到productId的值改变，重新请求后台url，获取新返回数据
                if (oldProductId.value !== productId) {
                    const param = {
                        productId: productId
                    };
                    getQuoteDetail(param).then(res => {
                        switch (res.code) {
                            case -1: ElMessage.error({
                                message: res.msg,
                                duration: 1000
                            }); break;
                            case 1: productInfo.value = res.data;
                            break;
                        }
                    }).catch(err => {
                        ElMessage.error({
                            message: err,
                            duration: 1000
                        })
                    });
                    getMyQuote(param).then(res => {
                        switch (res.code) {
                            case -1: ElMessage.error({
                                message: res.msg,
                                duration: 1000
                            }); break;
                            case 1: sentQuote.value = res.data;
                                break;
                        }
                    }).catch(err => {

                    });
                    oldProductId.value = productId
                }
                return props.quoteShowStatus
            };

            return {
                a,
                productInfo,
                sentQuote,
                quoteShow,
                oldProductId
            }
        }
    }
</script>

<style scoped>
    #quote-detail {
        position: absolute;
        width: 380px;
        height: 485px;
        background: whitesmoke;
        /*margin: 0 0 0 10px;*/
        z-index: 1002;
    }

    /*h2{
        background: orange;
        z-index: 1000;
        width: 100px;
        height: 50px;
    }
*/
    .v-enter-active{
        animation: slidein 0.1s linear;
    }
    .v-leave-active{
        animation: slidein 0.1s linear reverse;
    }
    @keyframes slidein {
        from{
            transform: translateX(-100%);
            /*正数为右滑，负数为左滑*/
        }
        to{
            transform: translateX(0px);
        }
    }

    #img-block {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
    }

    img {
        width: 100px;
    }

    .title {
        width: 100%;
        height: 20px;
        text-align: center;
        margin: 5px 0 10px 0;
    }

    ul {
        display: -webkit-box;
        width: 100%;
        height: 260px;
        /*margin: 0 0 0 10px;*/
        font: 13px/20px Arial,sans-serif;
    }

    li {
        display: inline-block;
        text-align: left;
        width: 190px;
        height: 20px;
        background: white;
        margin: 5px 0;
        vertical-align: middle;
    }

    li span {
        display: inline-block;
        width: 64px;
        vertical-align: middle;
        text-align: justify;
        -moz-text-align-last: justify;
        text-align-last: justify;
        padding: 0;
    }

    .remark {
        display: inline-block;
        width: 100%;
        height: 100px;
        /*background: deepskyblue;*/
    }

    .remark span {
        display: inline-block;
        vertical-align: top;
    }

    .remark:first-child {
        text-align: justify;
        vertical-align: top;
    }

    .remark-content {
        width: 300px;
        height: 100px;
        text-align: left;
        text-align-last: left;
        overflow: hidden;
    }

    .value {
        width: 100px;
        height: 25px;
        text-align: left;
        -moz-text-align-last: left;
        text-align-last: left;
        line-height: 25px;
        overflow: hidden;
    }

    #quote-info {
        width: 100%;
        height: 100%;
        padding: 5px;
        text-align: center;
    }

    #quote-info span {
        display: inline-block;
        width: 185px;
        height: 20px;
        text-align: left;
        font: 15px/20px Arial,sans-serif;;
        overflow: hidden;
    }

    #quote-info div {
        margin: 0 0 10px 0;
    }
</style>