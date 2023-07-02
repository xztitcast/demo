import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
  }
]

export const globalRoutes = [
  {
    path: '/404',
    component: () => import('@/views/global/404.vue'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter: (to, from, next) => {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next({ name: 'login' })
    }
  },
  { path: '/login', name: 'login', meta: { title: '登录' }, component: () => import(/* webpackChunkName: "login" */'@/views/global/login.vue'), },
]

export const mainRoutes = {
  path: '/',
  component: () => import('@/views/main.vue'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口布局' },
  children: [
    { path: '/home', component: () => import('@/views/modules/home.vue'), name: 'home', meta: { title: '首页', isTab: true } }
  ]
}

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ y: 0 }),
  routes: globalRoutes.concat(mainRoutes)
})

export default router
