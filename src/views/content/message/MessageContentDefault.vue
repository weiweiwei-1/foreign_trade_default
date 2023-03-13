<template>
    <div id="fts-message-content-default">
        <div id="quote-block" v-if="messageContentShow">
            <div id="blank-content"><span id="quote-show">...</span><p v-if="connectStus">通信中</p><p v-else>断开重连中</p><span id="fts-info-show">...</span></div>
            <chat-detail :productId="productId" :ftsId="ftsId" :unReadMsgCount="unReadMsgCount" @resetUnreadMsgCount="resetUnreadMsgCount" @connectStatus="connectStatus"></chat-detail>
            <!--<div id="chat-quote-block">-->
                <!--<div id="chat-block">-->
                    <!--&lt;!&ndash;这是详细聊天背景，哈哈哈哈&ndash;&gt;-->
                    <!--<div class="main-chat">-->
                        <!--<div class="main-msg-box-wrapper">-->
                            <!--<div class="msg-items">-->
                                <!--<div class="msg-area" v-for="item in messageList">-->
                                    <!--<div class="chat-item">-->
                                        <!--<div v-if="item.senderId !== faMsgInfo.faId" class="chat-profile-info" >-->
                                <!--<span class="profile-wrp">-->
                                    <!--<span class="name-clearfix">-->
                                        <!--<span class="user-name">{{ftsMsgInfo.name}}</span><span class="msg-time">{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD HH:MM:SS") }}</span>-->
                                    <!--</span>-->
                                <!--</span>-->
                                        <!--</div>-->
                                        <!--<div v-else class="chat-profile-info chat-profile-right" >-->
                                <!--<span class="profile-wrp profile-wrp-right">-->
                                    <!--<span class="name-clearfix name-clearfix-right">-->
                                        <!--<span class="user-name">{{faMsgInfo.name}}</span><span class="msg-time">{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD HH:MM:SS") }}</span>-->
                                    <!--</span>-->
                                <!--</span>-->
                                        <!--</div>-->
                                        <!--<div  v-if="item.senderId !== faMsgInfo.faId" class="content-area">-->
                                            <!--<div class="avatar">-->
                                                <!--<img :src="$ftsImageUrl + ftsMsgInfo.photo" alt="">-->
                                            <!--</div>-->
                                            <!--<div class="msg-bubble-box">-->
                                                <!--<div class="msg-bubble">-->
                                                    <!--<pre>{{item.content}}</pre>-->
                                                <!--</div>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                        <!--<div v-else class="content-area content-area-right">-->
                                            <!--<div class="avatar avatar-right">-->
                                                <!--<img :src="$faImageUrl + faMsgInfo.photo" alt="">-->
                                            <!--</div>-->
                                            <!--<div class="msg-bubble-box">-->
                                                <!--<div class="msg-bubble">-->
                                                    <!--<pre>{{item.content}}</pre>-->
                                                <!--</div>-->
                                                <!--<div class="msg-read-status" v-if="item.status === '1'">-->
                                                    <!--未读-->
                                                <!--</div>-->
                                                <!--<div class="msg-read-status" v-else>-->
                                                    <!--已读-->
                                                <!--</div>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--&lt;!&ndash;主要聊天内容盒子&ndash;&gt;-->
                    <!--</div>-->
                    <!--<div class="send-msg-box-wrapper">-->
                        <!--<div class="input-area">-->
                            <!--<div class="emo-block">-->
                                <!--<img src="@/assets/images/emo.png" alt="">-->
                                <!--<img src="@/assets/images/file.png" alt="">-->
                            <!--</div>-->
                            <!--<div class="msg-box">-->
                                <!--<textarea v-model="msgContent"></textarea>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div class="action-area" @click="sendMsg">-->
                            <!--发送-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import ChatDetail from 'views/content/message/ChatDetail.vue'
    import { ref, watch, getCurrentInstance } from 'vue'
    import { getMsgListByPid, getMessageContentBySenderId, getFtsInfo, getFaInfo, readAllMessages } from 'network/message'
    import { initWebsocket } from "@/utils/websocket";
    export default {
        name: "MessageContentDefault",
        components: {
            ChatDetail
        },
        props: {
            productId: {
                type: String,
                required: false,
                default: null
            },
            ftsId: {
                type: String,
                required: false,
                default: null
            },
            unReadMsgCount: {
                type: Number,
                required: false,
                default: null
            }
        },
        setup(props, context) {
            const { proxy } = getCurrentInstance();
            const productId = ref(null);
            const ftsId = ref(null);
            const unReadMsgCount = ref(null);
            const messageContentShow = ref(false);
            const connectStus = ref(false);
            const connectStatus = (status) => {
                connectStus.value = status
            }
            function messageConShow() {
                messageContentShow.value = true
            }
            const resetUnreadMsgCount = (ftsId) => {
                context.emit('resetUnreadMsgCount', ftsId);
            }
            watch(
                ()=>props.productId,
                (val,preVal)=>{
                    if (val !== null && val !== undefined) {
                        productId.value = val
                        messageConShow()
                    }
                },
                {
                    immediate:true,
                    deep:true,
                }
            )

            watch(
                ()=>props.ftsId,
                (val,preVal)=>{
                    if (val !== null && val !== undefined) {
                        ftsId.value = val
                        messageConShow()
                    }
                },
                {
                    immediate:true,
                    deep:true,
                }
            )

            watch(
                ()=>props.unReadMsgCount,
                (val,preVal)=>{
                    if (val !== null && val !== undefined) {
                        unReadMsgCount.value = val
                    }
                },
                {
                    immediate:true,
                    deep:true,
                }
            )
            return {
                messageContentShow,
                productId,
                ftsId,
                unReadMsgCount,
                connectStatus,
                connectStus,
                resetUnreadMsgCount
            }
        }
    }
</script>

<style scoped>
    #fts-message-content-default {
        width: 750px;
        height: 528px;
        background: white;
        border: 0.5px solid #e6e5e6;
        border-left: transparent;
        position: relative;
    }

    #quote-block {
        width: 750px;
        height: 530px;
        position: absolute;
        top: 0;
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

    #blank-content span {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 8px;
        font-size: 30px;
        cursor: pointer;
    }

    /*#chat-content {
        display: -webkit-box;
        !*background: whitesmoke;*!
        !*margin: 0 0 0 10px;*!
    }

    #chat-block {
        position: absolute;
        width: 750px;
        height: 485px;
        z-index: 1000;
    }

    .main-chat {
        position: relative;
        -webkit-box-flex: 1;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        width: 750px;
        height: 390px;
        background: rgb(248, 251, 255);
    }

    .main-msg-box-wrapper {
        position: relative;
        flex: 1;
        -webkit-box-flex: 1;
        overflow: hidden;
        width: inherit;
        height: inherit;
        overflow-y: auto;
    }

    .main-msg-box-wrapper::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: rgb(248, 251, 255);
    }

    .main-msg-box-wrapper::-webkit-scrollbar-thumb {
        width: 8px;
        height: 8px;
        border-radius: 22px;
        background-color: #999;
    }

    .msg-items {
        position: absolute;
        box-sizing: border-box;
        min-height: 100%;
        min-width: 550px;
        width: 100%;
        padding: 4px 16px 16px;
    }

    .chat-item {
        margin-top: 20px;
        margin-bottom: 22px;
        border:1px solid transparent;
    }

    .chat-profile-info {
        display: flex;
        max-height: 21px;
    }

    .content-area {
        display: flex;
        flex-direction: row;
    }

    .profile-wrp {
        display: inline-flex;
        float: left;
        padding-left: 45px;
    }

    .name-clearfix, .user-name, .msg-time {
        display: inline-flex;
    }

    .user-name, .msg-time{
        margin-bottom: 4px;
        text-align: left;
        overflow: hidden;
    }

    .user-name {
        max-width: 100px;
        color: #8e97a1;
        font-size: 12px;
    }

    .msg-time {
        color: #bdbebf;
        font-size: 12px;
        margin: 0 6px;
        line-height: 21px;
        transform: scale(.9);
    }

    .avatar, .avatar img {
        width: 38px;
        height: 38px;
        !*background: deepskyblue;*!
        margin-left: 0;
        margin-right: 7px;
        cursor: pointer;
    }

    .msg-bubble-box {
        display: flex;
        flex-direction: column;
        min-width: 0;
        max-width: 500px;
    }

    .chat-item .msg-bubble {
        position: relative;
        min-height: 21px;
        float: left;
        clear: both;
        padding: 5px 11px;
        border: 1px solid #e1e0e4;
        border-radius: 6px;
        background-color: #fff;
        line-height: 1.5;
        overflow: hidden;
        width: 100%!important;
        max-width: none;
        box-sizing: border-box;
    }

    .msg-bubble {
        margin-bottom: 3px;
    }

    pre {
        text-align: left;
        max-width: 100%;
        word-break: normal;
        word-wrap: break-word;
        white-space: pre-wrap;
        color: #222;
        font-size: 14px;
        line-height: 1.3em;
        font-family: \\51AC\9752\9ED1\4F53\7B80\4F53\4E2D\6587,Tahoma,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,STHeiti,WenQuanYi Micro Hei,SimSun,sans-serif!important;
    }

    .send-msg-box-wrapper {
        position: relative;
        display: flex;
        flex-direction: row;
        border-top: 1px solid #e6e5e6;
        width: 750px;
        height: 95px;
        border-top: 1px solid #e6e5e6;
    }

    .input-area {
        width: 672px;
        height: 100%;
    }

    .emo-block {
        display: flex;
        padding: 7px 7px 7px 13px;
        width: 90%;
        justify-content: flex-start;
    }

    .emo-block img {
        width: 18px;
        height: 18px;
        margin: 0 4px;
    }

    .msg-box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        flex: 1;
        display: flex;
        padding: 0 1px 0 10px;
    }

    textarea {
        position: relative;
        width: calc(100% - 12px);
        height: calc(100% - 7px);
        resize: none;
        border: 0;
        background-color: transparent;
        flex: 1;
        box-sizing: border-box;
        padding: 6px;
        color: #222;
        font-size: 14px;
        line-height: 1.2em;
        border-radius: 3px;
        outline: 0;
    }

    .action-area {
        position: relative;
        width: 77px;
        height: 100%;
        border-left: 1px solid #e6e5e6;
        color: rgb(7, 193, 96);
        line-height: 95px;
        background-color: rgb(233, 233, 233);
    }

    img, .action-area {
        cursor: pointer;
    }

    .msg-read-status {
        text-align: left;
        font-style: italic;
        font-size: 6px;
    }

    !*下面是右边显示的定义属性*!
    .chat-profile-right {
        flex-direction: row-reverse;
    }

    .avatar-right {
        margin: 0 0 0 7px;
    }

    .profile-wrp-right {
        padding: 0 45px 0 0;
    }

    .name-clearfix-right {
        flex-direction: row-reverse;
    }

    .content-area-right {
        flex-direction: row-reverse;
        padding: 0 0 0 45px;
    }*/

</style>