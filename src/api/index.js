const api = {
  Login: '/admin/auth/login',
  Logout: '/admin/auth/logout',
  RefreshToken: '/admin/auth/refresh_token',
  ForgePassword: '/admin/auth/forge-password',
  Register: '/admin/auth/register',
  twoStepCode: '/admin/auth/2step-code',
  SendSms: '/admin/account/sms',
  SendSmsErr: '/admin/account/sms_err',
  // get my info
  UserInfo: '/admin/user/info',

  Role: '/admin/role',
  Permission: '/admin/permission',
  User: '/admin/user',
  UserCurrent: '/admin/user/current',
  ResetPassword: '/admin/user/reset-password',
  Avatar: '/admin/user/avatar',
  Dept: '/admin/system/dept',
  Post: '/admin/system/post',
  Log: {
    Acount: '/admin/log/acount',
    Db: '/admin/log/db'
  },
  ArticleCategory: '/admin/article/category',
  Article: '/admin/article'
}
export default api
