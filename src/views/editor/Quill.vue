<template>
  <a-card>
    <quill v-model="html" />
    <a-divider />
  </a-card>
</template>

<script>
import Quill from '@/components/Editor/QuillEditor'
export default {
  data () {
    return {
      description: '来发表一章文章吧',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      html: `
        <h1><strong style="color: rgb(68, 68, 68);">Ant Design Vue Pro</strong></h1>
      `
    }
  },
  components: { Quill },
  methods: {
    handleChange (html) {
      console.log('change', html)
      this.html = html
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>
