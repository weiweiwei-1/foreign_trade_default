<template>
    <div id="header">
        <my-pic></my-pic>
        <advertisement></advertisement>
        <user-information></user-information>
    </div>
</template>

<script>
    import MyPic from 'views/head/recomend/FamousStation.vue'
    import Advertisement from 'views/head/advertisement/Advertisement.vue'
    import UserInformation from 'views/head/user/UserInformation.vue'
    export default {
        name: "MyHeader",
        components: {
            MyPic,
            Advertisement,
            UserInformation
        }
    }
</script>

<style scoped>
    #header {
        display: -webkit-box;
        -webkit-box-flex: 1;
        -webkit-box-orient: horizontal;
        width:1366px;
        height:95px;
        background-color: darkgrey;
    }
</style>