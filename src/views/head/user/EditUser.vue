<template>
    <div id="user-block" @click="closeUserWindow">
        <div id="user-box">>
            <div id="user-center">
                <div id="user-head">
                    <div id="img-block">
                        <input :disabled="disable" title="点击上传图片(小于5M)" type="file" @change="changeImage" class="img-file" accept="image/gif,image/jpeg,image/jpg,image/png">
                        <img :src="image">
                    </div>
                    <div class="img-edit">
                        <button class="preview" @click="showUserImg">
                            预览
                        </button>
                        <button class="delete" @click="deleteImg">
                            删除
                        </button>
                    </div>
                </div>
                <div id="user-detail">
                    <ul>
                        <li><span>账号</span>：<span class="mark"></span><span class="fixed-content">{{account}}</span></li>
                        <li><span>剩余报价</span>：<span class="mark"></span><span class="fixed-content">{{sendQuoteCount}}</span></li>
                        <li><span>名字</span>：<span class="mark">*</span><input :readonly="readStatus" type="text" v-model="name" @input="warnCancel"></li>
                        <li><span>城市</span>：<span class="mark">*</span><input :readonly="readStatus" type="text" v-model="city" @input="warnCancel"></li>
                        <li><span>公司</span>：<span class="mark">*</span><input :readonly="readStatus" type="text" v-model="company" @input="warnCancel"></li>
                        <li><span>公司官网</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="companyLink" @input="warnCancel"></li>
                        <li><span>性别</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="sex" @input="warnCancel"></li>
                        <li><span>年龄</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="age" @input="warnCancel"></li>
                        <li><span>经验(年)</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="workingTime" @input="warnCancel"></li>
                        <li><span>主营业务</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="mainBussinessScope" @input="warnCancel"></li>
                        <li><span>服务优势</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="serviceAdvantage" @input="warnCancel"></li>
                        <li><span>微信</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="weChat" @input="warnCancel"></li>
                        <li><span>手机号</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="phone" @input="warnCancel"></li>
                        <li><span>邮箱</span>：<span class="mark"></span><input :readonly="readStatus" type="text" v-model="email" @input="warnCancel"></li>
                    </ul>
                </div>
                <div id="edit-block">
                    <div id="block-content"><button @click="edit">{{editText}}</button><button @click="saveUserInfo" :disabled="disable">保存</button><button>修改密码</button><button @click="logout1">注销</button></div>
                </div>
            </div>
        </div>
    </div>
    <div id="flow-img" v-if="flowImgStatus" @click="closeFlowImg">
        <div>
            <img :src="image" alt="" id="img-preview">
        </div>

    </div>
</template>

