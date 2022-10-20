<template>
    <div>
        <transition>
            <div id="fts-info" v-show="ftsInfoShow(productId)">
                <div class="image-content">
                    <img :src="$ftsImageUrl + ftsInfo.photo">
                </div>
                <div>
                    <ul>
                        <li><span class="key">昵称</span>：<span class="val">{{ftsInfo.name}}</span></li>
                        <li><span class="key">城市</span>：<span class="val">{{ftsInfo.city}}</span></li>
                        <li><span class="key">公司</span>：<span class="val">{{ftsInfo.company}}</span></li>
                        <li><span class="key">官网</span>：<span class="val">{{ftsInfo.storeLink}}</span></li>
                        <li><span class="key">行业</span>：<span class="val">{{ftsInfo.industry}}afadfa阿发大发发阿的说法阿打发阿发大水发</span></li>
                        <li><span class="key">主要产品</span>：<span class="val">{{ftsInfo.mainProduct}}</span></li>
                    </ul>
                </div>
                <div id="detail-panel">
                    更多资料>
                </div>
                <div id="friend-block" v-if="friendStatus === 0" style="border-top: none" @click="showAddFriendWindow">
                    添加好友>
                </div>
            </div>
        </transition>
        <!---->
        <add-friend v-show="addFriendShowStatus" @closeAddFriendWindow="closeAddFriendWindow" :ftsId="ftsInfo.id + ''"></add-friend>
    </div>
</template>

<script>
    import AddFriend from 'views/content/quote/AddFriend.vue'
    import { ref } from 'vue';
    import { getFtsInfo, getFriendStatus } from "network/user-fts";
    import { ElMessage } from 'element-plus'
    export default {
        name: "FtsInfo",
        components: {
            AddFriend
        },
        props: {
            ftsInfoShowStatus: {
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
            const oldProductId = ref(null);
            const ftsInfo = ref(Object);
            const friendStatus = ref(false);
            const addFriendShowStatus = ref(false);
            const ftsInfoShow = (productId) => {
                if (oldProductId.value !== productId) {
                    console.log('数值变化！！！！'+ productId);
                    const param = {
                        productId: productId
                    };
                    getFtsInfo(param).then(res => {
                        switch (res.code) {
                            case -1: ElMessage.error({
                                message: res.msg,
                                duration: 1000
                            }); break;
                            case 1: ftsInfo.value = res.data;
                                const ftsId = ftsInfo.id;
                                const param = {
                                    ftsId: ftsId
                                };
                                getFriendStatus(param).then(res => {
                                    switch (res.code) {
                                        case 1: friendStatus.value = res.data;
                                    }
                                }).catch(err => {

                                });
                                break;
                        }
                    }).catch(err => {
                        ElMessage.error({
                            message: err,
                            duration: 1000
                        })
                    });
                    oldProductId.value = productId
                }
                return props.ftsInfoShowStatus
            };

            const closeAddFriendWindow = () => {
                addFriendShowStatus.value = false;
            };

            const showAddFriendWindow = () => {
                addFriendShowStatus.value = true;
            }

            document.addEventListener("click", e => {
                const btnTarget = document.querySelector('#fts-info-show');
                const insideTarget = document.querySelector('#fts-info');
                if (btnTarget && !btnTarget.contains(e.target) && insideTarget && !insideTarget.contains(e.target)) {
                    context.emit('closeFtsInfoShow');
                }
            });

            return {
                ftsInfoShow,
                ftsInfo,
                friendStatus,
                addFriendShowStatus,
                closeAddFriendWindow,
                showAddFriendWindow
            }
        }
    }
</script>

<style scoped>
    #fts-info {
        position: absolute;
        display: flex;
        flex-direction: column;
        /*justify-content: center;*/
        align-items: center;
        right: 0;
        z-index: 1002;
        width: 250px;
        height: 485px;
        background: whitesmoke;
        font: 15px/20px Arial,sans-serif;
    }

    .v-enter-active{
        animation: slidein 0.5s linear;
    }
    .v-leave-active{
        animation: slidein 0.5s linear reverse;
    }
    @keyframes slidein {
        from{
            transform: translateX(100%);
            /*正数为右滑，负数为左滑*/
        }
        to{
            transform: translateX(0px);
        }
    }

    .image-content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 100px;
        /*background: deepskyblue;*/
        border-bottom: 1px solid lightgrey
    }

    img {
        width: 41px;
        height: 41px;
    }

    ul {
        margin: 0 0 0 10px;
    }

    li, .key, .val {
        display: inline-block;
        vertical-align: middle;
    }

    li {
        width: 100%;
        list-style: none;
        text-align: left;
        margin: 8px 0;
    }

    .key {
        width: 64px;
        height: 21px;
        text-align: justify;
        -moz-text-align-last: justify;
        text-align-last: justify;
        padding: 0;
    }

    .val {
        text-align: left;
        width: 150px;
        height: 21px;
        overflow: hidden;
    }

    #detail-panel, #friend-block {
        width: 200px;
        height: 40px;
        /*margin: 20px 0;*/
        line-height: 40px;
        border-bottom: 1px solid lightgrey;
        border-top: 1px solid lightgrey;
        cursor: pointer;
    }

    #detail-panel {
        margin: 20px 0 0 0;
    }

    #friend-block {
        border-bottom: 1px solid lightgrey;
    }
</style>