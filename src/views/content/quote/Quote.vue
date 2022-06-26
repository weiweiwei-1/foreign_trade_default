<template>
    <div id="quote-content">
        <quote-list></quote-list>
        <quote-detail-content></quote-detail-content>
    </div>
</template>

<script>
    import QuoteList from 'views/content/quote/QuoteList.vue'
    import QuoteDetailContent from 'views/content/quote/QuoteDetailDefault.vue'
    export default {
        name: "Quote",
        components: {
            QuoteDetailContent,
            QuoteList
        }
    }
</script>

<style scoped>
    #quote-content {
        display: flex;
        width: 990px;
        height: 530px;
    }
</style>