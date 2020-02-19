<template>
  <div>
    <a-modal
      title="修改密码"
      :visible="visible"
      @ok="handleResetPassword"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form layout="vertical" :form="form">
        <a-form-item label="旧密码">
          <a-input
            v-decorator="[
              'oldPassword',
              { rules: [{ required: true, message: '请输入旧密码!' }] }
            ]"
            type="password"
            placeholder="输入旧密码" />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input
            v-decorator="[
              'newPassword',
              { rules: [{ required: true, message: '请输入新密码!' }] }
            ]"
            type="password"
            placeholder="输入新密码" />
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input
            v-decorator="[
              'confirmPassword',
              { rules: [
                { required: true, message: '请重新输入新密码!' },
                { validator: compareToFirstPassword }
              ]}
            ]"
            type="password"
            placeholder="请重新输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a v-if="$auth(item.permission)" slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
import { resetPassword } from '@/api/user'
export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'resetPassword' }),
      data: [
        { title: '账户密码', description: '当前密码强度', value: '强', 'permission': 'SecuritySettings.UpdateSecurityPassword', actions: { title: '修改', callback: () => { this.upadtePassword() } } },
        { title: '密保手机', description: '已绑定手机', value: '138****8293', 'permission': 'SecuritySettings.BindPhone', actions: { title: '修改', callback: () => { this.$message.warning('未开发功能') } } },
        { title: '密保问题', description: '未设置密保问题，密保问题可有效保护账户安全', value: '', 'permission': 'SecuritySettings.BindSecurityQuestion', actions: { title: '设置', callback: () => { this.$message.warning('未开发功能') } } },
        { title: '备用邮箱', description: '已绑定邮箱', value: 'ant***sign.com', 'permission': 'SecuritySettings.BindEmail', actions: { title: '修改', callback: () => { this.$message.warning('未开发功能') } } },
        { title: 'MFA 设备', description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '', 'permission': 'SecuritySettings.BindMFA', actions: { title: '绑定', callback: () => { this.$message.warning('未开发功能') } } }
      ]
    }
  },
  mounted () {
  },
  methods: {
    upadtePassword () {
      this.visible = true
    },
    handleResetPassword (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true
          resetPassword(values).then(res => {
            const { code, message } = res
            if (code === 20000) {
              this.$message.success(message)
              this.handleCancel()
            }
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields()
    },
    compareToFirstPassword (rule, value, cbs) {
      const form = this.form
      if (value && value !== form.getFieldValue('newPassword')) {
        cbs('新密码不一致')
      } else {
        cbs()
      }
    },
    oldPasswordError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('oldPassword') && getFieldError('oldPassword')
    },
    newPasswordError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('newPassword') && getFieldError('newPassword')
    },
    confirmPasswordError () {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('confirmPassword') && getFieldError('confirmPassword')
    }
  }
}
</script>

<style scoped>

</style>
