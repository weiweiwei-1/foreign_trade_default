<template>
  <div class="wrapper">
    <div class="content">
      <div id="quote-list">
        <slot name="quote-list" v-for="item in quoteList">
          <div class="quote-item" @click="changeId(item.id, item.ftsId)" :class="{active:showActive(item.id)}">
            <div class="img-block">
              <img :src="$productImageUrl + item.photo" alt="">
            </div>
            <div class="product-detail">
              <div class="product-title">{{ item.productName }}</div>
              <div class="product-main-info">
                <div class="deliver-country">{{ item.origin }}->{{ item.destinationCountry }}</div>
                <div class="product-weight">{{ item.weight }}kg</div>
              </div>
            </div>
            <div class="time-block">
              <div class="send-time">{{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD") }}</div>
              <div class="price" v-if="item.realOrder === '1'">实单</div>
              <div class="price" v-else>非实单</div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, nextTick} from "vue"
import {getQuoteList} from "network/quote"
import {messageShow} from "@/config/common";

export default {
  name: "QuoteList",
  setup(props, context) {
    const quoteList = ref([])
    const activeId = ref(null)
    const changeId = (id, ftsId) => {
      context.emit('changeId', id, ftsId + '')
      activeId.value = id
    }
    const showActive = (id) => {
      return activeId.value === id
    }
    onMounted(() => {
      getQuoteList().then(res => {
        switch (res.code) {
          case 1:
            nextTick(() => {
              quoteList.value = res.data
            })
            break;
          case -1:
            messageShow('error', res.msg, 1000)
            break;
        }
      })
    })

    return {
      changeId,
      showActive,
      quoteList,
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 250px;
  height: 550px;
  overflow: hidden;
  z-index: 1003;
  border: 1px solid rgb(220, 220, 220);
}

.content {
  width: 250px;
}

::-webkit-scrollbar {
  display: none;
}

#quote-list {
  position: relative;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 550px;
  overflow-y: auto;
  background: rgb(255, 255, 255);
}

.quote-item {
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 65px;
  cursor: pointer;
  color: #222;
  border-bottom: 1px solid #eaeaea;
}

.active {
  background-color: rgb(220, 220, 220);
}

.img-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 100%;
  margin: 0 0 0 7px;
}

img {
  width: 41px;
  height: 41px;
}

.product-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 130px;
  /*height: 34px;*/
  height: 100%;
}

.product-title, .product-main-info {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 15px;
  text-align: left;
  /*font: 12px/17px arial, sans-serif;*/
  font: 12px normal iconfont;
  overflow: hidden;
  margin: 4px 0;
}

.deliver-country, .product-weight {
  width: 70px;
  height: 100%;
  padding-right: 10px;
}

.deliver-country {
  width: 90px;
  font: italic 10px arial, sans-serif;
}

.product-weight {
  width: 50px;
  font: 10px normal iconfont;
}

.time-block {
  width: 50px;
  height: 34px;
  font: italic bold 9px/17px arial, sans-serif;
  margin-left: 10px;
}
</style>