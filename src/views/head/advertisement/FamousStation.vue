<template>
  <div id="topic-content">
    <ul class="menu-list">
      <li class="menu-item" v-on:mouseover="showContent('introduction')" v-on:mouseout="closeContentBlock">
        <span>简介</span></li>
      <li class="menu-item" v-on:mouseover="showContent('service')" v-on:mouseout="closeContentBlock"><span>业务</span>
      </li>
      <li class="menu-item" v-on:mouseover="showContent('technique')" v-on:mouseout="closeContentBlock"><span>技术</span>
      </li>
      <li class="menu-item" v-on:mouseover="showContent('member')" v-on:mouseout="closeContentBlock"><span>成员</span>
      </li>
    </ul>
    <div class="guide-show" v-show="contentShowStatus" v-on:mouseover="keepShow" v-on:mouseout="closeContentBlock"
         v-html="htmlShowContent()">
    </div>
  </div>
</template>

<script>

import {ref} from "vue"

export default {
  name: "TopicShow",

  setup() {
    const content = ref('')
    const contentShowStatus = ref(false)
    const key = ref(null)

    const htmlShowContent = () => {
      return content.value.replace(/\n/g, '<br>')
    }

    const showContent = (mark) => {
      contentShowStatus.value = true
      switch (mark) {
        case 'introduction':
          content.value = '网页开发目标：\n该网页是一个测试demo，仅用于测试，不对外发布。测试包括技术测试和业务测试。\n' +
              '<p style="color: red">\测试中切勿输入个人真实信息。\n\</p>' +
              '1. 关于技术测试，测试该网页在低并发场景下的性能以及功能可用性。\n' +
              '2. 关于业务测试，测试海外货物运费报价在外贸和货代之间的需求可行性。\n\n' +
              '业务背景：\n' +
              '海外货物运输需要在保证货代可靠情况下，尽可能节省运费成本，外贸员可以从货代处获取低报价节省运输成本，货代需要获取更多的外贸客户，以提高自己的业绩。\n\n' +
              '面向群体：货代和外贸。\n\n' +
              '业务目标：连接货代和外贸，对于海外货物的运费报价以及货物相关的运输服务，为货代和外贸相互间提供更多选择。'
          key.value = 0
          break
        case 'service':
          content.value = '<p style="color: dodgerblue">\货代运费报价页面：<a href="http://www.kingvi.online" target="_blank" style="color: dodgerblue; text-decoration: underline;">www.kingvi.online</a>，业务需求：\n\</p>' +
              '1. 关于报价，每天有30个报价额度，在首页的市场模块，可选取外贸发送的，未报价完全的货物进行报价（剩余报价数大于0的货物），同一个货物只能报价一次，不能重复报价，当天报价额度用完，管理员在次日重置报价数，报价额度恢复到30。\n' +
              '2. 报价提交后，货代可在左侧的报价模块查看已报价货物以及对应的报价信息，点击对应货物，可跟发布对应货物的外贸进行沟通交流，同时还可以添加对应的货代好友。\n' +
              '3. 关于优惠推送，也即后面所称的优惠活动，推送需要添加活动图片，同时填写活动对应的关键字词和活动描述，具体推荐填写方式已备注说明，优惠推送信息需要管理员后台审核，人工审核有一定延时，若需快速审核通过，可联系kingvi。\n' +
              '4. 优惠活动信息审核通过后，在外贸主页的活动模块，可根据条件查询需要的活动信息；若审核不通过，将被删除，需重新提交。\n\n' +
              '<p style="color: dodgerblue">\外贸运费询价页面：<a href="http://www.kingvi.online/fts" target="_blank" style="color: dodgerblue; text-decoration: underline;">www.kingvi.online/fts</a>，业务需求:\n\</p>' +
              '1. 关于运费询价，外贸员点击询价按钮后，添加货物图，输入货物名称，目标国家，重量，详细地址等必填字段后，即可点击发送询价。\n' +
              '2. 点击询价后，需要管理员审核通过，才能在货代报价页面的市场模块显示，一个货物默认可以接受15个来自货代的报价，当达到15个时，将不被允许再次接受报价；若询价的货物审核不通过，将被删除，需重新提交。\n' +
              '3. 审核通过的货物，可点击左侧的产品模块，查看所有发送过询价并审核通过的产品，点击对应的产品，有下拉列表显示该产品接受的所有报价,点击对应的报价信息，可查看具体的报价详情以及跟对应的货代发起沟通。\n' +
              '4. 关于活动，活动模块显示了所有审核通过的货代发送的运费优惠信息，外贸员可点击查看详情，若活动详情跟自己需求匹配，可添加对应的货代进行沟通交流。\n\n' +
              '<p style="color: dodgerblue">\其它：\n\</p>' +
              '1. 关于消息模块，只有进行过报价，或者是好友关系，才能相互之间发消息。\n' +
              '2. 关于好友模块，货代间不允许相互添加好友，外贸员之间亦不允许相互添加好友，好友关系只有外贸和货代。\n' +
              '3. 关于账号模块，货代和外贸不能使用同一个账号，不允许出现一个账号登录两个页面的场景，原则上一人一个身份（货代或外贸），但由于阿里云禁用了tx的邮箱端口，因此无法实现邮箱登录验证，故采用了随机邮箱。\n' +
              '4. 关于建议反馈，感谢反馈。\n'
          key.value = 1
          break
        case 'technique':
          content.value = '后台：Java\n' +
              '数据库：MySQL(InnoDB)\n' +
              '前端：Vue3\n' +
              '前端开发环境：基于Chromium内核的浏览器\n' +
              '设计模式：MVC\n' +
              '后台框架：Spring + SpringMVC + MyBatis\n' +
              '登录模块：Shiro\n' +
              '即时通讯：WebSocket\n' +
              'Web应用服务器：Tomcat\n' +
              '反向代理服务器：nginx\n' +
              '云服务器：阿里云服务器ECS，2核4G，3M带宽（因此只能进行功能测试，无法进行高并发压力测试）\n\n' +
              '备注：作为测试demo，软件设计基于单机架构设计，即使硬件支持，软件上也不支持高并发，否则会有较大概率导致数据脏读脏写，或者服务器宕机\n\n'
          key.value = 2
          break
        case 'member':
          content.value = 'UI：kingvi\n' +
              '后端：kingvi\n' +
              '前端：kingvi\n' +
              '测试：kingvi + others\n' +
              '维护：kingvi\n' +
              '推广：测试demo只测试不推广\n' +
              '运营：测试demo只测试不运营'
          key.value = 3
          break
      }
      const target = document.querySelectorAll('span')
      target[key.value].style.color = 'white'
    }

    const closeContentBlock = () => {
      contentShowStatus.value = false
      const target = document.querySelectorAll('span')
      target[key.value].style.color = 'black'
    }

    const keepShow = () => {
      contentShowStatus.value = true
      const target = document.querySelectorAll('span')
      target[key.value].style.color = 'white'
    }

    return {
      showContent,
      content,
      contentShowStatus,
      closeContentBlock,
      keepShow,
      htmlShowContent
    }
  }
}
</script>

<style scoped>
#topic-content {
  position: relative;
  width: 550px;
  height: 100%;
  text-align: center;
}

.menu-list {
  display: block;
  height: 72px;
  position: absolute;
  top: 10px;
  font-size: 16px;
  font-weight: bold;
}

.menu-item {
  display: inline-block;
  height: 50px;
  float: left;
  margin-left: 80px;
  position: relative;
}

.menu-item span {
  cursor: pointer;
}

.menu-item span:hover {
  color: white;
}

.guide-show {
  position: absolute;
  height: 650px;
  width: 100%;
  left: 0;
  top: 30px;
  font-size: 12px;
  text-align: left;
  line-height: 20px;
  border: 1px solid rgb(220, 220, 220);;
  background-color: white;
  z-index: 1009;
  color: black;
}
</style>