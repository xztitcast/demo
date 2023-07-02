import { createI18n } from 'vue-i18n';
import Cookies from 'js-cookie'
import zhCNLocale from 'element-plus/lib/locale/lang/zh-cn'
import zhCN from './zh-CN'

export const messages = {
  'zh-CN': {
    '_lang': '简体中文',
    ...zhCN,
    ...zhCNLocale
  }
}

export default createI18n({
  locale: Cookies.get('language') || 'zh-CN',
  messages
})
