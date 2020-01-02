<template>
  <a-card>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="标题" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input
          v-decorator="['title', { rules: [{ required: true, message: '请选择文章标题!' }] }]"
          placeholder="填写文章标题"
        />
      </a-form-item>
      <a-form-item label="栏目" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select
          v-decorator="[
            'category',
            { rules: [{ required: true, message: '请选择文章栏目!' }] },
          ]"
          placeholder="选择文章栏目"
        >
          <a-select-option value="male">
            male
          </a-select-option>
          <a-select-option value="female">
            female
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Gender" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <we v-model="defaultHtml" @change="handleChange" :customConfig="customConfig" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          发布
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import we from '@/components/Editor/WangEditor'
export default {
  data () {
    return {
      description: '来发表一章文章吧',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      html: '',
      defaultHtml: `
        <p>欢迎使用<b>wangEditor 富文本编辑器</b>，请输入内容...</p><p><br></p>
      `,
      customConfig: {
        uploadImgShowBase64: true,
        zIndex: 1
      }
    }
  },
  components: { we },
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
