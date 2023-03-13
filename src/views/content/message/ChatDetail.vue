<template>
    <div id="chat-quote-block">
        <div id="chat-block">
            <!--这是详细聊天背景，哈哈哈哈-->
            <div class="main-chat">
                <div class="main-msg-box-wrapper">
                    <div class="msg-items">
                        <div class="msg-area" v-for="item in messageList">
                            <div class="chat-item">
                                <div v-if="item.senderId !== faMsgInfo.faId" class="chat-profile-info" >
                                <span class="profile-wrp">
                                    <span class="name-clearfix">
                                        <span class="user-name">{{ftsMsgInfo.name}}</span><span class="msg-time">{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD HH:MM:SS") }}</span>
                                    </span>
                                </span>
                                </div>
                                <div v-else class="chat-profile-info chat-profile-right" >
                                <span class="profile-wrp profile-wrp-right">
                                    <span class="name-clearfix name-clearfix-right">
                                        <span class="user-name">{{faMsgInfo.name}}</span><span class="msg-time">{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD HH:MM:SS") }}</span>
                                    </span>
                                </span>
                                </div>
                                <div  v-if="item.senderId !== faMsgInfo.faId" class="content-area">
                                    <div class="avatar">
                                        <img :src="$ftsImageUrl + ftsMsgInfo.photo" alt="">
                                    </div>
                                    <div class="msg-bubble-box">
                                        <div class="msg-bubble">
                                            <pre>{{item.content}}</pre>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="content-area content-area-right">
                                    <div class="avatar avatar-right">
                                        <img :src="$faImageUrl + faMsgInfo.photo" alt="">
                                    </div>
                                    <div class="msg-bubble-box">
                                        <div class="msg-bubble">
                                            <pre>{{item.content}}</pre>
                                        </div>
                                        <div class="msg-read-status" v-if="item.status === '1'">
                                            未读
                                        </div>
                                        <div class="msg-read-status" v-else>
                                            已读
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <textarea v-model="msgContent"></textarea>
                    </div>
                </div>
                <div class="action-area" @click="sendMsg">
                    发送
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, watch, onMounted, onUnmounted, nextTick, getCurrentInstance, router } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { ElMessage } from 'element-plus'
    import { getMsgListByPid, getMessageContentBySenderId, getFtsMessageInfoByPid, getFtsMessageInfoBySenderId, getFtsInfo, getFaInfo, readAllMessages } from 'network/message'
    import moment from 'moment'
    import { initWebsocket } from "@/utils/websocket";
    export default {
        name: "ChatDetail2",
        props: {
            productId: {
                type: Number,
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
            const messageList = ref(Object);
            const faMsgInfo = ref(null);
            const ftsMsgInfo = ref(null);
            const msgContent = ref('');
            const router = useRouter();
            // 将最新消息直接定位到最底部
            function slideToBottom() {
                const wrapper = document.querySelector('.main-msg-box-wrapper');
                wrapper.scrollTop = wrapper.scrollHeight;
            }
            var startTime = moment().format('YYYY-MM-DD HH:mm:ss');
            var endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            var lockReconnect = false;//避免重复连接
            var circleLock = false; //避免重复循环计算
            const wsUrl = proxy.$wsUrl;
            var ws;
            var tt;
            var cl;
            const connectStatus = ref(false);
            // 传递连接状态到父组件
            function deliverConStus(status) {
                context.emit("connectStatus", status)
            }
            function sendPing() {
                var pingMsg = {
                    messageType: 'ping'
                };
                ws.send(JSON.stringify(pingMsg));
            }

            function handleMessage(messageContent) {
                // connectStatus.value = true;
                deliverConStus(true);
                var obj = JSON.parse(messageContent);
                switch (obj.messageType) {
                    case 'pang':
                        try {
                            setTimeout(function () {
                                sendPing();
                                startTime = moment().format('YYYY-MM-DD HH:mm:ss');
                            }, 4000);
                            clearTimeout(tt);
                        } catch (e) {
                            reconnect(wsUrl)
                        }
                        break;
                    case 'sendMessage':
                        console.log('接收到发送的消息');
                }
            }

            function createWebSocket() {
                try {
                    ws = new WebSocket(wsUrl);
                    init();
                } catch(e) {
                    reconnect(wsUrl);
                }
            }

            function reconnect(url) {
                if(lockReconnect) {
                    return;
                }
                deliverConStus(false);
                lockReconnect = true;
                //没连接上会一直重连，设置延迟避免请求过多
                tt && clearTimeout(tt);
                tt = setTimeout(function () {
                    createWebSocket(url);
                    lockReconnect = false;
                }, 4000);
            }

            function checkMessageTimeout() {
                if (circleLock) {
                    return;
                }
                circleLock = true;
                cl && clearInterval(cl);
                cl = setInterval(function () {
                    endTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    const timeDiffer = moment(endTime).diff(startTime);
                    // 13 = 4 + 4 + 5，每隔4S检测一次，极限情况下超时5s未收到消息，则判断websocket已断开，需进行重连
                    if (timeDiffer / 1000 >= 13) {
                        reconnect(wsUrl);
                    }
                }, 4000)
            }

            function init() {
                ws.onclose = function () {

                    reconnect(wsUrl);
                };
                ws.onerror = function() {
                    reconnect(wsUrl);
                };
                ws.onopen = function () {
                    sendPing();
                    startTime = moment().format('YYYY-MM-DD HH:mm:ss');
                };
                ws.onmessage = function (event) {
                    //拿到任何消息都说明当前连接是正常的
                    // connectStatus.value = true;
                    deliverConStus(true);
                    console.log('接收到的消息是：' + event.data);
                    handleMessage(event.data);
                };
            }
            function closeWebSocket() {
                ws.close();
                lockReconnect = true;
                clearTimeout(tt);
                circleLock = true;
                clearInterval(cl);
            }
            createWebSocket();
            checkMessageTimeout();
            onUnmounted(() => {
                // 组件销毁，加锁，同时清除定时器
                closeWebSocket()
            });

            router.afterEach( function () {
                closeWebSocket()
            })

            onMounted(() => {
                getFaInfo().then(res => {
                    switch (res.code) {
                        case 1:
                            faMsgInfo.value = res.data;
                            break;
                        case -1:
                            alert(res.msg);
                            break;
                    }
                })
            });

            const sendMsg =() => {
                if (msgContent.value.trim().length >= 1000) {
                    alert('输入内容长度不能大于1000')
                } else {
                    const message = {
                        "receiverId": props.faId,
                        "content": msgContent.value,
                        "messageType": "sendMsg"
                    }
                    ws.send(JSON.stringify(message))
                }

            }

            //消息更新逻辑
            function messageChange(changeType) {
                switch (changeType) {
                    // 改变类型是productId，通过productId查询改变消息内容
                    case 'productId':
                        const pidParam = {
                            productId: props.productId
                        }
                        getMsgListByPid(pidParam).then(res => {
                            messageList.value = res.data;
                            nextTick(() => {
                                slideToBottom();
                            })
                        }).catch(err => {

                        })

                        break;
                    // 改变类型是senderId，通过senderId查询改变消息内容
                    case 'senderId':
                        const senderIdParam = {
                            senderId: props.ftsId
                        };
                        getMessageContentBySenderId(senderIdParam).then(res => {
                            messageList.value = res.data;
                            nextTick(() => {
                                slideToBottom();
                            })
                        }).catch(err => {
                            alert(res.msg)
                        });
                        if (props.unReadMsgCount > 0) {
                            console.log('读消息')
                            readAllMessages(senderIdParam).then(res => {
                                switch (res.code) {
                                    case 1:
                                        console.log('返回');
                                        context.emit('resetUnreadMsgCount', props.ftsId);
                                        break;
                                    case -1: alert('error'); break;
                                }
                            }).catch(err => {

                            })
                        }
                        break
                }
            }

            watch(
                ()=>props.productId,
                (val,preVal)=>{
                    if (val !== null && val !== undefined) {
                        const param = {
                            productId: val
                        }
                        getFtsMessageInfoByPid(param).then(res => {
                            if (res.data !== null) {
                                ftsMsgInfo.value = res.data;
                                messageChange('productId')
                            }
                        }).catch(err => {
                            alert(err)
                        })
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
                        const param = {
                            senderId: val
                        }
                        getFtsMessageInfoBySenderId(param).then(res => {
                            if (res.data !== null) {
                                ftsMsgInfo.value = res.data;
                                messageChange('senderId')
                            }
                        }).catch(err => {
                            alert(err)
                        })
                    }
                },
                {
                    immediate:true,
                    deep:true,
                }
            )
            return {
                messageList,
                ftsMsgInfo,
                faMsgInfo,
                connectStatus,
                msgContent,
                sendMsg
            }
        }
    }
</script>

<style scoped>
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
        /*background: deepskyblue;*/
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

    /*下面是右边显示的定义属性*/
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
    }

</style>