<template>
    <div id="quote-detail-default">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "QuoteDetailDefault"
    }
</script>

<style scoped>
    #quote-detail-default {
        width: 748px;
        height: 528px;
        background: white;
        border: 0.5px solid #e6e5e6;
    }
</style>