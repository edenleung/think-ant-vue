// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true }
          }
        ]
      },

      {
        path: '/auth',
        name: 'auth',
        component: PageView,
        meta: { title: '权限管理', icon: 'slack', permission: [ 'rule', 'role', 'account' ] },
        redirect: '/auth/rule',
        children: [
          {
            path: '/auth/rule',
            name: 'rule',
            component: () => import('@/views/auth/rule/index'),
            meta: { title: '规则管理', icon: 'tool', keepAlive: true, permission: [ 'rule' ] }
          },
          {
            path: '/auth/role',
            name: 'role',
            component: () => import('@/views/auth/role/index'),
            meta: { title: '角色管理', icon: 'tool', keepAlive: true, permission: [ 'role' ] }
          },
          {
            path: '/auth/account',
            name: 'account',
            component: () => import('@/views/auth/account/index'),
            meta: { title: '管理员管理', icon: 'tool', keepAlive: true, permission: [ 'account' ] }
          }
        ]
      }
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
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
