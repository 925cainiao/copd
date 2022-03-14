import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

var routes = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import(/* webpackChunkName: "page" */ '@/page/login')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "page" */ '@/page/login')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import(/* webpackChunkName: "page" */ '@/page/main'),
      meta: {
        requireAuth: true // 添加需要权限的标记
      }
    }
  ]
})
routes.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
    if (sessionStorage.getItem('doctorInfo')) { // 判断是否登录
      next()
    } else { // 没登录则跳转到登录界面
      next({
        path: '/login'

      })
    }
  } else {
    next()
  }
})
export default routes
