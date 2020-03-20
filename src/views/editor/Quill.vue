<template>
  <div>
    <a-card title="发布文章">
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
        <a-form-item label="文章内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <QuillEditor
            v-decorator="[
              'content',
              { initialValue: '', rules: [{ required: true, message: '请填写文章内容!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            发布
          </a-button>
          <a-divider type="vertical" />
          <a-button type="primary" @click="changeContent">
            设置文章内容
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="表单内容" style="margin-top:15px">
      <code>{{ form.getFieldsValue() }}</code>
    </a-card>
  </div>
</template>

<script>
import QuillEditor from '@/components/Editor/QuillEditor'
export default {
  data () {
    return {
      description: '来发表一章文章吧',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      defaultHtml: `
        <h1><strong style="color: rgb(68, 68, 68);">Ant Design Vue Pro</strong></h1>
      `
    }
  },
  components: { QuillEditor },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    changeContent () {
      this.form.setFieldsValue({
        content: this.defaultHtml
      })
    }
  }
}
</script>
