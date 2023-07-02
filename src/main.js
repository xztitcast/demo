import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import { isAuth } from '@/utils'
import http from '@/utils/request'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import cloneDeep from 'lodash/cloneDeep'
import '@/icons'

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

const app = createApp(App)
app.config.globalProperties.$http = http
app.config.globalProperties.$isAuth = isAuth
app.use(store).use(router).use(i18n).use(ElementPlus, { size: 'default', i18n: (key, value) => i18n.t(key, value) }).mount('#app')
