<template>
  <div id="quote-content-default">
    <div id="quote-block" v-if="quoteContentShow">
      <div id="blank-content">
        <span id="quote-show" @click="quoteShow">...</span>
        <p v-if="connectStatus === 1">通信中</p>
        <p v-else-if="connectStatus === 0">连接中</p>
        <p v-else>连接已断开</p>
        <span id="fts-info-show" @click="ftsInfoShow">...</span>
      </div>
      <div id="chat-content">
        <quote-detail :quoteShowStatus="quoteShowStatus" @closeQuoteShow="closeQuoteShow"
                      :productId="productId" :ftsId="ftsId" ref="quoteChild"></quote-detail>
        <fts-info :ftsInfoShowStatus="ftsInfoShowStatus" @closeFtsInfoShow="closeFtsInfoShow" :ftsId="ftsId"
                  ref="ftsInfoChild"></fts-info>
        <chat-detail :ftsId="ftsId"></chat-detail>
      </div>
    </div>
  </div>
</template>

<script>
import QuoteDetail from 'views/content/quote/QuoteDetail.vue'
import FtsInfo from 'views/content/quote/FtsInfo.vue'
import ChatDetail from 'views/content/message/ChatDetail.vue'

import {ref, watch} from 'vue'
import store from "@/store"

export default {
  name: "QuoteContentDefault",

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
    }
  },

  components: {
    QuoteDetail,
    FtsInfo,
    ChatDetail,
  },
  setup(props, context) {
    const quoteShowStatus = ref(false)
    const quoteContentShow = ref(false)
    const ftsInfoShowStatus = ref(false)
    const connectStatus = ref(0)
    const productId = ref(null)
    const quoteChild = ref(null)
    const ftsInfoChild = ref(null)
    const closeQuoteShow = () => {
      quoteShowStatus.value = false;
    }

    const closeFtsInfoShow = () => {
      ftsInfoShowStatus.value = false;
    }

    const quoteShow = () => {
      quoteShowStatus.value = !quoteShowStatus.value
      quoteChild.value.showQuoteDetail()
    }

    const ftsInfoShow = () => {
      ftsInfoShowStatus.value = !ftsInfoShowStatus.value
      ftsInfoChild.value.showFtsInfo()
    }

    watch(
        () => props.productId,
        (val, preVal) => {
          if (val !== null && val !== undefined) {
            productId.value = val;
            quoteContentShow.value = true
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    watch(
        () => store.state.connectStatus,
        (val, preVal) => {
          if (val !== undefined) {
            connectStatus.value = val;
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )
    return {
      quoteContentShow,
      closeQuoteShow,
      closeFtsInfoShow,
      connectStatus,
      quoteShowStatus,
      ftsInfoShowStatus,
      quoteShow,
      ftsInfoShow,
      quoteChild,
      ftsInfoChild
    }
  }
}
</script>

<style scoped>
#quote-content-default {
  width: 750px;
  height: 550px;
  background: white;
  border: 0.5px solid #e6e5e6;
  border-left: transparent;
}

#quote-block {
  width: 750px;
  height: 550px;
}

#blank-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 45px;
  background: white;
}

span {
  display: inline-block;
  width: 40px;
  height: 20px;
  line-height: 8px;
  font-size: 30px;
  cursor: pointer;
}

#chat-content {
  display: -webkit-box;
}
</style>