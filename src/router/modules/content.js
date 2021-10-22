/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const contentRouter = {
  path: '/content',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Content',
  meta: {
    title: '内容管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/content/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: '问卷管理' }
    },
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/content/menu2/index'),
      meta: { title: 'banner图管理' }
    }
  ]
}

export default contentRouter
