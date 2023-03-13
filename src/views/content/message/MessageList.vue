<template>
    <div class="wrapper">
        <div class="content">
            <div id="fts-msg-list">
                <slot name="message-list" v-for="(item, index) in messageList">
                        <div class="fts-msg-item" @click="changeId(item.friendId, item.unReadMessageCount)" :class="{active:showActive(item.friendId)}">
                            <div class="img-block">
                                <img :src="$ftsImageUrl + item.friendPhoto" alt="">
                            </div>
                            <div class="fts-msg-avater">
                                <div class="fts-name">{{item.friendMark}}</div>
                                <div class="fts-preview">{{item.content}}</div>
                            </div>
                            <div class="fts-msg-time">
                                <div class="send-msg-time">
                                    {{ $filters.dateFormat(item.sendTime, "YY-MM-DD") }}
                                </div>
                                <div class="unread-count" :id="item.friendId" v-show="item.unReadMessageCount !== null && item.unReadMessageCount > 0">
                                    <span class="short-text" v-if="0 < item.unReadMessageCount <= 99">{{item.unReadMessageCount}}</span>
                                    <span class="long-text" v-else>99+</span>
                                </div>
                            </div>
                        </div>
                    <!--</router-link>-->
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, onMounted, watch, nextTick } from 'vue'
    import { getMsgList } from 'network/message'

    export default {
        name: "MessageList",
        props: {
            resetMsgId: {
                type: String,
                required: false,
                default: null
            }
        },
        setup(props, context) {
            const messageList = ref(Object);
            const image = require("@/assets/images/friend.png");
            const activeId = ref('');
            onMounted(() => {
                getMsgList().then(res => {
                    switch (res.code) {
                        case 1:
                            nextTick(()=>{
                                messageList.value = res.data;
                            });
                            break;
                        case -1: alert(res.msg)
                    }
                }).catch(err => {
                    alert(err)
                });
            })

            const changeId = (ftsId, unReadMsgCount) => {
                context.emit('changeId', ftsId, unReadMsgCount);
                activeId.value = ftsId;
            }

            watch(
                ()=>props.resetMsgId,
                (val,preVal)=>{
                    if (val !== null && val !== undefined) {
                        for (var item = 0; item < messageList.value.length; item++) {
                            if (messageList.value[item].friendId === val) {
                                messageList.value[item].unReadMessageCount = 0
                            }
                        }
                    }
                },
                {
                    immediate:true,
                    deep:true,
                }
            )

            const showActive = (id) => {
                return activeId.value === id;
            };

            return {
                messageList,
                image,
                changeId,
                showActive,
            }
        }
    }
</script>

<style scoped>

    .active {
        background: rgb(230, 229, 229);
    }

    .wrapper {
        width: 250px;
        height: 530px;
        overflow: hidden;
        border: 1px solid rgb(220, 220, 220);
    }

    .content {
        width: 250px;
    }

    #fts-msg-list {
        position: relative;
        display: block;
        top: 0;
        left: 0;
        overflow: hidden;
        width: 250px;
        height: 100%;
        /*background: rgb(245,245,245);*/
        background: rgb(255, 255, 255);
    }

    .fts-msg-item {
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        height: 65px;
        cursor: pointer;
        color: #222;
        font: 14px normal iconfont;
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

    .fts-msg-avater {
        text-align: left;
        /*float: left;*/
        width: 115px;
        height: 40px;
        margin: 0 0 0 4px;
    }

    .fts-msg-avater div {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .fts-name,.fts-preview {
        width: 100%;
        height: 18px;
    }

    .fts-preview, .send-msg-time, .unread-count {
        font-size: 5px;
        color: #9C9C9C;
    }

    .fts-preview, .unread-count {
        margin: 5px 0 0 0;
    }

    .fts-msg-time {
        width: 70px;
        height: 40px;
        text-align: center;
    }

    .send-msg-time, .unread-count {
        /*color: rgb(210, 197, 185);*/
        height: 18px;
        color: rgb(190, 190, 190);
    }

    span {
        display: inline-block;
        height: 16px;
        line-height: 15px;
        border: none;
        text-align: center;
        background: rgb(247, 76, 49);
        color: white;
    }

    .short-text {
        width: 16px;
        border-radius: 50%;
    }

    .long-text {
        width: 30px;
        border-radius: 20px;
    }
</style>