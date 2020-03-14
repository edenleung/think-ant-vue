<template>
  <span
    @click="enterSearchMode"
    class="headerSearch"
  >
    <a-icon type="search" key="Icon" />
    <a-auto-complete
      ref="autoComplete"
      v-model="value"
      :defaultActiveFirstOption="defaultActiveFirstOption"
      :dataSource="dataSource"
      class="input"
      :class="{ show: searchMode }"
      @select="onSelect"
      @search="handleSearch"
      @blur="leaveSearchMode"
      :placeholder="placeholder"
      @keyup.enter="handleEnter"
    />
  </span>
</template>

<script>
export default {
  props: {
    defaultActiveFirstOption: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '站内搜索'
    },
    defaultOpen: {
      type: Boolean,
      default: false,
      required: false
    },
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      searchMode: this.defaultOpen,
      value: ''
    }
  },
  mounted () {
  },
  methods: {
    onSearch (value) {
      this.$emit('onSearch', value)
    },
    enterSearchMode () {
      this.$emit('onVisibleChange', true)
      this.searchMode = true
      this.$refs.autoComplete.focus()
    },
    handleSearch (value) {
      this.$emit('onSearch', value)
    },
    onSelect (value) {
      this.$emit('onSelect', value)
    },
    leaveSearchMode () {
      this.searchMode = false
      this.value = ''
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
