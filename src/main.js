import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import moment from 'moment'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;
const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$qs = qs;
app.use(store).use(router).mount('#app');
app.config.globalProperties.$filters = {
    dateFormat(value, format) {
        return moment(value).format(format);
    }
};