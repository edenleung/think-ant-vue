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
        <a-form-item label="文章分类" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
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
        <a-form-item label="是否置顶" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-decorator="[
              'top',
              { rules: [{ required: true, message: '请选择是否置顶!' }] },
            ]"
            placeholder="选择是否置顶"
          >
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="封面图片" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :action="baseUrl + '/api/upload/file'"
            :headers="headers"
            :before-upload="beforeUpload"
            @change="handleChange"
            v-decorator="[
              'image',
              { rules: [{ required: true, message: '请上传封面图!' }] },
            ]"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="uploading ? 'loading' : 'plus'" />
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="文章内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <WangEditor
            :customConfig="customConfig"
            v-decorator="[
              'content',
              { initialValue: '', rules: [{ required: true, message: '请选择文章内容!' }] },
            ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button v-action:SaveUpdateArticleView|SaveCreateArticleView type="primary" html-type="submit">
            发布
          </a-button>
        </a-form-item>
      </a-form>
    </a-skeleton>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import WangEditor from '@/components/Editor/WangEditor'
import { fetchArticleCategory, createArticle, updateArticle, getArticle } from '@/api/article'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

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
      loading: false,
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      headers: {
        authorization: ''
      },
      imageUrl: '',
      uploading: false
    }
  },
  components: { WangEditor },
  created () {
    this.headers.authorization = 'Bearer ' + this.token
  },
  mounted () {
    fetchArticleCategory().then(res => {
      this.categorys = res.result
    })

    if (this.id) {
      this.loading = true
      getArticle(this.id).then(res => {
        this.loading = false
        console.log(res.result)
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...res.result })
        })
        this.imageUrl = this.baseUrl + '/' + res.result.image
      })
    }
  },
  computed: {
    ...mapGetters(['token']),
    id () {
      if (this.$route.params && this.$route.params.id) {
        return this.$route.params.id
      }

      return false
    }
  },
  methods: {
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.uploading = true
        this.imageUrl = ''
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.uploading = false
        })

        this.$nextTick(() => {
          this.form.setFieldsValue({
            image: info.file.response.result.path
          })
        })
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('你只能上传JPG、PNG图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('不能上传超过2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const promise = !this.id ? createArticle(values) : updateArticle(this.id, values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(!this.id ? '添加成功！' : '更新成功！')
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

<style lang="scss">
.avatar-uploader img {
  max-width: 100%
}
</style>
