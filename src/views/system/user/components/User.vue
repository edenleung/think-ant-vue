<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-skeleton :loading="selected ? loading : false">
      <a-form :form="form">
        <a-form-item
          label="登录账号"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-input
            :readonly="selecteId !== 0"
            placeholder="请入登录账号"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入登录账号!' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="登录密码"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-input
            :placeholder="selecteId ? '请入登录密码' : '如需修改密码请输入新密码'"
            v-decorator="[
              'password',
              {
                rules: [{ required: selecteId === 0, message: '请输入登录密码!' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="用户昵称"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-input
            placeholder="请入用户昵称"
            v-decorator="[
              'nickname',
              {
                rules: [{ required: true, message: '请输入用户名称!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item
          label="归属部门"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="deptTree"
            style="min-width:171px"
            placeholder="请选择角色"
            treeDefaultExpandAll
            @select="$emit('deptSelect')"
            v-decorator="[
              'dept_id',
              {
                rules: [{ required: true, message: '请选择归属部门!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item
          label="选择角色"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-tree-select
            style="min-width:171px"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="roleTree"
            placeholder="请选择角色"
            treeDefaultExpandAll
            multiple
            v-decorator="[
              'roles',
              {
                rules: [{ required: true, message: '请选择角色!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item
          label="状态"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-select
            style="min-width:171px"
            v-decorator="[
              'status',
              {
                rules: [{ required: true, message: '请选择状态!' }]
              }
            ]"
            placeholder="请选择"
          >
            <a-select-option :value="1">
              正常
            </a-select-option>
            <a-select-option :value="0">
              禁用
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="岗位"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-select
            style="min-width:171px"
            mode="multiple"
            placeholder="请选择"
            v-decorator="[
              'posts',
              {
                rules: [{ required: false, message: '请选择岗位!' }]
              }
            ]"
          >
            <a-select-option v-for="post in posts" :key="post.post_id">
              {{ post.post_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-skeleton>
  </a-card>
</template>

<script>
import { getAccount } from '@/api/account'
import { fetchAllPost } from '@/api/post'
import { fetchAllRole } from '@/api/role'

export default {
  data () {
    return {
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'AccountForm' })
  },
  mounted () {
    if (this.id) {
      this.getInfo(this.id)
    }

    fetchAllPost().then(res => {
      console.log(res)
    })
    fetchAllRole().then(res => {
      console.log(res)
    })
  },
  computed: {
    id: function () {
      if (this.$route.param === undefined) {
        return null
      }
      const { id } = this.$route.param
      return id
    }
  },
  methods: {
    getInfo (id) {
      getAccount(id).then(res => {
        const { result } = res
        this.loading = false
        this.$nextTick(() => {
          this.form.setFieldsValue({
            ...result
          })
        })
      })
    }
  }
}
</script>
