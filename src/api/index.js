const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  RefreshToken: '/auth/refresh_token',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',

  Role: '/role',
  Rule: '/rule',
  User: '/user',

  Log: {
    Acount: '/log/acount',
    Db: '/log/db'
  }
}
export default api
