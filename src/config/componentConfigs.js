import { BasicLayout, UserLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const Components = {
  // 基础页面 layout 必须引入
  'Layout': {
    BasicLayout,
    UserLayout,
    RouteView,
    BlankLayout,
    PageView
  },
  // 普通页面
  'Page': {
    'Analysis': () => import('@/views/dashboard/Analysis'),
    'Workplace': () => import('@/views/dashboard/Workplace'),
    'Permission': () => import('@/views/system/permission/Index'),
    'Role': () => import('@/views/system/role/Index'),
    'Account': () => import('@/views/system/user/Index'),
    'AccountForm': () => import('@/views/system/user/components/User'),
    'Dept': () => import('@/views/system/dept/Index'),
    'LogAccount': () => import('@/views/log/Index'),
    'LogDb': () => import('@/views/log/Db'),
    'WangEditor': () => import('@/views/editor/WangEditor'),
    'Quill': () => import('@/views/editor/Quill'),
    'Post': () => import('@/views/system/post/Index'),
    'Center': () => import('@/views/account/center/Index'),
    'Settings': () => import('@/views/account/settings/Index'),
    'BaseSettings': () => import('@/views/account/settings/BaseSetting'),
    'SecuritySettings': () => import('@/views/account/settings/Security'),
    'CustomSettings': () => import('@/views/account/settings/Custom'),
    'BindingSettings': () => import('@/views/account/settings/Binding'),
    'NotificationSettings': () => import('@/views/account/settings/Notification'),

    // 权限测试
    'TestNotAjax': () => import('@/views/test/NotAjax'),
    'Form': () => import('@/views/test/Form'),
    'CreateForm': () => import('@/views/test/components/CreateForm'),

    'Article': () => import('@/views/article/Index'),
    'ArticleForm': () => import('@/views/article/components/Article'),
    'ArticleCategory': () => import('@/views/article/Category'),
    'ArticleCategoryForm': () => import('@/views/article/components/Category')
  }
}
