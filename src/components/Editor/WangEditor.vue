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
    value: {
      type: String,
      default: ''
    },
    customConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    timeout: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      editor: null,
      editorContent: null
    }
  },
  watch: {
    value (value) {
      if (value !== this.editor.txt.html()) {
        this.editorContent = value
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
        this.editorContent = html
        this.$emit('change', this.editorContent)
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
