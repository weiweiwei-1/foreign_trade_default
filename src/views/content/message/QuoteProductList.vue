<template>
  <div>
    <transition>
      <div id="quote-product-list" v-show="listShowStatus">
        相关报价
        <div class="list-item" v-if="quoteProductList.length === 0">
          暂无关联报价
        </div>
        <div class="list-item" v-else v-for="item in quoteProductList">
          <div class="img-block">
            <img :src="$productImageUrl + item.photo">
          </div>
          <ul>
            <li class="product-name">
              产品名:{{ item.productName }}
            </li>
            <li>
              产品重量:{{ item.weight }}kg
            </li>
            <li>
              运输路径:{{ item.origin }}->{{ item.destinationCountry }}
            </li>
            <li>
              我的报价:{{ item.price }}
            </li>
            <li>
              运输方式:{{ item.shippingWay }}
            </li>
            <li>
              运输时间:{{ item.deliverTime }}
            </li>
            <li>
              发布时间:{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD") }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {ref, onMounted, watch} from "vue"
import {getQuoteListByFtsId} from 'network/quote'
import {messageShow} from "@/config/common"

export default {
  name: "QuoteProductList",
  props: {
    ftsId: {
      type: Boolean,
      required: true,
      default: null
    },
    listShowStatus: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  setup(props, context) {
    const quoteProductList = ref([])
    const changeMark = ref(true)

    onMounted(() => {
      document.addEventListener("click", e => {
        const btnTarget = document.querySelector('#quote-show')
        const insideTarget = document.querySelector('#quote-product-list')
        if (btnTarget && !btnTarget.contains(e.target) && insideTarget && !insideTarget.contains(e.target)) {
          context.emit('closeQuoteShow')
        }
      })
    })

    const showQuoteList = () => {
      // 若changeMark为true，则从后台获取数据
      if (changeMark.value === true) {
        const param = {
          'ftsId': props.ftsId,
        }
        getQuoteListByFtsId(param).then(res => {
          if (res.code === 1) {
            quoteProductList.value = res.data
          } else {
            messageShow('error', res.msg, 1000)
          }
        })
        // 从后台获取到数据后，将changeMark置为false
        changeMark.value = false
      }
    }
    watch(
        () => props.ftsId,
        (val, preVal) => {
          // ftsId改变，changeMark变为true
          if (val !== null && val !== undefined) {
            changeMark.value = true
          }
        },
        {
          immediate: true,
          deep: true,
        }
    )

    return {
      quoteProductList,
      showQuoteList
    }
  }
}
</script>

<style scoped>
#quote-product-list {
  position: relative;
  width: 350px;
  height: 505px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1002;
  background-color: rgb(245, 245, 245);
}

.v-enter-active {
  animation: slidein 0.1s linear;
}

.v-leave-active {
  animation: slidein 0.1s linear reverse;
}

@keyframes slidein {
  from {
    transform: translateX(-100%);
    /*正数为右滑，负数为左滑*/
  }
  to {
    transform: translateX(0px);
  }
}

::-webkit-scrollbar {
  display: none;
}

.list-item {
  width: 100%;
  height: 150px;
  margin: 30px 0;
}

img {
  width: 60px;
  height: 60px;
}

li {
  display: inline-block;
  height: 20px;
  width: 170px;
  margin-right: 5px;
  text-align: left;
  font-size: 13px;
  overflow: hidden;
}

.product-name {
  width: 100%;
}
</style>