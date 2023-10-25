<template>
  <div id="fts-message-content">
    <message-list @changeId="changeId"></message-list>
    <message-content-default :ftsId="ftsId"></message-content-default>
  </div>
</template>

<script>
import MessageList from 'views/content/message/MessageList.vue'
import MessageContentDefault from 'views/content/message/MessageContentDefault.vue'
import {ref} from 'vue'

export default {
  name: "Quote",
  components: {
    MessageList,
    MessageContentDefault
  },
  setup() {
    const ftsId = ref(null)
    const changeId = (id) => {
      ftsId.value = id
    }

    return {
      changeId,
      ftsId
    }
  }
}
</script>

<style scoped>
#fts-message-content {
  display: flex;
  width: 1000px;
  height: 550px;
}
</style>