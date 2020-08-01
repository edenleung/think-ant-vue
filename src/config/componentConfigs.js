import { BasicLayout, UserLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const Components = {
  // 基础页面 layout 必须引入
  Layout: {
    BasicLayout,
    UserLayout,
    RouteView,
    BlankLayout,
    PageView
  },
  // 普通页面
  Page: {
    Analysis: () => import(/* webpackChunkName: "Analysis" */ '@/views/dashboard/Analysis'),
    Workplace: () => import(/* webpackChunkName: "Workplace" */ '@/views/dashboard/Workplace'),
    Permission: () => import(/* webpackChunkName: "Permission" */ '@/views/system/permission/Index'),
    Role: () => import(/* webpackChunkName: "Role" */ '@/views/system/role/Index'),
    Account: () => import(/* webpackChunkName: "Account" */ '@/views/system/user/Index'),
    AccountForm: () => import(/* webpackChunkName: "AccountForm" */ '@/views/system/user/components/User'),
    Dept: () => import(/* webpackChunkName: "Dept" */ '@/views/system/dept/Index'),
    LogAccount: () => import(/* webpackChunkName: "LogAccount" */ '@/views/log/Index'),
    LogDb: () => import(/* webpackChunkName: "LogDb" */ '@/views/log/Db'),
    WangEditor: () => import(/* webpackChunkName: "WangEditor" */ '@/views/editor/WangEditor'),
    Quill: () => import(/* webpackChunkName: "Quill" */ '@/views/editor/Quill'),
    Post: () => import(/* webpackChunkName: "Post" */ '@/views/system/post/Index'),
    Center: () => import(/* webpackChunkName: "Center" */ '@/views/account/center/Index'),
    Settings: () => import(/* webpackChunkName: "Settings" */ '@/views/account/settings/Index'),
    BaseSettings: () => import(/* webpackChunkName: "BaseSettings" */ '@/views/account/settings/BaseSetting'),
    SecuritySettings: () => import(/* webpackChunkName: "SecuritySettings" */ '@/views/account/settings/Security'),
    CustomSettings: () => import(/* webpackChunkName: "CustomSettings" */ '@/views/account/settings/Custom'),
    BindingSettings: () => import(/* webpackChunkName: "BindingSettings" */ '@/views/account/settings/Binding'),
    NotificationSettings: () => import(/* webpackChunkName: "NotificationSettings" */ '@/views/account/settings/Notification'),

    // 权限测试
    TestNotAjax: () => import(/* webpackChunkName: "TestNotAjax" */ '@/views/test/NotAjax'),
    Form: () => import(/* webpackChunkName: "Form" */ '@/views/test/Form'),
    CreateForm: () => import(/* webpackChunkName: "CreateForm" */ '@/views/test/components/CreateForm'),

    Article: () => import(/* webpackChunkName: "Article" */ '@/views/article/Index'),
    ArticleForm: () => import(/* webpackChunkName: "ArticleForm" */ '@/views/article/components/Article'),
    ArticleCategory: () => import(/* webpackChunkName: "ArticleCategory" */ '@/views/article/Category'),
    ArticleCategoryForm: () => import(/* webpackChunkName: "ArticleCategoryForm" */ '@/views/article/components/Category')
  }
}
