// eslint-disable-next-line
import { UserLayout, LoginLayout, HeadLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'MenuIndex.vue',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace'
    ,
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, /*permission: [ 'dashboard' ] */},
        children: [
          {
            path: 'analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/system/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: true, /*permission: [ 'dashboard' ]*/ }
          },
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/system/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: false/*, permission: [ 'dashboard' ] */}
          }
        ]
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: LoginLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/userLoginReg/Login')
      }
    ]
  },

  {
    path: '/ai',
    component: HeadLayout,
    redirect: '/ai/robot',
    hidden: true,
    children: [
      {
        path: 'robot',
        name: 'robot',
        component: () => import(/* webpackChunkName: "user" */ '@/views/system/ai/robot')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/article',
    name:'article',
    hidden: true,
    component: () => import(/* webpackChunkName: "article" */'@/views/article')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/system/exception/404')
  }

]
