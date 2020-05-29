## ThinkPHP Ant Design Pro Vue

[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/edenleung/think-ant-vue.svg?branch=master)](https://travis-ci.org/edenleung/think-ant-vue)

ThinkPHP 6.0 与 Ant Design Pro Vue 基础权限系统  

后端: https://github.com/xiaodit/think-admin  

预览地址: 
 * http://ant.wfunc.com
 * ~~https://ant-design-vue-edenleung.cloud.okteto.net~~
 
开发文档：http://doc.wfunc.com

Ant Design Vue Pro 文档: https://pro.loacg.com/docs/getting-started

~~服务器提供：[okteto](https://okteto.com)~~

### 预览账号
* 超级管理员 `admin, 1234`

### 前端部署
#### 安装
```
yarn
```
#### 预览
```
yarn serve
```
#### 打包
打包后的文件位于 `/dist/`
```
npm run build
```
#### 刷新404问题
```nginx

location / {
  try_files $uri $uri/ /index.html last;
}

```
#### 后端API配置
[本地测试-修改此处](https://github.com/edenleung/think-ant-vue/blob/master/.env.development#L3)
[生产部署-修改此处](https://github.com/edenleung/think-ant-vue/blob/master/.env.production#L3)
