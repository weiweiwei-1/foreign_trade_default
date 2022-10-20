<template>
    <div class="wrapper">
        <div class="content">
            <ul id="market">
                <li class="item" v-for="(item,index) in productList" @click="openQuoteWindow(index, item)">
                    <a class="item-a" target="_self" href="#">
                        <img class="item-img" :src="$productImageUrl + item.photo" alt="">
                        <div class="item-title">
                            {{item.productName}}
                        </div>
                        <div class="item-main-info">
                            <div class="item-weight">
                                {{item.weight}}kg
                            </div>
                            <div v-if="item.realOrder === '1'" class="item-status">
                                 实单
                            </div>
                            <div v-else class="item-status" style="color: #9C9C9C">
                                非实单
                            </div>
                            <div v-if="item.charger === '1'" class="item-charge-status">
                                带电
                            </div>
                            <div v-else class="item-charge-status" style="color: rgb(224, 46, 36)">
                                不带电
                            </div>
                        </div>
                        <div class="item-launch-info">
                            {{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD") }}
                            <div class="city">
                                {{item.origin}}->{{item.destinationCountry}}
                            </div>
                        </div>
                        <div class="fts-main-info">
                            <div class="remain-quote">
                                剩余报价数:{{item.quoteCount}}
                            </div>
                            <div class="fts-company-name">
                                {{item.ftsName}}
                            </div>
                        </div>
                        <div class="item-quote">
                            <button class="quote">报价</button>
                        </div>
                    </a>
                </li>
            </ul>
            <div class="search_page_nav">
                搜索
            </div>
        </div>
    </div>
    <send-quote-window v-if="showStatus" @closeWindow="closeWindow" :productInfo="productInfo" :deleteId="deleteId" @deleteProduct="deleteProduct"></send-quote-window>
</template>

<script>
    import {ref, reactive, nextTick, onMounted} from 'vue'
    import {getHomeProductList} from "network/home";
    import BScroll from 'better-scroll';
    import SendQuoteWindow from 'views/content/market/SendQuoteWindow.vue'
    export default {
        name: "Market",

        components: {
            SendQuoteWindow
        },

        setup() {
            //根据index删除的productInfo
            const deleteId = ref(Object);
            //商品列表
            const productList = ref(Object);
            //窗口开启关闭状态
            const showStatus = ref(false);
            //产品信息
            const productInfo = reactive({
                id: "",
                ftsId: "",
                ftsName: "",
                photo: "",
                productName: "",
                origin: "",
                destinationCountry: "",
                destination: "",
                postcode: "",
                weight: "",
                volumn: "",
                timeRequirement: "",
                charger: "",
                certificate: "",
                realOrder: "",
                remark: "",
                sendTime: "",
                quoteCount: "",
                verifyStatus: "",
            });
            //显示详细的产品信息到弹出窗口
            const openQuoteWindow = (index, data) => {
                deleteId.value = index;
                productInfo.id = data.id;
                productInfo.ftsId = data.ftsId;
                productInfo.ftsName = data.ftsName;
                productInfo.photo = data.photo;
                productInfo.productName = data.productName;
                productInfo.origin = data.origin;
                productInfo.destinationCountry = data.destinationCountry;
                productInfo.destination = data.destination;
                productInfo.postcode = data.postcode;
                productInfo.weight = data.weight;
                productInfo.volumn = data.volumn;
                productInfo.timeRequirement = data.timeRequirement;
                productInfo.charger = data.charger;
                productInfo.certificate = data.certificate;
                productInfo.realOrder = data.realOrder;
                productInfo.remark = data.remark;
                productInfo.sendTime = data.sendTime;
                productInfo.quoteCount = data.quoteCount;
                productInfo.verifyStatus = data.verifyStatus;
                showStatus.value = true;
            };

            const closeWindow = () => {
                showStatus.value = false
            };

            const param = {
                currentPage: 1
            };

            let bscroll = reactive({});

            onMounted(() => {
                getHomeProductList(param).then(res => {
                    switch (res.code) {
                        case 1:
                            productList.value = res.data.beanList;
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
                        case 0:
                            if (res.error.pageCountError) {
                                alert(res.error.pageCountError); break;
                            } else {
                                alert(res.error.searchError); break;
                            }
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

            //删除list中的元素，则页面实时取消显示index对应的内容
            const deleteProduct = (index) => {
                console.log(index);
                productList.value.splice(index, 1);
            };
            return {
                deleteId,
                productList,
                showStatus,
                productInfo,
                openQuoteWindow,
                closeWindow,
                deleteProduct
            }
        }
    }
</script>

<style scoped>
    .wrapper {
        overflow: hidden;
        width: 1000px;
        height: 530px;
    }

    #market {
        display: block;
        overflow: hidden;
        position: relative;
        top: 5px;
        left: 5px;
        height: 100%;
        width: 1000px;
        /*font-size: 0;*/
        font-family: 'helvetica neue',tahoma,'hiragino sans gb',stheiti,'wenquanyi micro hei',sans-serif;
        border-top: 1px solid #f2f2f2;
        border-left: 1px solid #f2f2f2;
        list-style: none;
    }


    .item {
        width: 247px;
        height: 368px;
        margin: 0;
        box-sizing: border-box;
        display: inline-block;
        float: left;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        border-top: none;
        border-left: none;
        background: #fff;
        vertical-align: top;
        text-align: -webkit-match-parent;
    }

    #market .item:hover {
        border: 1px solid #fd3f31;
        text-decoration: none;
    }

    .item-a {
        display: inline-block;
        text-decoration: none;
        width: 245px;
        height: 366px;
        box-sizing: border-box;
        padding: 22px 20px 0;
        background: #fff;
        color: rgb(156, 156, 156);;
        position: relative;
    }

    img {
        width: 198px;
        height: 198px;
        border-radius: 8px;
    }

    .item-title {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 204px;
        height: 30px;
        line-height: 35px;
        font-size: 14px;
        font-weight: normal;
        overflow: hidden;
        font-family: iconfont;
        color: #151516;
    }

    .item-main-info, .fts-main-info, .item-launch-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 205px;
        text-align: left;
    }

    .fts-main-info {
        flex-direction: row;
        height: 20px;
    }

    .item-weight, .item-status {
        width: 68px;
        color: rgb(224, 46, 36);;
        font: 15px/25px Arial,sans-serif;
    }

    .item-weight {
        font: 18px/25px Arial,sans-serif;
        font-weight: 600;
    }

    .item-status {
        text-align: center;
    }

    .item-charge-status {
        margin: 0 0 0 30px;
        font: 10px/25px Arial,sans-serif;
        text-align: right;
    }

    .fts-main-info, .item-launch-info {
        font: 10px/20px Arial,sans-serif
    }

    .fts-main-info {
        height: 20px;
    }

    .city {
        width: 72px;
        height: 20px;
        text-align: right;
        overflow: hidden;
    }


    .remain-quote {
        width: 80px;
        height: 20px;
        overflow: hidden;
        color: #00b82f;
    }

    .fts-company-name {
        width: 72px;
        height: 20px;
        overflow: hidden;
        text-align: right;
    }

    .item-quote {
        margin: 8px 0;
    }

    .quote {
        width: 160px;
        height: 35px;
        background-color: rgb(255, 57, 24);
        cursor: pointer;
        color: white;
        font: 1.25rem Arial,Serilf;
        border-radius: 8px;
        border: 0 transparent;
        outline: 0;
    }

    .search_page_nav {
        width: 100%;
        margin: 20px auto;
        text-align: center;
        color: #4a4a4a;
        vertical-align: middle;
    }
</style>