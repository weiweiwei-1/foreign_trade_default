<template>
  <div id="send-quote-block" @click="closeQuoteWindow">
    <div id="send-quote-center">
      <div id="product-info">
        <div id="product-image">
          <img :src="$productImageUrl + curProductInfo.photo" alt="" @click="showWindow">
        </div>
        <div id="main-info">
          <div id="item-main-info">
            <div class="item-weight">{{ curProductInfo.weight }}kg</div>
            <div class="item-status">
              <span v-if="curProductInfo.realOrder === '1'">实单</span>
              <span v-else style="color: #333">非实单</span>
            </div>
            <div class="item-charge-status">
              <span v-if="curProductInfo.charger === '1'">带电</span>
              <span v-else style="color: rgb(224, 46, 36)">不带电</span>
            </div>
          </div>
          <div id="item-launch-info">
            <div class="launch-time">{{ $filters.dateFormat(curProductInfo.sendTime, "YYYY-MM-DD") }}</div>
            <div class="transport-road">{{ curProductInfo.origin }}->{{ curProductInfo.destinationCountry }}</div>
          </div>
          <div id="fts-main-info">
            <div class="remain-quote">剩余报价数：{{ curProductInfo.quoteCount }}</div>
            <div class="fts-company">{{ curProductInfo.ftsName }}</div>
          </div>
        </div>
        <span class="divide-line">———————————————————</span>
        <div id="detail-info">
          <ul>
            <li><span class="product-key">体积</span><span class="mark">:</span><span
                class="value">{{ curProductInfo.volumn }}</span></li>
            <li><span class="product-key">证书</span><span class="mark">:</span><span class="value"
                                                                                    v-if="curProductInfo.certificate === '1'"
                                                                                    style="color: rgb(224, 46, 36)">有</span><span
                v-else>无</span></li>
            <li><span class="product-key">邮编</span><span class="mark">:</span><span
                class="value">{{ curProductInfo.postcode }}</span></li>
            <li><span class="product-key">    </span><span class="mark"> </span><span class="value">         </span>
            </li>
            <li class="long-info"><span class="product-key">详细地址</span><span class="mark">:</span><span class="value"
                                                                                                        id="detail-address">{{
                curProductInfo.destination
              }}</span>
            </li>
            <li class="long-info"><span class="product-key">备注</span><span class="mark">:</span><span class="value"
                                                                                                      id="information">{{
                curProductInfo.remark
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div id="quote-info">
        <div id="center-block">
          <div id="quote-center">
            <div id="input-info">
              <ul>
                <li><span class="quote-key">运输方式</span><span class="mark">：</span><span class="red-mark">*</span>
                  <select v-model="shippingWay" @change="inputChange">
                    <option value="">选择运输方式</option>
                    <option v-for="item in shippingWayList" :value="item">{{ item }}</option>
                  </select>
                </li>
                <li><span class="quote-key">运费(元)</span><span class="mark">：</span><span class="red-mark">*</span><input
                    type="number" v-model="price" id="shipping-cost-text" @input="inputChange"></li>
                <li><span class="quote-key">排仓时间</span><span class="mark">：</span><span class="red-mark">*</span>
                  <select v-model="arrangeTime" @change="inputChange">
                    <option value="">选择天数</option>
                    <option v-for="item in arrangeTimeList" :value="item">{{ item }}</option>
                  </select>
                </li>
                <li><span class="quote-key">运输时间</span><span class="mark">：</span><span class="red-mark">*</span>
                  <select v-model="deliverTime" @change="inputChange">
                    <option value="">选择天数</option>
                    <option v-for="item in deliverTimeList" :value="item">{{ item }}</option>
                  </select>
                </li>
                <li><span class="quote-key">备注</span><span class="mark">：</span><span class="red-mark"> </span><textarea
                    id="mark-text" v-model="reMark" @input="inputChange" placeholder="可选择是否留电话，是否投保，以及其他运输方式的报价"/></li>
              </ul>
            </div>
            <div id="send-quote">
              <button @click="sendQuoteTrigger">发送报价</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="image-view" v-show="imageShowStatus" @click="closeImageWindow">
    <div>
      <img :src="$productImageUrl + curProductInfo.photo" alt="" id="image">
    </div>
  </div>
</template>

<script>
import {ref, toRefs, reactive} from 'vue'
import {sendQuote} from "network/quote"
import {delQuoteCount, messageShow} from "@/config/common"

export default {
  name: "SendQuoteWindow",
  props: {
    productInfo: {
      type: Object,
      required: true,
      default: null
    },

    deleteId: {
      type: Object,
      required: true,
      default: null
    }
  },

  setup(props, context) {
    //当前页面传递的产品信息
    let curProductInfo = props.productInfo
    const quoteInfo = reactive({
      productId: curProductInfo.id,
      shippingWay: "",
      price: "",
      arrangeTime: "",
      deliverTime: "",
      reMark: ""
    })
    //图片预览窗口显示状态
    const imageShowStatus = ref(false)
    //运输方式可选列表
    const shippingWayList = ref(["海运", "空运", "陆运"])
    //排仓时间可选列表
    const arrangeTimeList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
    //运输时间可选列表
    const deliverTimeList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
    const closeQuoteWindow = (e) => {
      const center = document.querySelector("#send-quote-center")
      if (center && !center.contains(e.target)) {
        context.emit('closeWindow')
      }
    }

    const showWindow = () => {
      imageShowStatus.value = true
    }

    const closeImageWindow = (e) => {
      const center = document.querySelector("#image")
      if (center && !center.contains(e.target)) {
        imageShowStatus.value = false
      }
    }

    function textInvalid(target) {
      target.style.border = "1px solid red"
    }

    function textValid(target) {
      target.style.border = "1px solid deepskyblue"
    }

    const sendQuoteTrigger = () => {
      //错误标志位
      let error = 0
      //获取select选择对象，0,1,2分别为运输shippingWay，arrangeTime，deliverTime
      const selectTargets = document.querySelectorAll("select")
      //运费输入框对象
      const shippingCostTarget = document.querySelector("#shipping-cost-text")
      //备注输入框对象
      const markTarget = document.querySelector("textarea")
      if (quoteInfo.shippingWay === "") {
        textInvalid(selectTargets[0])
        error = 1
      } else {
        textValid(selectTargets[0])
      }
      if (Number.isNaN(Number(quoteInfo.price)) || Number(quoteInfo.price) <= 0) {
        textInvalid(shippingCostTarget)
        error = 1
      } else {
        textValid(shippingCostTarget)
      }
      if (quoteInfo.arrangeTime === "") {
        textInvalid(selectTargets[1])
        error = 1
      } else {
        textValid(selectTargets[1])
      }
      if (quoteInfo.deliverTime === "") {
        textInvalid(selectTargets[2])
        error = 1
      } else {
        textValid(selectTargets[2])
      }
      if (quoteInfo.reMark.trim().length > 80) {
        textInvalid(markTarget)
        error = 1
      } else {
        textValid(markTarget)
      }
      if (error === 0) {
        sendQuote(quoteInfo).then(res => {
          switch (res.code) {
            case -1:
              messageShow('error', res.msg, 1000)
              context.emit('closeWindow')
              if (res.msg !== '当天报价次数已用完') {
                context.emit('deleteProduct', props.deleteId)
              }
              break
            case 0:
              res.error.priceError !== null ? textInvalid(shippingCostTarget) : textValid(shippingCostTarget)
              res.error.reMarkError !== null ? textInvalid(markTarget) : textValid(markTarget)
              break
            case 1:
              messageShow('success', "报价成功", 1000)
              delQuoteCount()
              context.emit('closeWindow')
              context.emit('deleteProduct', props.deleteId)
              break
            case -2:
              messageShow('info', res.msg, 1000)
              break
            default:
          }
        })
      }
    }

    const inputChange = (e) => {
      e.target.style.border = "1px solid deepskyblue"
    }

    return {
      curProductInfo,
      ...toRefs(quoteInfo),
      imageShowStatus,
      shippingWayList,
      arrangeTimeList,
      deliverTimeList,
      showWindow,
      closeImageWindow,
      closeQuoteWindow,
      inputChange,
      sendQuoteTrigger
    }
  }

}
</script>

<style scoped>
#send-quote-block {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1005;
  background: rgba(0, 0, 0, 0.4);
}

#send-quote-center {
  display: flex;
  flex-direction: row;
  width: 700px;
  height: 500px;
  background: #FFFFFF;
  border-radius: 10px;
}

