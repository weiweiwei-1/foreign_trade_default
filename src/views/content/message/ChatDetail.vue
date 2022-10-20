<template>
    <div id="chat-block">
        <!--这是详细聊天背景，哈哈哈哈-->
        <div class="main-chat">
            <div class="main-msg-box-wrapper">
                <div class="msg-items">
                    <div class="msg-area">
                        <div class="chat-item">
                            <div class="chat-profile-info">
                            <span class="profile-wrp">
                                <span class="name-clearfix">
                                    <span class="user-name">曾庆威</span><span class="msg-time">2012-10-11</span>
                                </span>
                            </span>
                            </div>
                            <div class="content-area">
                                <div class="avatar">
                                    <img src="" alt="">
                                </div>
                                <div class="msg-bubble-box">
                                    <div class="msg-bubble">
                                        <pre>这就是这就是消息传输这就，是消息传输这就，是消息传输这，就是消息传输这就是消息传
                                            输这就是消息传输这就是消息传输这就是消息传输这就是消息传输消息传输
                                        这就是这就是消息传输这就这就是这就是消息传输这就这就是这就是消息传输这就这就是这就是消
                                        息传输这就这就是这就是消息传输这就曾庆威，这就是这就是消息传输这就这就是这就是消息传输这就这就是这就是消息传输这就这就是这
                                    曾庆威，这就是这就是消息传输这就这就是这就是消息传输这就这就是这就是消息传输这就这就是这
                                    曾庆威，这就是这就是消息传输这就这就是这就是消息传输这就这就是这就是消息传输这就这就是这</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="msg-area">
                        <div class="chat-item">
                            <div class="chat-profile-info" id="profile-right">
                            <span class="profile-wrp" id="profile-wrp-right">
                                <span class="name-clearfix" id="name-clearfix-right">
                                    <span class="user-name">花美男</span><span class="msg-time" id="msg-time-right">1022-12-12</span>
                                </span>
                            </span>
                            </div>
                            <div class="content-area" id="content-area-right">
                                <div class="avatar" id="avatar-right">
                                    <img src="" alt="">
                                </div>
                                <div class="msg-bubble-box">
                                    <div class="msg-bubble">
                                        <pre>这就是这就是消息传输这就，是消息传输这就，是消息传输这，就是消息传输这就是消息传输这就是消息传输这就是消息传输这就是消息传输这就是消息传输消息传输</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="msg-area">
                        <div class="chat-item">
                            <div class="chat-profile-info">
                            <span class="profile-wrp">
                                <span class="name-clearfix">
                                    <span class="user-name">左边显示</span><span class="msg-time"></span>
                                </span>
                            </span>
                            </div>
                            <div class="content-area">
                                <div class="avatar">
                                    <img src="" alt="">
                                </div>
                                <div class="msg-bubble-box">
                                    <div class="msg-bubble">
                                        <pre>这就是这就是消息传输这就，是消息传输这就，是消息传输这，就是消息传输这就是消息传输这就是消息传输这就是消息传输这就是消息传输这就是消息传输消息传输</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-item">第一条消息1</div>
                    <div class="chat-item">第一条消息1</div>
                    <div class="chat-item">第一条消息1</div>
                    <div class="chat-item">第一条消息1</div>
                    <div class="chat-item">第一条消息1</div>
                </div>
            </div>
            <!--主要聊天内容盒子-->
        </div>
        <div class="send-msg-box-wrapper">
            <div class="input-area">
                <div class="emo-block">
                    <img src="@/assets/images/emo.png" alt="">
                    <img src="@/assets/images/file.png" alt="">
                </div>
                <div class="msg-box">
                    <textarea></textarea>
                </div>
            </div>
            <div class="action-area">
                发送
            </div>
        </div>
    </div>
</template>

<script>
    import {ref, watch, onMounted} from 'vue'
    export default {
        name: "ChatDetail",
        props: {
            productId: {
                type: String,
                required: false,
                default: null
            },
            senderId: {
                type: String,
                required: false,
                default: null
            },
        },
        setup(props, context) {
            const oldProductId = ref(null);
            const oldSenderId = ref(null);
            const messageList = ref(Object);

            const reloadMessage = () => {
                console.log('向后台请求新的消息');
            };

            onMounted(() => {
                function slideToBottom() {
                    // 将消息直接定位到最底部
                    const wrapper = document.querySelector('.main-msg-box-wrapper');
                    wrapper.scrollTop = wrapper.scrollHeight;
                }
                if (props.productId != null) {
                    messageList.value = 1;
                    slideToBottom()
                }
                if (props.senderId != null) {
                    console.log('传值为senderId');
                    target.scrollTop = target.scrollHeight;
                }

                watch(
                    ()=>props.productId,
                    (val,preVal)=>{
                        if (val !== null || val !== undefined) {
                            messageList.value = '新productId消息';
                            console.log(messageList.value);
                            reloadMessage();
                            slideToBottom();
                        }
                    },
                    {
                        immediate:true,
                        deep:true,
                    }
                )

                watch(
                    ()=>props.senderId,
                    (val,preVal)=>{
                        if (val !== null)
                        messageList.value = '新senderId消息';
                        console.log(messageList.value);
                        reloadMessage()
                        slideToBottom()
                    },
                    {
                        immediate:true,
                        deep:true,
                    }
                )
            });
        }
    }
</script>

<style scoped>
    #chat-block {
        position: absolute;
        width: 750px;
        height: 485px;
        z-index: 1000;
        /*background-color: #ccc;*/
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
        /*overflow-y: scroll;*/
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

    /*.msg-area {
        position: absolute;
    }*/

    .chat-item {
        /*display: -webkit-box;*/
        /*position: relative;*/
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
        /*display: inline-block;*/
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
        /*margin-left: 12px;*/
        color: #bdbebf;
        font-size: 12px;
        margin: 0 6px;
        line-height: 21px;
        /*display: inline-block;*/
        transform: scale(.9);
    }

    .avatar {
        width: 38px;
        height: 38px;
        /*float: left;*/
        background: deepskyblue;
        margin-left: 0;
        margin-right: 7px;
        cursor: pointer;
    }

   /* .msg-bubble-box {
        float: left;
        flex: 1 1 auto;
        min-width: 0;
    }*/

    .msg-bubble-box {
        display: flex;
        flex-direction: row;
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
        /*width: 100%;*/
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

    img {
        width: 18px;
        height: 18px;
        margin: 0 4px;
    }

    .msg-box {
        /*position: relative;*/
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
        /*width: 100%;*/
        height: 100%;
        border-left: 1px solid #e6e5e6;
        color: rgb(7, 193, 96);
        line-height: 95px;
        background-color: rgb(233, 233, 233);
    }
    
    img, .action-area {
        cursor: pointer;
    }
    /*下面是右边显示的定义属性*/
    #profile-right {
        /*justify-content: flex-end;*/
        flex-direction: row-reverse;
    }

    #avatar-right {
        margin: 0 0 0 7px;
    }

    #profile-wrp-right {
        padding: 0 45px 0 0;
    }

    #name-clearfix-right {
        flex-direction: row-reverse;
    }

    #content-area-right {
        flex-direction: row-reverse;
        padding: 0 0 0 45px;
    }

   /* #msg-time-right {
        margin: 0 12px 0 0;
    }*/


</style>