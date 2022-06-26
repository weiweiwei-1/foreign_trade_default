<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="menu">
        <sub-menu>
            <template v-slot:market>
            </template>
            <template v-slot:message>
            </template>
            <template v-slot:quote>
            </template>
            <template v-slot:friend>
            </template>
            <template v-slot:suggestion>
            </template>
        </sub-menu>
    </div>
</template>

<script>
    import SubMenu from 'views/content/SubMenu.vue'
    export default {
        name: "LeftMenu",
        components: {
            SubMenu
        }
    }
</script>

<style scoped>
    #menu {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        position: relative;
        float: left;
        width: 100px;
        height: 530px;
        background-color: yellow;
    }
</style>