import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import moment from 'moment'
import 'element-plus/dist/index.css'
import ws from '@/config/websocket'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true
const app = createApp(App)
app.config.globalProperties.$websocket = ws
app.config.globalProperties.$axios = axios
app.config.globalProperties.$qs = qs
app.config.globalProperties.$faImageUrl = process.env.VUE_APP_API_URL + '/fa-image/'
app.config.globalProperties.$ftsImageUrl = process.env.VUE_APP_API_URL + '/fts-image/'
app.config.globalProperties.$productImageUrl = process.env.VUE_APP_API_URL + '/product-image/'
app.config.globalProperties.$productVerifyImageUrl = process.env.VUE_APP_API_URL + '/product-verify-image/'
app.config.globalProperties.$recommendImageUrl = process.env.VUE_APP_API_URL + '/recommend-image/'
app.config.globalProperties.$recommendVerifyImageUrl = process.env.VUE_APP_API_URL + '/recommend-verify-image/'
app.config.globalProperties.$wsUrl = process.env.VUE_APP_WEBSOCKET_URL
app.use(store).use(router).mount('#app')
app.config.globalProperties.$filters = {
    dateFormat(value, format) {
        return moment(value).format(format)
    }
}