<script>
    import { reactive, toRefs, ref, getCurrentInstance } from 'vue';
    import {editUser, getUserInfo, logout, resumeUnLogin} from "network/user-fa";
    export default {
        name: "EditUser",
        props: {

            user: {
                type: Object,
                required: true,
                default: null
            }
        },

        setup(props, context) {
            const { proxy } = getCurrentInstance();
            let imageUrl = proxy.$faImageUrl + props.user.photo;
            //用户图像url
            const image = ref(imageUrl);
            //预览图片状态
            const flowImgStatus = ref(false);
            //input输入框只读状态
            const readStatus = ref(true);
            //按钮是否生效
            const disable = ref(true);
            //编辑显示
            const editText = ref("编辑");
            //初始化新对象为父组件传递过来的值
            let newUser = toRefs(props.user);
            //用户信息
            const userInfo = reactive ({
                photo: props.user.photo,
                account: props.user.account,
                sendQuoteCount: props.user.sendQuoteCount,
                name: props.user.name,
                city: props.user.city,
                company: props.user.company,
                companyLink: props.user.companyLink,
                sex: props.user.sex,
                age: props.user.age !== null ? props.user.age : "",
                workingTime: props.user.workingTime !== null ? props.user.workingTime : "",
                mainBussinessScope: props.user.mainBussinessScope,
                serviceAdvantage: props.user.serviceAdvantage,
                weChat: props.user.weChat,
                phone: props.user.phone,
                email: props.user.email
            });

            //获取上传照片在本地的路径
            const getObjectURL = (file) => {
                var url = null ;
                // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
                if (window.createObjectURL != undefined)                 { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url ;
            };

            //替换图像
            const changeImage = (e) => {
                const imageTarget = document.querySelector("#img-block > img");
                imageTarget.style.border = "transparent";
                if (e.target.files.length !== 0) {
                    const file = e.target.files[0];
                    if (getObjectURL(file) !== null) {
                        image.value = getObjectURL(file);
                    }
                } else {
                    image.value = imageUrl;
                }
            };

            //关闭用户显示窗口
            const closeUserWindow = (e) => {
                const center = document.querySelector("#user-center");
                if (center && !center.contains(e.target)) {
                    context.emit('closeUserWindow');
                }
            };

            //预览用户图像
            const showUserImg = () => {
                flowImgStatus.value = true
            };

            //关闭预览窗口
            const closeFlowImg = (e) => {
                const image = document.querySelector("#img-preview");
                if (image && !image.contains(e.target)) {
                    flowImgStatus.value = false
                }
            };

            //删除已上传到页面的图像
            const deleteImg = () => {
                const target = document.querySelector(".img-file");
                const imageTarget = document.querySelector("#img-block > img");
                target.value = null;
                imageTarget.style.border = "transparent";
                image.value = imageUrl;
            };

            //输入框值改变，告警提示消失，边框恢复正常
            const warnCancel = (e) => {
                e.target.style.border = "1px solid deepskyblue"
            };

            //可编辑显示
            const editShow = () => {
                const textTargets = document.querySelectorAll("li > input");
                const markTargets = document.querySelectorAll(".mark");
                editText.value = "取消";
                readStatus.value = false;
                disable.value = false;
                for (let i = 0; i < textTargets.length; i++) {
                    textTargets[i].style.border = '1px solid deepskyblue';
                }
                for (let i = 0; i < markTargets.length; i++) {
                    markTargets[i].style.visibility = "visible";
                }
            };

            //不可编辑显示
            const editHide  = () => {
                const textTargets = document.querySelectorAll("li > input");
                const markTargets = document.querySelectorAll(".mark");
                editText.value = "编辑";
                readStatus.value = true;
                disable.value = true;
                for (let i = 0; i < textTargets.length; i++) {
                    textTargets[i].style.border = '1px solid transparent';
                }
                for (let i = 0; i < markTargets.length; i++) {
                    markTargets[i].style.visibility = "hidden";
                }
            };

            //输入框编辑状态，边框显示，可编辑，取消边框显示，只读状态
            const edit = () => {
                if (editText.value === '编辑') {
                    editShow()
                } else if (editText.value === '取消') {
                    image.value = imageUrl;
                    userInfo.name = newUser.name.value;
                    userInfo.city = newUser.city.value;
                    userInfo.company = newUser.company.value;
                    userInfo.companyLink = newUser.companyLink.value;
                    userInfo.sex = newUser.sex.value;
                    userInfo.age = newUser.age.value !== null ? newUser.age.value : "";
                    userInfo.workingTime = newUser.workingTime.value !== null ? newUser.workingTime.value : "";
                    userInfo.mainBussinessScope = newUser.mainBussinessScope.value;
                    userInfo.serviceAdvantage = newUser.serviceAdvantage.value;
                    userInfo.weChat = newUser.weChat.value;
                    userInfo.phone = newUser.phone.value;
                    userInfo.email = newUser.email.value;
                    editHide()
                }

            };

            //边框红提示错误
            function textInvalid(target) {
                target.style.border = "1px solid red";
            }

            //取消边框红色提示
            function textValid(target) {
                target.style.border = "1px solid deepskyblue"
            }

            const saveUserInfo = () => {
                const file = document.querySelector(".img-file").files[0];
                const formDate = new FormData;
                formDate.append("photo", file);
                formDate.append('name', userInfo.name);
                formDate.append('city', userInfo.city);
                formDate.append('company', userInfo.company);
                formDate.append('companyLink', userInfo.companyLink);
                formDate.append('sex', userInfo.sex);
                formDate.append('age', userInfo.age);
                formDate.append('workingTime', userInfo.workingTime);
                formDate.append('mainBussinessScope', userInfo.mainBussinessScope);
                formDate.append('serviceAdvantage', userInfo.serviceAdvantage);
                formDate.append('weChat', userInfo.weChat);
                formDate.append('phone', userInfo.phone);
                formDate.append('email', userInfo.email);
                editUser(formDate).then(res => {
                    const textTargets = document.querySelectorAll("li > input");
                    const imageTarget = document.querySelector("#img-block > img");
                    switch (res.code) {
                        case 1:
                            editHide();
                            getUserInfo().then(res => {
                                //从后台请求最新用户数据，更新到页面上
                                newUser = toRefs(res.data);
                                imageUrl = "http://localhost:8080/fa-image/" + res.data.photo;
                            }).catch(err => {
                                console.log(err);
                            });
                            break;
                        case 0:
                            if (res.error.photoError !== null) {
                                imageTarget.style.border = "1px solid red";
                            }
                            res.error.nameError !== null ? textInvalid(textTargets[0]) : textValid(textTargets[0]);
                            res.error.cityError !== null ? textInvalid(textTargets[1]) : textValid(textTargets[1]);
                            res.error.companyError !== null ? textInvalid(textTargets[2]) : textValid(textTargets[2]);
                            res.error.companyLinkError !== null ? textInvalid(textTargets[3]) : textValid(textTargets[3]);
                            res.error.sexError !== null ? textInvalid(textTargets[4]) : textValid(textTargets[4]);
                            res.error.ageError !== null ? textInvalid(textTargets[5]) : textValid(textTargets[5]);
                            res.error.workingTimeError !== null ? textInvalid(textTargets[6]) : textValid(textTargets[6]);
                            res.error.mainBussinessScopeError !== null ? textInvalid(textTargets[7]) : textValid(textTargets[7]);
                            res.error.serviceAdvantageError !== null ? textInvalid(textTargets[8]) : textValid(textTargets[8]);
                            res.error.weChatError !== null ? textInvalid(textTargets[9]) : textValid(textTargets[9]);
                            res.error.phoneError !== null ? textInvalid(textTargets[10]) : textValid(textTargets[10]);
                            res.error.emailError !== null ? textInvalid(textTargets[11]) : textValid(textTargets[11]);
                            break;
                        case -1: alert(res.msg); break
                    }
                }).catch(err => {
                    alert("系统错误，联系管理员");
                    console.log(err);
                })
            };

            //注销
            const logout1 = () => {
                logout().then(res => {
                    switch (res.code) {
                        case -1: alert("系统错误"); break;
                        case 1:
                            context.emit('closeUserWindow');
                            resumeUnLogin()
                    }
                }).catch(err => {
                    alert(err);
                });
            };
            return {
                closeUserWindow,
                ...toRefs(userInfo),
                changeImage,
                editText,
                image,
                flowImgStatus,
                readStatus,
                disable,
                showUserImg,
                closeFlowImg,
                deleteImg,
                edit,
                warnCancel,
                saveUserInfo,
                logout1
            }
        }

    }
</script>

<style scoped>
    #user-block {
        position: absolute;
        z-index: 1005;
        display: -webkit-box;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    #user-box {
        position: relative;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.4);
    }

    #user-center {
        width: 650px;
        height: 450px;
        background-color: white;
        text-align: center;
        border-radius: 10px;
    }

    #user-head {
        width: 650px;
        height: 100px;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        margin: 5px 0
    }

    #img-block {
        width: 100px;
        height: 100px;
        text-align: center;
        display: block;
        position: relative;
    }



    .img-file {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        outline: 0;
        cursor: pointer;
        opacity: 0;
        background: #42b983;
    }

    #img-block img {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid rgb(91,192,222);;
    }

    .img-edit {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 80px;
        height: 60px;
        align-items: center;
    }

    .preview, .delete {
        margin: 5px 0;
        color: rgb(91,192,222);
        background: 0;
        outline: 0;
        border: 1px solid rgb(91,192,222);
        text-align: center;
        font-size: 16px;
        border-radius: 12px;
        cursor: pointer;
        width: 60px
    }

    #user-detail {
        display: flex;
        justify-content: center;
        width: 650px;
        height: 250px;
    }

    ul {
        display: block;
        width: 600px;
        height: 250px;
        list-style: none;
        margin: 0 0 0 25px;
    }

    li {
        display: inline-block;
        text-align: left;
        width: 300px;
        height: 20px;
        margin: 7px 0;
        vertical-align: middle;
    }

    li span {
        display: inline-block;
        vertical-align: middle;
        width: 64px;
        text-align: justify;
        text-align-last: justify;
        padding: 0;
    }

    li input {
        display: inline-block;
        vertical-align: middle;
        width: 190px;
        height: 25px;
        border: 1px solid transparent;
        border-radius: 5px;
        padding: 0;
        outline: none;
    }

    .fixed-content {
        display: inline-block;
        width: 190px;
        height: 25px;
        text-align: left;
        text-align-last: left;
        line-height: 25px;
    }

    .mark {
        display: inline-block;
        width: 8px;
        height: 8px;
        text-align: center;
        visibility: hidden;
        color: red;
    }

    #edit-block {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 50px;
    }

    #block-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        width: 400px;
    }

    button {
        display: inline-block;
        height: 25px;
        width: 90px;
        cursor: pointer;
        background: rgb(91,192,222);
        color: white;
        border-radius: 5px;
        outline: 0;
        border: 0;
    }

    #flow-img {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        z-index: 1007;
        background: rgba(0,0,0,0.4);
    }

    #flow-img img {
        width: 600px;
        height: 600px;
        background-color: #fff;
        border-radius: 15px;
    }

</style>