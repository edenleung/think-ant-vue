<template>
  <div class="account-settings-info-view">
    <div class="account-settings-info-view-left">
      <a-form layout="vertical" :form="form" @submit="handleSubmit">
        <a-form-item
          label="邮箱"
          :required="false"
        >
          <a-input v-decorator="['email', { rules: [{ required: true, message: '请输入您的邮箱!' }] }]" />
        </a-form-item>

        <a-form-item
          label="昵称"
          :required="false"
        >
          <a-input v-decorator="['nickname', { rules: [{ required: true, message: '请输入您的昵称!' }] }]"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="updating" v-action:SaveProfile>更新基本信息</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="account-settings-info-view-right">
      <dir class="account-settings-info-view-avatar_title">
        <span>头像</span>
      </dir>
      <div class="account-settings-info-view-avatar">
        <a-avatar :src="avatar" style="width: 144px;height:144px" />
      </div>
      <a-upload
        name="file"
        :multiple="true"
        :action="action"
        :headers="headers"
        :showUploadList="false"
        :beforeUpload="beforeUpload"
        @change="handleChange"
      >
        <div class="account-settings-info-view-button_view">
          <a-button icon="upload" v-action:SaveAvatar>
            {{ uploading ? '上传中' : '更换头像' }}
          </a-button>
        </div>
      </a-upload>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '@/api/index'
import { updateCurrent } from '@/api/user'

export default {
  data () {
    return {
      loading: true,
      updating: false,
      uploading: false,
      action: process.env.VUE_APP_API_BASE_URL + api.Avatar,
      headers: {
        authorization: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'token', 'avatar'])
  },
  created () {
    this.headers.authorization = 'Bearer ' + this.token
    this.form = this.$form.createForm(this, {
      mapPropsToFields: () => {
        return {
          email: this.$form.createFormField({
            value: this.userInfo.email
          }),
          nickname: this.$form.createFormField({
            value: this.userInfo.nickname
          })
        }
      }
    })
  },
  methods: {
    ...mapMutations(['SET_AVATAR', 'SET_NAME']),

    beforeUpload () {
      this.uploading = true
    },
    handleChange (r) {
      if (r.file.response !== undefined) {
        this.uploading = false
        const { code, result } = r.file.response
        if (code === 20000) {
          this.$message.success('更换头像成功')
          this.SET_AVATAR(result)
        }
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updating = true
          const hide = this.$message.loading('更新中..', 0)
          updateCurrent(values).then(res => {
            this.$message.success('更新成功')
            this.SET_NAME(values.nickname)
          }).finally(() => {
            hide()
            this.updating = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .account-settings-info-view {
    display: flex;
    padding-top: 12px;
  }
  .account-settings-info-view- {
    &button_view {
      width: 144px;
      text-align: center;
    }
    &avatar_title {
      height: 22px;
      margin-bottom: 8px;
      color: rgba(0,0,0,.85);
      font-size: 14px;
      padding-left: 0;
      margin-top: 0;
      line-height: 22px;
    }
    &left {
      min-width: 224px;
      max-width: 448px;
    }
    &right {
      flex: 1 1;
      padding-left: 104px;
    }
    &avatar {
      width: 144px;
      height: 144px;
      margin-bottom: 12px;
      overflow: hidden;
        img {
          width: 100%;
        }
    }
  }

  @media screen and (max-width: 1200px) {
    .account-settings-info-view {
      flex-direction: column-reverse;
    }
    .account-settings-info-view-avatar_title {
      display: none
    }
    .account-settings-info-view-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 448px;
      padding: 20px;
    }
  }
</style>
