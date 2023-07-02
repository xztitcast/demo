import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'
//import { clearLoginInfo, getSSID, getTisid } from '@/utils'
import { clearLoginInfo} from '@/utils'
import isPlainObject from 'lodash/isPlainObject'

const baseURL = process.env.NODE_ENV === 'production' ? window.SITE_CONFIG['apiURL'] : "/"
const http = axios.create({
  baseURL,
  timeout: 1000 * 180,
  withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  //config.headers['tisid'] = getTisid()
  config.headers['token'] = Cookies.get('token') || ''
  //config.headers['tokenssid'] = getSSID() || ''
  
  // 默认参数
  var defaults = {}
    // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ...{ '_t': new Date().getTime() }
      }
    }
    if (isPlainObject(config.params)) {
      config.params = {
        ...defaults,
        ...config.params
      }
    }
    if (isPlainObject(config.data)) {
      config.data = {
        ...defaults,
        ...config.data
      }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) {
    clearLoginInfo()
    this.$router.replace({ name: 'login' })
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

export default http
