import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import moment from 'moment'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;
const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$qs = qs;
app.config.globalProperties.$faImageUrl = "http://localhost:8080/fa-image/";
app.config.globalProperties.$ftsImageUrl = "http://localhost:8080/fts-image/";
app.config.globalProperties.$productImageUrl = "http://localhost:8080/product-image/";
app.config.globalProperties.$productVerifyImageUrl = "http://localhost:8080/product-verify-image/";
app.use(store).use(router).use(ElementPlus, { size: 'small', zIndex: 3000 }).mount('#app');
app.config.globalProperties.$filters = {
    dateFormat(value, format) {
        return moment(value).format(format);
    }
};