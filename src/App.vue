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
<style lang="sass">
  #app
    height: 100%
    .ant-card-body
      .tools
        margin-bottom: 15px
      .rule-list
        padding-left: 12px
        padding-right: 12px
        margin-bottom: 12px
        min-height: 23px
</style>
