<template>
    <slot name="message-item" v-for="item in messageItem">
        <router-link :to="'/fa/message/' + item.ftsid">
            <div class="message-item">
                {{item.ftsid}}
            </div>
        </router-link>
    </slot>

</template>

<script>
    export default {
        name: "MessageItem",
        props: {
            messageItem: {
                type: Array,
                default() {
                    return [];
                }
            }
        }
    }
</script>

<style scoped>
    .message-item {
        width: 100%;
        height: 70px;
        margin: 5px 0 5px 0;
        background: blanchedalmond;
    }
</style>