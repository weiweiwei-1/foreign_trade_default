<template>
    <slot name="market">
        <router-link to="/fa/market">
            <div class="sub-menu">
                <img src="@/assets/images/market.png" alt="">
                市场
            </div>
        </router-link>
    </slot>
    <slot name="message">
        <router-link to="/fa/message">
            <div class="sub-menu">
                <img src="@/assets/images/message.png" alt="">
                消息</div>
        </router-link>
    </slot>
    <slot name="quote">
        <router-link to="/fa/quote">
            <div class="sub-menu">
                <img src="@/assets/images/quote.png" alt="">
                报价</div>
        </router-link>
    </slot>
    <slot name="friend">
        <router-link to="/fa/friend">
            <div class="sub-menu">
                <img src="@/assets/images/friend.png" alt="">
                好友</div>
        </router-link>
    </slot>
    <slot name="suggestion">
        <router-link to="/fa/suggestion">
            <div class="sub-menu">
                <img src="@/assets/images/suggestion.png" alt="">
                建议</div>
        </router-link>
    </slot>
</template>

<script>
    export default {
        name: "SubMenu"
    }
</script>

<style scoped>
    .sub-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 10px;
    }
    img {
        margin-bottom: 4px;
        width: 25px;
        height: 25px;
    }
</style>