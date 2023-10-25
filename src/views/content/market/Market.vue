<template>
  <div id="search-block">
    <input type="text" class="search-text" v-model="searchContent" @keyup="keySearch" placeholder="输入字符进行全局模糊匹配搜索">
    <button @click="search">搜索</button>
  </div>
  <div class="wrapper">
    <div class="content">
      <ul id="market">
        <li class="item" v-for="(item,index) in productList" @click="openQuoteWindow(index, item)">
          <a class="item-a" target="_self" href="#">
            <img class="item-img" :src="$productImageUrl + item.photo" alt="">
            <div class="item-title">
              {{ item.productName }}
            </div>
            <div class="item-main-info">
              <div class="item-weight">
                {{ item.weight }}kg
              </div>
              <div v-if="item.realOrder === '1'" class="item-status">
                实单
              </div>
              <div v-else class="item-status" style="color: #9C9C9C">
                非实单
              </div>
              <div v-if="item.charger === '1'" class="item-charge-status">
                带电
              </div>
              <div v-else class="item-charge-status" style="color: rgb(224, 46, 36)">
                不带电
              </div>
            </div>
            <div class="item-launch-info">
              {{ $filters.dateFormat(item.sendTime, "YYYY-MM-DD") }}
              <div class="city">
                {{ item.origin }}->{{ item.destinationCountry }}
              </div>
            </div>
            <div class="fts-main-info">
              <div class="remain-quote">
                剩余报价数:{{ item.quoteCount }}
              </div>
              <div class="fts-company-name">
                {{ item.ftsName }}
              </div>
            </div>
            <div class="item-quote">
              <button class="quote">报价</button>
            </div>
          </a>
        </li>

      </ul>
    </div>
  </div>
  <span class="page">
          <a class="pn-pre">
            <i>&lt;</i>
            <em @click="lastPage">上一页</em>
          </a>
          <b class="pn-break" v-if="leftPage > 1">...</b>
          <slot name="message-list" v-for="(item) in pageList">
            <a @click="changePageNum(item)" :class="{active:showActive(item)}">{{ item }}</a>
          </slot>
          <b class="pn-break" v-if="rightPage >= 7 && rightPage < maxPage">...</b>
          <a class="pn-pre">
            <em @click="nextPage">下一页</em>
            <i>&gt;</i>
          </a>
          <span class="p-skip">
            <em>共
            <b>{{ maxPage }}</b>
              页&nbsp;&nbsp;到第
            </em>
            <input type="number" min="1" class="input-text" v-model="jumpPage"
                   onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')">
            <em>页</em>
            <a class="btn btn-default" @click="jump">确定</a>
          </span>
        </span>
  <send-quote-window v-if="showStatus" @closeWindow="closeWindow" :productInfo="productInfo" :deleteId="deleteId"
                     @deleteProduct="deleteProduct"></send-quote-window>
</template>

<script>
import {ref, reactive, onMounted} from 'vue'
import {getHomeProductList, getProductListFromSearchContent} from "network/home"
import SendQuoteWindow from 'views/content/market/SendQuoteWindow.vue'
import {messageShow} from "@/config/common"

