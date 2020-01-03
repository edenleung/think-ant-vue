<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
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
</style>
