## ThinkPHP Ant Design Pro Vue

[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/xiaodit/think-ant-vue.svg?branch=master)](https://travis-ci.org/xiaodit/think-ant-vue)

ThinkPHP 5.1 与 Ant Design Pro Vue 基础权限系统  

后端: https://github.com/xiaodit/think-admin  

预览地址: https://ant.xiaodim.com

文档: https://pro.loacg.com/docs/getting-started

### 账号
* 超级管理员 `admin, 1234` 
* 普通管理员 `test, 1234`

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
[修改此处](https://github.com/xiaodit/think-ant-vue/blob/master/src/utils/request.js#L14)