#product-info {
  display: inline-block;
  text-decoration: none;
  width: 350px;
  height: 500px;
  border: 1px solid rgb(224, 46, 36);
  border-radius: 10px;
  box-sizing: border-box;
  background: #fff;
  color: #333;
  overflow: hidden;
}

#main-info {
  width: 100%;
  height: 65px;
  padding: 0 50px 0;
}


#item-main-info, #item-launch-info, #fts-main-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  text-align: left;
}

#item-main-info {
  height: 25px;
}

.item-weight, .item-status {
  width: 68px;
  color: rgb(224, 46, 36);
  font: 18px/25px Arial, sans-serif;
}

.item-charge-status {
  font: 10px/25px Arial, sans-serif;
  text-align: right;
}

#item-main-info, #item-launch-info, #fts-main-info {
  font: 10px/20px Arial, sans-serif;
}

.remain-quote {
  overflow: hidden;
  color: #00b82f;
}

#detail-info {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#detail-info ul {
  list-style: none;
  width: 100%;
  height: 100%;
  margin: 0 0 0 10px;
  font: 15px/20px Arial, sans-serif;
}

#detail-info li {
  display: inline-block;
  text-align: left;
  width: 160px;
  height: 20px;
  margin: 5px 0;
  vertical-align: middle;
}

