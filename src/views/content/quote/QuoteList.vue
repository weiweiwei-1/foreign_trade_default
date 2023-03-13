<template>
    <div class="wrapper">
        <div class="content">
            <div id="quote-list">
                <slot name="quote-list" v-for="item in quoteList">
                    <div class="quote-item" @click="changeId(item.id)" :class="{active:showActive(item.id)}">
                        <div class="img-block">
                            <img :src="$productImageUrl + item.photo" alt="">
                        </div>
                        <div class="product-detail">
                            <div class="product-title">{{item.productName}}</div>
                            <div class="product-main-info">
                                <div class="deliver-country">{{item.origin}}->{{item.destinationCountry}}</div>
                                <div class="product-weight">{{item.weight}}kg</div>
                            </div>
                        </div>
                        <div class="time-block">
                            <div class="send-time">{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD") }}</div>
                            <div class="price" v-if="item.realOrder === '1'">实单</div>
                            <div class="price" v-else>非实单</div>
                        </div>
                    </div>
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
        setup(props, context) {
            const quoteList = ref([]);
            let bscroll = reactive({});
            const activeId = ref(null);
            const changeId = (id) => {
                context.emit('changeId', id);
                activeId.value = id;
            }
            const showActive = (id) => {
                return activeId.value === id;
            };
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
                changeId,
                showActive,
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
        z-index: 1003;
        background: rgb(300, 300, 300);
        border: 1px solid rgb(220, 220, 220);
    }

    .content {
        width: 250px;
    }

    .active {
        background: rgb(220, 220, 220);
    }

    #quote-list {
        position: relative;
        display: block;
        top: 0;
        left: 0;
        /*z-index: 1001;*/
        overflow: hidden;
        width: 250px;
        height: 100%;
        background: rgb(245,245,245);

    }

    .quote-item {
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        height: 65px;
        cursor: pointer;
        /*border: 1px solid deepskyblue;*/
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