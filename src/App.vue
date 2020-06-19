<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  }
}
</script>
<style>
  #app {
    height: 100%;
  }

  .ant-card-body .tools {
    margin-bottom: 15px
  }

  .rule-list {
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 12px;
    min-height: 23px;
  }

  .ant-pro-table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 24px;
    line-height: 64px;
  }
  .ant-pro-table-toolbar-title {
    flex: 1 1;
    color: #000;
    font-size: 16px;
    line-height: 24px;
    opacity: .85;
  }
  .ant-pro-table-toolbar-option {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .ant-pro-table-toolbar-item {
    margin-right: 8px;
  }
  .ant-pro-table-toolbar-item-icon {
    font-size: 16px;
    cursor: pointer;
  }
  .ant-table-wrapper .anticon {
    font-size: 12px;
  }
  .ant-pro-table-search {
    margin-bottom: 16px;
    padding: 24px 24px 0;
    background: #fff;
  }
  .ant-pro-table-search .ant-form-item {
    display: flex;
    flex: 1 1
  }
  .ant-pro-table-search .ant-form-item-control-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 1;
  }
  .ant-pro-table-search .ant-space-align-center {
    align-items: center;
  }
  .ant-pro-table-search .ant-pro-table-search-option .ant-form-item-control {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
  }
  .ant-pro-table-search .ant-space {
    display: inline-flex;
  }
  .ant-pro-table-search .ant-form-item-control-input-content {
    flex: auto;
    max-width: 100%;
  }
  .antd-pro-pages-profile-basic-style-title {
    margin-bottom: 16px;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
  }
</style>
