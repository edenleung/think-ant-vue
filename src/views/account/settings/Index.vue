<template>
  <div class="account-settings-info-main" ref="main">
    <div class="account-settings-info-leftMenu">
      <a-menu
        :mode="mode"
        :selectedKeys="selectedKeys"
        @openChange="onOpenChange"
      >
        <a-menu-item key="/account/settings/base">
          <router-link :to="{ name: 'BaseSettings' }">
            基本设置
          </router-link>
        </a-menu-item>
        <a-menu-item key="/account/settings/security">
          <router-link :to="{ name: 'SecuritySettings' }">
            安全设置
          </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="/account/settings/custom">
          <router-link :to="{ name: 'CustomSettings' }">
            个性化
          </router-link>
        </a-menu-item>
        <a-menu-item key="/account/settings/binding">
          <router-link :to="{ name: 'BindingSettings' }">
            账户绑定
          </router-link>
        </a-menu-item>
        <a-menu-item key="/account/settings/notification">
          <router-link :to="{ name: 'NotificationSettings' }">
            新消息通知
          </router-link>
        </a-menu-item> -->
      </a-menu>
    </div>
    <div class="account-settings-info-right">
      <div class="account-settings-info-title">
        <span>{{ $route.meta.title }}</span>
      </div>
      <route-view></route-view>
    </div>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
export default {
  components: {
    RouteView,
    PageView
  },
  data () {
    return {
      mode: 'inline',
      openKeys: [],
      selectedKeys: []
    }
  },
  created () {
    this.updateMenu()
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize () {
      if (!this.$refs.main) {
        return
      }
      const { offsetWidth } = this.$refs.main
      let mode = 'inline'
      if (this.$refs.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal'
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal'
      }
      this.mode = mode
    },
    onOpenChange (openKeys) {
      this.openKeys = openKeys
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      this.selectedKeys = [ routes.pop().path ]
    }
  },
  watch: {
    '$route' (val) {
      this.updateMenu()
    }
  }
}
</script>

<style lang="less" scoped>
  .account-settings-info {
    &-main {
      display: flex;
      width: 100%;
      height: 100%;
      padding-top: 16px;
      padding-bottom: 16px;
      overflow: auto;
      background-color: #fff;
    }

    &-leftMenu {
      width: 224px;
      border-right: 1px solid #e8e8e8;
      :global {
        .ant-menu-inline {
          border: none;
        }
        .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
          font-weight: bold;
        }
      }
    }

    &-right {
      flex: 1;
      padding-top: 8px;
      padding-right: 40px;
      padding-bottom: 8px;
      padding-left: 40px;
    }

    &-title {
      margin-bottom: 12px;
      color: rgba(0,0,0,.85);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }

  @media screen and (max-width: 768px) {
    .account-settings-info {
      &-main {
        flex-direction: column;
      }
      &-right {
        padding: 40px;
      }
      &-leftMenu {
        width: 100%;
      }
    }
  }
</style>