export default {
  name: "Market",

  components: {
    SendQuoteWindow
  },

  setup() {
    // 根据index删除的productInfo
    const deleteId = ref(Object)
    // 商品列表
    const productList = ref([])
    // 窗口开启关闭状态
    const showStatus = ref(false)
    // 实时输入框的内容
    const searchContent = ref('')
    // 保存的上一次输入框输入查询的内容
    const saveSearchContent = ref('')
    // 当前页数，触发活动的页数
    const curPage = ref(1)
    // 最左边的页数边界
    const leftPage = ref(1)
    // 最右边的页数边界
    const rightPage = ref(1)
    // 最大页数
    const maxPage = ref(1)
    // 跳转页数
    const jumpPage = ref(1)
    const pageList = ref([])
    // 产品信息
    const productInfo = reactive({
      id: "",
      ftsId: "",
      ftsName: "",
      photo: "",
      productName: "",
      origin: "",
      destinationCountry: "",
      destination: "",
      postcode: "",
      weight: "",
      volumn: "",
      timeRequirement: "",
      charger: "",
      certificate: "",
      realOrder: "",
      remark: "",
      sendTime: "",
      quoteCount: "",
      verifyStatus: "",
    })
    //显示详细的产品信息到弹出窗口
    const openQuoteWindow = (index, data) => {
      deleteId.value = index
      productInfo.id = data.id
      productInfo.ftsId = data.ftsId
      productInfo.ftsName = data.ftsName
      productInfo.photo = data.photo
      productInfo.productName = data.productName
      productInfo.origin = data.origin
      productInfo.destinationCountry = data.destinationCountry
      productInfo.destination = data.destination
      productInfo.postcode = data.postcode
      productInfo.weight = data.weight
      productInfo.volumn = data.volumn
      productInfo.timeRequirement = data.timeRequirement
      productInfo.charger = data.charger
      productInfo.certificate = data.certificate
      productInfo.realOrder = data.realOrder
      productInfo.remark = data.remark
      productInfo.sendTime = data.sendTime
      productInfo.quoteCount = data.quoteCount
      productInfo.verifyStatus = data.verifyStatus
      showStatus.value = true
    }

    const closeWindow = () => {
      showStatus.value = false
    }

    const homePageShow = () => {
      const param = {
        currentPage: 1
      }
      getHomeProductList(param).then(res => {
        switch (res.code) {
          case 1:
            curPage.value = 1
            jumpPage.value = 1
            if (res.data !== null) {
              if (res.data.pageType === 'market' && res.data.showStatus === false) {
                messageShow('info', '已关闭询价产品显示，请联系管理员开启')
                return
              }
              productList.value = res.data.beanList
              maxPage.value = res.data.pageCount
              if (maxPage.value < 7) {
                pageList.value = []
                for (let i = 0; i < maxPage.value; i++) {
                  pageList.value.push(i + 1)
                }
                leftPage.value = pageList.value[0]
                rightPage.value = pageList.value[maxPage.value - 1]
              }
            }
            break
          case 0:
            if (res.error.pageCountError) {
              messageShow('error', res.error.pageCountError, 1000)
              break
            } else {
              messageShow('error', res.error.searchError, 1000)
              break
            }
          case -1:
            messageShow('info', res.msg, 1000)
            break
        }
      })
    }

    onMounted(() => {
      homePageShow()
    })

    const search = () => {
      saveSearchContent.value = searchContent.value
      if (searchContent.value.trim() === '') {
        homePageShow()
      } else {
        searchResult(1, saveSearchContent.value.trim())
      }
    }

    const keySearch = (e) => {
      if (e.keyCode === 13) {
        search()
      }
    }

    //删除list中的元素，则页面实时取消显示index对应的内容
    const deleteProduct = (index) => {
      productList.value.splice(index, 1)
    }

    const resetHomePageList = (changeMaxPage) => {
      pageList.value = []
      for (let i = 0; i < changeMaxPage; i++) {
        pageList.value.push(i + 1)
      }
      leftPage.value = pageList.value[0]
      rightPage.value = pageList.value[changeMaxPage - 1]
      maxPage.value = changeMaxPage
    }


    const searchResult = (pageNum, saveSearchContent) => {
      const searchParam = {
        'curPage': pageNum,
        'searchContent': saveSearchContent
      }
      getProductListFromSearchContent(searchParam).then(res => {
        switch (res.code) {
          case 1:
            if (res.data != null) {
              if (res.data.pageType === 'market' && res.data.showStatus === false) {
                messageShow('info', '已关闭询价产品显示，搜索功能不能用，请联系管理员开启')
                return
              }
              productList.value = res.data.beanList
              if (pageNum === 1) {
                resetHomePageList(res.data.pageCount)
              }
              curPage.value = pageNum
              jumpPage.value = pageNum
              return 1
            }
            return 0
          case 0:
            messageShow('info', res.msg, 1000)
            return 0
          case -1:
            messageShow('error', res.msg, 1000)
            return -1
        }
      }).catch(err => {
        // messageShow('error', res.msg, 1000)
        return -1
      })
      return 1
    }

    const changePageNum = (pageNum) => {
      searchResult(pageNum, saveSearchContent.value.trim())
    }

    const showActive = (id) => {
      return curPage.value === id
    }

    const lastPage = () => {
      if (curPage.value > leftPage.value) {
        searchResult(curPage.value -= 1, saveSearchContent.value.trim())
      } else if (curPage.value > 1) {
        if (searchResult(curPage.value -= 1, saveSearchContent.value.trim()) === 1) {
          for (let i = 0; i < pageList.value.length; i++) {
            pageList.value[i]--
            pageList.value[i]--
          }
          leftPage.value--
          rightPage.value--
        }
      }
    }

    const nextPage = () => {
      if (curPage.value < rightPage.value) {
        searchResult(curPage.value += 1, saveSearchContent.value.trim())
      } else if (curPage.value < maxPage.value) {
        if (searchResult(curPage.value++, saveSearchContent.value.trim()) === 1) {
          for (let i = 0; i < pageList.value.length; i++) {
            pageList.value[i]++
          }
          leftPage.value++
          rightPage.value++
        }
      }
    }

    const jump = () => {
      if (jumpPage.value < 1 || jumpPage.value > maxPage.value) {
        messageShow('info', '请输入正确的页数', 1000)
      } else if (pageList.value[0] <= jumpPage.value && jumpPage.value <= pageList.value[pageList.value.length - 1]) {
        searchResult(jumpPage.value, saveSearchContent.value.trim())
      } else if (jumpPage.value < leftPage.value && jumpPage.value >= 1) {
        const diff = leftPage.value - jumpPage.value
        if (searchResult(jumpPage.value, saveSearchContent.value.trim()) === 1) {
          for (let i = 0; i < pageList.value.length; i++) {
            pageList.value[i] -= diff
          }
          leftPage.value -= diff
          rightPage.value -= diff
        }
      } else {
        const diff = jumpPage.value - rightPage.value
        if (searchResult(jumpPage.value, saveSearchContent.value.trim()) === 1) {
          for (let i = 0; i < pageList.value.length; i++) {
            pageList.value[i] += diff
          }
          leftPage.value += diff
          rightPage.value += diff
        }
      }
    }

    return {
      deleteId,
      productList,
      showStatus,
      productInfo,
      openQuoteWindow,
      closeWindow,
      deleteProduct,
      searchContent,
      search,
      keySearch,
      changePageNum,
      showActive,
      pageList,
      curPage,
      lastPage,
      nextPage,
      leftPage,
      rightPage,
      maxPage,
      jumpPage,
      jump
    }
  }
}
</script>

