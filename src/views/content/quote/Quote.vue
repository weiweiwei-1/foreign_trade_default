<template>
  <div id="quote">
    <quote-list @changeId="changeId"></quote-list>
    <quote-content-default :productId="productId" :ftsId="ftsId"></quote-content-default>
  </div>
</template>

<script>
import {ref} from "vue"
import QuoteList from 'views/content/quote/QuoteList.vue'
import QuoteContentDefault from 'views/content/quote/QuoteContentDefault.vue'

export default {
  name: "Quote",
  components: {
    QuoteContentDefault,
    QuoteList
  },
  setup(props, context) {
    const productId = ref(null)
    const ftsId = ref(String)
    const changeId = (id, ftsid) => {
      productId.value = id
      ftsId.value = ftsid
    }

    return {
      changeId,
      productId,
      ftsId
    }
  }
}
</script>

<style scoped>
#quote {
  display: flex;
  width: 1000px;
  height: 550px;
}
</style>