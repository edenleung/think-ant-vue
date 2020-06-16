<template>
  <div class="page-header-index-wide">
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" @submit="handleSubmit">
      <a-form-item label="上传图片">
        <a-upload
          name="file"
          accept="image/*"
          list-type="picture-card"
          :show-upload-list="false"
          action="action"
          :before-upload="beforeUpload"
          :data="{ token: uploadConfig.token }"
          :fileList="fileList"
          @change="handleChange"
          v-decorator="[
            'image',
            { rules: [{ required: true, message: '请上传图片!' }] },
          ]"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width:100px;height:100px" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getQiniuConfig } from '@/api/project'
export default {
  data () {
    return {
      loading: false,
      action: 'http://upload-z2.qiniup.com',
      fileList: [],
      imageUrl: '',
      uploadConfig: {},
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  async mounted () {
    await getQiniuConfig().then(res => {
      // { result: { domain: 'http://cdn.domain.com', token: 'xxxxx.xxxxx.xxxxx' }}
      this.uploadConfig = res.result
    })
  },
  methods: {
    beforeUpload () {},
    handleChange (info) {
      let fileList = [...info.fileList]
      // 限制上传数量 只上传一张
      // fileList = fileList.slice(-1)
      const { domain } = this.uploadConfig
      const that = this
      fileList = fileList.map(file => {
        if (file.response) {
          const imageUrl = domain + file.response.key
          that.imageUrl = imageUrl
          file.url = imageUrl
        }
        return file
      })

      this.fileList = fileList
    },
  }
}
</script>

<style lang="scss" scoped>
.article-image {
  max-width: 25px;
  max-height: 25px;
}
</style>
