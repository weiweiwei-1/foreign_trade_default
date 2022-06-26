<template>
    <div id="quote-detail">
         显示内容为：{{$route.params.productId}}
    </div>
</template>
<script>
    export default {
        name: "QuoteDetail"
    }
</script>

<style scoped>
    #quote-detail {
        width: 740px;
        height: 530px;
        background: #42b983;
    }
</style>