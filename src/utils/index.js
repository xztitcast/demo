import Cookies from 'js-cookie'
import store from '@/store'
import moment from 'moment'
import CryptoJS from 'crypto-js'

/**
 * 权限
 * @param {*} key
 */
export function isAuth (key) {
  return window.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false
}

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export function getDictDataList (dictType) {
  const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
  if (type) {
    return type.dataList
  } else {
    return []
  }
}

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export function getDictLabel (dictType, dictValue) {
  const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
  if (type) {
    const val = type.dataList.find((element) => (element.dictValue === dictValue + ''))
    if (val) {
      return val.dictLabel
    } else {
      return dictValue
    }
  } else {
    return dictValue
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  store.commit('resetStore')
  Cookies.remove('token')
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false
}

/**
 * 机构id
 * @returns 
 */
export function getTisid () {
  return store.state.user.tisid
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList () {
  var res = []
  var list = document.querySelectorAll('svg symbol')
  for (var i = 0; i < list.length; i++) {
    res.push(list[i].id)
  }

  return res
}

/**
 * 日期格式化
 * @param {*} data 
 * @param {*} formatStr 
 * @returns 
 */
export function dateFormat (data, formatStr = "YYYY-DD-MM HH:mm:ss") {
  return moment(data).format(formatStr)
}

/**
 * 树形数据转换(已迁移后端返回)
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]]['children']) {
      temp[data[k][pid]]['children'] = []
    }
    temp[data[k][pid]]['children'].push(data[k])
    data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1
  }
  return res
}

const testJSON = function readFile(){
  const xhr = new XMLHttpRequest()
  const okStatus = document.location.protocol === 'file:' ? 0 : 200
  xhr.open('GET', 'test.json', false)
  xhr.overrideMimeType('text/html;charset=utf-8')// 默认为utf-8
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}()

const defaultJSON = function readFile(){
  const xhr = new XMLHttpRequest()
  const okStatus = document.location.protocol === 'file:' ? 0 : 200
  xhr.open('GET', 'default.json', false)
  xhr.overrideMimeType('text/html;charset=utf-8')// 默认为utf-8
  xhr.send(null)
  return xhr.status === okStatus ? xhr.responseText : null
}()

const testObject = JSON.parse(testJSON)
const defaultObjet = JSON.parse(defaultJSON)

/**
 * AES加密
 * @param {*} data 
 */
 const defaultKey = CryptoJS.enc.Utf8.parse(defaultObjet.key)
 const defaultIv = CryptoJS.enc.Utf8.parse(defaultObjet.iv)
 export function encrypt(data) {
  var srcs = CryptoJS.enc.Utf8.parse(data)
  const cipher = CryptoJS.AES.encrypt(srcs, defaultKey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: defaultIv,
  })
  return CryptoJS.enc.Base64.stringify(cipher.ciphertext)
}

/**
 * AES加密
 * @param {*} data 
 */
const testKey = CryptoJS.enc.Utf8.parse(testObject.key)
const testIv = CryptoJS.enc.Utf8.parse(testObject.iv)
export function AESEncrypt(data) {
  var srcs = CryptoJS.enc.Utf8.parse(data)
  const cipher = CryptoJS.AES.encrypt(srcs, testKey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: testIv,
  })
  return CryptoJS.enc.Base64.stringify(cipher.ciphertext)
}

 /**
  * 标识符
  * @returns 
  */
  export function getSSID() {
    var nonce = getUUID().replaceAll("-", "");
    var time = new Date().getTime()
    var data = {"deviceId": testObject.deviceId, "nonce": nonce, "timestamp": time}
    var word = AESEncrypt(JSON.stringify(data))
    return testObject.type.concat(word)
  }

  /**
  * 标识符
  * @returns 
  */
   export function ssid() {
    var nonce = getUUID().replaceAll("-", "");
    var time = new Date().getTime()
    var data = {"deviceId": defaultObjet.deviceId, "nonce": nonce, "timestamp": time}
    var word = encrypt(JSON.stringify(data))
    return defaultObjet.type.concat(word)
  }

/**
 * 生成随机字符串
 * @param {*} size 
 * @returns 
 */
export function randomStr(size){
  var str = "1234567890ABCDEFGHIGKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz-/()$&@?!~<>€£¥[]{}#%^*+="
  var text = ''
  for(var i = 0; i < size; i++){
    text += str.charAt(Math.floor(Math.random() * str.length));
  }
  return text
}