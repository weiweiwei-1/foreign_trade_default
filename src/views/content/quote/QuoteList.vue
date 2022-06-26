<template>
    <div class="wrapper">
        <div class="content">
            <div id="quote-list">
                <slot name="quote-list" v-for="item in quoteList">
                    <router-link :to="'/fa/quote/' + item.id">
                        <div class="quote-item">
                            <div class="img-block">
                                <img src="" alt="">
                            </div>
                            <div class="product-detail">
                                <div class="product-title">标题</div>
                                <div class="product-main-info">
                                    <div class="deliver-country">美国->中国</div>
                                    <div class="product-weight">100kg</div>
                                </div>
                            </div>
                            <div class="time-block">
                                <div class="send-time">2022-06-08</div>
                                <div class="price">实单</div>
                            </div>
                        </div>
                    </router-link>
                </slot>
            </div>
        </div>
    </div>



</template>

<script>
    import {ref, reactive, onMounted, nextTick} from "vue"
    import BScroll from 'better-scroll';
    import {getQuoteList} from "network/quote"
    export default {
        name: "QuoteList",
        setup() {
            const quoteList = ref([]);
            let bscroll = reactive({});
            onMounted(()=>{
                getQuoteList().then(res => {
                    switch (res.code) {
                        case 1: quoteList.value = res.data;
                            nextTick(() => {
                                if (!bscroll) {
                                    bscroll = new BScroll(document.querySelector('.wrapper'), {
                                        probeType: 3,
                                        scrollY: true,
                                        click: true,
                                        autoPullUpLoad: true,
                                        mouseWheel: true,
                                    })
                                } else {
                                    bscroll.refresh()
                                }
                            });
                            break;
                        case -1: alert(res.msg); break;
                    }
                }, error => {
                    console.log(error);
                });
                bscroll = new BScroll(document.querySelector('.wrapper'), {
                    probeType: 3,
                    scrollY: true,
                    click: true,
                    autoPullUpLoad: true,
                    mouseWheel: true,
                });
            });

            return {
                quoteList,
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        width: 250px;
        height: 530px;
        overflow: hidden;
    }

    #quote-list {
        position: relative;
        display: block;
        top: 0;
        left: 0;
        overflow: hidden;
        width: 250px;
        height: 100%;
        background: rgb(255,255,255);
    }

    .quote-item {
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        height: 60px;
        cursor: pointer;
        border: 1px solid deepskyblue;
    }

    .img-block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 55px;
        height: 100%;
        margin: 0 0 0 7px;
    }

    img {
        width: 41px;
        height: 41px;
    }

    .product-detail {
        width: 110px;
        height: 34px;
    }

    .product-title, .product-main-info {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 17px;
        text-align: left;
        font: italic bold 10px/17px arial,sans-serif;
        overflow: hidden;
    }

    .deliver-country, .product-weight {
        width: 55px;
        height: 100%;
    }

    .time-block {
        width: 80px;
        height: 34px;
        font: italic bold 8px/17px arial,sans-serif;
    }
</style>