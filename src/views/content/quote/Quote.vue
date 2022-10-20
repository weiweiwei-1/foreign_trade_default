<template>
    <div id="quote">
        <quote-list></quote-list>
        <quote-content-default></quote-content-default>
    </div>
</template>

<script>
    import QuoteList from 'views/content/quote/QuoteList.vue'
    import QuoteContentDefault from 'views/content/quote/QuoteContentDefault.vue'
    export default {
        name: "Quote",
        components: {
            QuoteContentDefault,
            QuoteList
        }
    }
</script>

<style scoped>
    #quote {
        display: flex;
        width: 1000px;
        height: 530px;
    }
</style>