<style scoped>
.wrapper {
  overflow: hidden;
  /*width: 1000px;*/
  width: 100%;
  /*height: 510px;*/
  height: 465px;
}

#search-block {
  width: 100%;
  height: 40px;
  display: inline-block;
  text-align: left;
}

.search-text {
  float: left;
  width: 576px;
  height: 35px;
  line-height: 24px;
  color: #999;
  padding: 4px;
  margin-bottom: 4px;
  border-width: 1px 0 1px 1px;
  border-color: #999;
  border-style: solid;
  outline: 0;
  font-size: 12px;
  padding-right: 44px;
}

.active {
  border: 0 none !important;
  padding: 1px 15px !important;
  background: 0 0 !important;
  -webkit-filter: none !important;
  filter: none;
  color: #e4393c !important;
  cursor: default !important;
}

button {
  width: 82px;
  height: 35px;
  cursor: pointer;
}

#market {
  display: block;
  /*overflow: hidden;*/
  position: relative;
  top: 5px;
  left: 5px;
  overflow-y: auto;
  overflow-x: hidden;
  /*height: 100%;*/
  /*height: 510px;*/
  height: 460px;
  width: 100%;
  /*width: 1000px;*/
  font-family: 'helvetica neue', tahoma, 'hiragino sans gb', stheiti, 'wenquanyi micro hei', sans-serif;
  border-top: 1px solid #f2f2f2;
  border-left: 1px solid #f2f2f2;
  list-style: none;
}

