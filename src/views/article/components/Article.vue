<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-skeleton :loading="id ? loading : false">
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
              'category_id',
              { rules: [{ required: true, message: '请选择文章栏目!' }] },
            ]"
            placeholder="选择文章栏目"
          >
            <a-select-option :disabled="category.pid === 0" :value="category.id" v-for="category in categorys" :key="category.id"><span v-html="category.fulltitle" /></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="文章内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <WangEditor
            :customConfig="customConfig"
            v-decorator="[
              'content',
              { initialValue: '', rules: [{ required: true, message: '请选择文章内容!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            发布
          </a-button>
        </a-form-item>
      </a-form>
    </a-skeleton>
  </a-card>
</template>

<script>
import WangEditor from '@/components/Editor/WangEditor'
import { fetchArticleCategory, createArticle, updateArticle, getArticle } from '@/api/article'
export default {
  data () {
    return {
      description: '来发表一章文章吧',
      form: this.$form.createForm(this, { name: 'artcile' }),
      html: '',
      defaultHtml: '',
      customConfig: {
        uploadImgShowBase64: true,
        zIndex: 1
      },
      categorys: [],
      loading: false
    }
  },
  components: { WangEditor },
  mounted () {
    fetchArticleCategory().then(res => {
      this.categorys = res.result
    })

    if (this.id !== undefined) {
      this.loading = true
      getArticle(this.id).then(res => {
        this.loading = false
        this.form.setFieldsValue({ ...res.result })
        console.log(res.result)
      })
    }
  },
  computed: {
    id () {
      if (this.$route.params && this.$route.params.id) {
        return this.$route.params.id
      }

      return 0
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const promise = this.id === 0 ? createArticle(values) : updateArticle(this.id, values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(this.id === 0 ? '添加成功！' : '更新成功！')
            this.$router.back(-1)
          }).finally(() => {
            hide()
          })
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
