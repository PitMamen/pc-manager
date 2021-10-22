/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: '排班管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: '班次设置' }
    },
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '排班设置' }
    },
    {
      path: 'menu3',
      name: 'Menu3',
      component: () => import('@/views/nested/menu3/index'),
      meta: { title: '医生管理' }
    }
  ]
}

export default nestedRouter
