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
        width: 740px;
        height: 100%;
        background: navajowhite;
    }
</style>