.item {
  width: 247px;
  height: 368px;
  margin: 0;
  box-sizing: border-box;
  display: inline-block;
  float: left;
  font-size: 12px;
  border: 1px solid #f2f2f2;
  border-top: none;
  border-left: none;
  background: #fff;
  vertical-align: top;
  text-align: -webkit-match-parent;
}

#market .item:hover {
  border: 1px solid #fd3f31;
  text-decoration: none;
}

.item-a {
  display: inline-block;
  text-decoration: none;
  width: 245px;
  height: 366px;
  box-sizing: border-box;
  padding: 22px 20px 0;
  background: #fff;
  color: rgb(156, 156, 156);;
  position: relative;
}

img {
  width: 198px;
  height: 198px;
  border-radius: 8px;
}

.item-title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 204px;
  height: 30px;
  line-height: 35px;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  font-family: iconfont;
  color: #151516;
}

.item-main-info, .fts-main-info, .item-launch-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 205px;
  text-align: left;
}

.fts-main-info {
  flex-direction: row;
  height: 20px;
}

.item-weight, .item-status {
  width: 68px;
  color: rgb(224, 46, 36);
  font: 15px/25px Arial, sans-serif;
}

.item-weight {
  font: 18px/25px Arial, sans-serif;
  font-weight: 600;
}

.item-status {
  text-align: center;
}

.item-charge-status {
  margin: 0 0 0 30px;
  font: 10px/25px Arial, sans-serif;
  text-align: right;
}

.fts-main-info, .item-launch-info {
  font: 10px/20px Arial, sans-serif
}

.fts-main-info {
  height: 20px;
}

.city {
  width: 72px;
  height: 20px;
  text-align: right;
  overflow: hidden;
}


.remain-quote {
  width: 80px;
  height: 20px;
  overflow: hidden;
  color: #00b82f;
}

.fts-company-name {
  width: 72px;
  height: 20px;
  overflow: hidden;
  text-align: right;
}

.item-quote {
  margin: 8px 0;
}

.quote {
  width: 160px;
  height: 35px;
  background-color: rgb(255, 57, 24);
  cursor: pointer;
  color: white;
  font: 1.25rem Arial, Serilf;
  border-radius: 8px;
  border: 0 transparent;
  outline: 0;
}

.page {
  width: 100%;
  display: inline-block;
  margin: 5px 10px;
  text-align: left;
}


.page a {
  display: inline-block;
  float: left;
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  margin-right: 5px;
  font-size: 14px;
  color: #333333;
  border: 1px solid #ddd;
  background-color: #f7f7f7;
  background-repeat: repeat-x;
  vertical-align: middle;
  font-style: normal;
  font-family: "\5b8b\4f53";
  cursor: pointer;
}

i {
  vertical-align: middle;
  font-style: normal;
  font-size: 16px;
  font-family: "\5b8b\4f53";
  padding: 0 5px;
  color: #aaa;
}

em {
  color: #333333;
  font: 14px tahoma, arial, Microsoft YaHei, Hiragino Sans GB, "\u5b8b\u4f53", sans-serif;
}

.pn-break {
  float: left;
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  margin-right: 5px;
  font-size: 14px;
}

.p-skip {
  float: left;
  margin-left: 20px;
}

.p-skip em {
  float: left;
  line-height: 38px;
  font-size: 14px;
}

.page .p-skip .input-text {
  float: left;
  width: 38px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  text-align: center;
  margin: 0 3px;
}

.input-text {
  height: 17px;
  line-height: 17px;
  width: 145px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-image: initial;
  padding: 3px;
}

.page .p-skip .btn {
  float: left;
  height: 36px;
  margin-left: 10px;
  font-size: 14px;
  line-height: 36px;
}

.btn-default {
  color: rgb(102, 102, 102);
  background-color: rgb(247, 247, 247);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(221, 221, 221);
  border-image: initial;
  padding: 4px 13px 5px;
  background-repeat: repeat-x;
}

.btn {
  display: inline-block;
  line-height: 14px;
  height: 14px;
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  background: rgb(247, 247, 247);
  text-decoration: none;
}
</style>