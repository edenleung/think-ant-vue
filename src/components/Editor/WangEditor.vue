<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String
    },
    customConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      editor: null,
      content: ''
    }
  },
  watch: {
    value (value) {
      if (value !== this.content) {
        this.editor.txt.html(value)
      }
    }
  },
  mounted () {
    this.initEditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    initEditor () {
      this.editor = new WEditor(this.$refs.editor)
      this.editor.onchangeTimeout = this.timeout
      this.editor.customConfig = { ...this.customConfig }
      this.editor.customConfig.onchange = (html) => {
        this.content = html
        this.$emit('change', html)
      }
      this.editor.create()
    }
  }
}
</script>

<style lang="less">
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
    .w-e-toolbar {
      flex-wrap: wrap;
    }
  }
}
</style>
