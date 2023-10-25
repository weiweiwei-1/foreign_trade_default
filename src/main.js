import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import moment from 'moment'
import 'element-plus/dist/index.css'
import ws from '@/config/websocket'

// const urlHeader = 'http://kingvi.online/api'
const urlHeader = 'http://localhost:8080'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;
const app = createApp(App);
app.config.globalProperties.$websocket = ws;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$qs = qs;
app.config.globalProperties.$faImageUrl = urlHeader + '/fa-image/';
app.config.globalProperties.$ftsImageUrl = urlHeader + '/fts-image/';
app.config.globalProperties.$productImageUrl = urlHeader + '/product-image/';
app.config.globalProperties.$productVerifyImageUrl = urlHeader + '/product-verify-image/';
app.config.globalProperties.$recommendImageUrl = urlHeader + '/recommend-image/';
app.config.globalProperties.$recommendVerifyImageUrl = urlHeader + '/recommend-verify-image/';
// app.config.globalProperties.$wsUrl = "ws://kingvi.online/websocket/socketServer";
app.config.globalProperties.$wsUrl = "ws://localhost:8080/websocket/socketServer";
// app.use(store).use(router).use(ElementPlus, { size: 'small', zIndex: 3000 }).mount('#app');
app.use(store).use(router).mount('#app');
app.config.globalProperties.$filters = {
    dateFormat(value, format) {
        return moment(value).format(format);
    }
};

