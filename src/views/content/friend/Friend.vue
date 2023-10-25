<template>
  <div id="friend-content">
    <friend-list @changeFtsId="changeId" :delIndex="delIndex" ref="sonRef"></friend-list>
    <friend-content-default :ftsId="ftsId" :targetIndex="targetIndex" @delTargetFriend="delTargetFriend"
    ></friend-content-default>
  </div>
</template>

<script>
import FriendList from 'views/content/friend/FriendList.vue'
import FriendContentDefault from 'views/content/friend/FriendContentDefault.vue'
import {ref} from "vue"

export default {
  name: "Friend",
  components: {
    FriendList,
    FriendContentDefault
  },
  setup() {
    const sonRef = ref()
    const ftsId = ref(null)
    const targetIndex = ref(null)
    const delIndex = ref(null)
    const changeId = (id, index) => {
      ftsId.value = id
      targetIndex.value = index
    }

    const delTargetFriend = () => {
      sonRef.value.deleteFriend()
    }

    return {
      ftsId,
      changeId,
      targetIndex,
      delIndex,
      delTargetFriend,
      sonRef
    }
  }
}
</script>

<style scoped>
#friend-content {
  display: flex;
  width: 1000px;
  height: 550px;
}
</style>