#detail-info .long-info {
  width: 320px;
  height: 100px;
}

.product-key, .quote-key {
  display: inline-block;
  vertical-align: middle;
  width: 60px;
  height: 20px;
  text-align: justify;
  -moz-text-align-last: justify;
  text-align-last: justify;
  padding: 0;
  float: left;
}

.mark {
  float: left;
  line-height: 20px;
}

.red-mark {
  display: inline-block;
  width: 10px;
  height: 10px;
  line-height: 10px;
  color: red;
}

li .value {
  display: inline-block;
  overflow: hidden;
  width: 70px;
  height: 20px;
  float: left;
  margin: 0 10px 0 5px;

}

#information, #detail-address {
  overflow: hidden;
  width: 230px;
  height: 100px;
  margin: 0 0 0 5px;
}

#fts-main-info {
  height: 20px;
}

#quote-info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 500px;
  background: white;
  border: 1px solid yellow;
  border-radius: 10px;
}

#center-block {
  display: inline-block;
  text-decoration: none;
  width: 340px;
  height: 490px;
  border: 1px solid rgb(224, 46, 36);
  box-sizing: border-box;
  background: #fff;
  color: #333;
  overflow: hidden;
  border-radius: 10px;
}

#quote-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 340px;
  height: 490px;
}

#input-info, ul {
  width: 100%;
  height: 420px;
  display: block;
  list-style: none;
}

#input-info li {
  display: inline-block;
  text-align: left;
  width: 300px;
  height: 20px;
  margin: 20px 0;
  vertical-align: middle;
}

.quote-key {
  width: 64px;
  height: 20px;
}

select, input, textarea {
  width: 200px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid deepskyblue;
  outline: none;
}

#mark-text {
  width: 200px;
  height: 160px;
}

button {
  width: 150px;
  height: 30px;
  margin: 18px 0;
  background-color: rgb(255, 57, 24);
  cursor: pointer;
  color: white;
  font: 1.15rem Arial, Serilf;
  border-radius: 8px;
  border: 0 transparent;
  outline: 0;
}

#product-image {
  height: 135px;
}

#product-image img {
  width: 130px;
  height: 130px;
  cursor: pointer;
}

.divide-line {
  color: red;
  margin: 30px 0 0;
  overflow: hidden;
}

#image-view {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1007;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

#image-view img {
  width: 500px;
  height: 500px;
  background: white;
}

</style>