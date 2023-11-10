<template>
  <div id="friend-content-default">
    <div id="friend-block" v-if="messageContentShow">
      <div id="blank-content">
        <span id="quote-show" @click="showQuote">...</span>
        <p v-if="connectStatus === 1">通信中</p>
        <p v-else-if="connectStatus === 0">连接中</p>
        <p v-else>连接已断开</p>
        <span id="fts-info-show" @click="ftsInfoShow">...</span>
      </div>
      <div id="chat-content">
        <quote-product-list :listShowStatus="listShowStatus" @closeQuoteShow="closeQuoteShow" ref="childDom"
                            :ftsId="ftsId"></quote-product-list>
        <chat-detail :ftsId="ftsId"></chat-detail>
        <fts-info :ftsInfoShowStatus="ftsInfoShowStatus" @closeFtsInfoShow="closeFtsInfoShow" ref="ftsInfoChild"
                  :ftsId="ftsId"></fts-info>
      </div>
    </div>
  </div>

</template>

<script>
import ChatDetail from 'views/content/message/ChatDetail.vue'
import QuoteProductList from "views/content/message/QuoteProductList.vue"
import FtsInfo from 'views/content/quote/FtsInfo.vue'
import {ref, watch} from 'vue'
import store from "@/store"

export default {
  name: "FriendContentDefault",
  components: {
    ChatDetail,
    QuoteProductList,
    FtsInfo
  },
  props: {
    ftsId: {
      type: String,
      required: false,
      default: null
    },
    targetIndex: {
      type: Number,
      required: false,
      default: null
    },
  },
  setup(props, context) {

    const messageContentShow = ref(false)

    const connectStatus = ref(0)

    const listShowStatus = ref(false)

    const ftsInfoShowStatus = ref(false)

    const childDom = ref(null)

    const ftsInfoChild = ref(null)

    const showQuote = () => {
      listShowStatus.value = !listShowStatus.value
      childDom.value.showQuoteList()
    }

    const closeQuoteShow = () => {
      listShowStatus.value = false
    }

    const ftsInfoShow = () => {
      ftsInfoShowStatus.value = !ftsInfoShowStatus.value
      ftsInfoChild.value.showFtsInfo()
    }

    const closeFtsInfoShow = () => {
      ftsInfoShowStatus.value = false
    }

    watch(
        () => props.ftsId,
        (val, preVal) => {
          if (val !== null && val !== undefined) {
            messageContentShow.value = true
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
            connectStatus.value = val
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    return {
      connectStatus,
      messageContentShow,
      ftsInfoShowStatus,
      ftsInfoShow,
      closeFtsInfoShow,
      listShowStatus,
      showQuote,
      closeQuoteShow,
      childDom,
      ftsInfoChild,
    }
  }
}
</script>

<style scoped>
#friend-content-default {
  width: 750px;
  height: 550px;
  background: white;
  border: 0.5px solid #e6e5e6;
  border-left: transparent;
}

#friend-block {
  width: 750px;
  height: 530px;
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

#blank-content span {
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