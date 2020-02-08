## ThinkPHP Ant Design Pro Vue

[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/edenleung/think-ant-vue.svg?branch=master)](https://travis-ci.org/edenleung/think-ant-vue)

ThinkPHP 6.0 与 Ant Design Pro Vue 基础权限系统  

后端: https://github.com/xiaodit/think-admin  
前端: https://github.com/sendya/ant-design-pro-vue

预览地址: https://ant.wfunc.com  
开发文档：https://doc.wfunc.com

Ant Design Vue Pro 文档: https://pro.loacg.com/docs/getting-started

### 账号
* 超级管理员 `admin, 1234`

### 前端部署
#### 安装
```
npm install
```
#### 预览
```
npm run serve
```
#### 打包
```
npm run build
```
#### 刷新404问题
```nginx
try_files $uri $uri/ /index.html last;
```
#### 后端API配置
[本地测试-修改此处](https://github.com/edenleung/think-ant-vue/blob/master/.env.development#L3)
[生产部署-修改此处](https://github.com/edenleung/think-ant-vue/blob/master/.env.production#L3)
