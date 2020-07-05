<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-skeleton :loading="id ? loading : false">
      <a-form :form="form">
        <a-form-item
          label="登录账号"
          hasFeedback
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 11}, sm: {span: 17} }"
        >
          <a-input
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
            :placeholder="id ? '请入登录密码' : '如需修改密码请输入新密码'"
            v-decorator="[
              'password',
              {
                rules: [{ required: !id ? true : false, message: '请输入登录密码!' }]
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
            :treeData="depts"
            placeholder="请选择角色"
            treeDefaultExpandAll
            @select="changeDeptTree"
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
          <a-select
            mode="multiple"
            placeholder="请选择角色"
            v-decorator="[
              'roles',
              {
                rules: [{ required: true, message: '请选择角色!' }]
              }
            ]"
          >
            <template v-for="role in roles">
              <a-select-option v-if="role.pid !== 0" :value="role.id" :key="role.id">{{ role.title }}</a-select-option>
            </template>
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
            placeholder="请选择"
            v-decorator="[
              'posts',
              {
                rules: [{ required: false, message: '请选择岗位!' }]
              }
            ]"
          >
            <a-select-option v-for="post in posts" :key="post.id">
              {{ post.name }}
            </a-select-option>
          </a-select>
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
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button v-action:SaveCreateAccountView|SaveUpdateAccountView @click="handleSubmit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px" @click="$router.go(-1)">返回</a-button>
        </a-form-item>
      </a-form>
    </a-skeleton>
  </a-card>
</template>

<script>
import { getAccount, fetchData, createAccount, updateAccount } from '@/api/account'

export default {
  data () {
    return {
      loading: false,
      roles: [],
      posts: [],
      depts: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'AccountForm' })
  },
  mounted () {
    this.loading = true
    fetchData().then((res) => {
      const { depts, posts, roles } = res.result
      this.depts = depts
      this.posts = posts
      this.roles = roles
      if (this.id) {
        this.getInfo(this.id)
      } else {
        this.loading = false
      }
    })
  },
  computed: {
    id () {
      if (this.$route.params === undefined) {
        return false
      }
      return this.$route.params.id
    }
  },
  methods: {
    changeTree (value, node, extra) {
      if (node.dataRef.children.length > 0) {
        this.$message.info('不能选择父节点')
        return false
      }

      return true
    },
    changeDeptTree (value, node, extra) {
      if (!this.changeTree(value, node, extra)) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            dept_id: null
          })
        })
      }
    },
    changeRoleTree (value, node, extra) {
      if (!this.changeTree(value, node, extra)) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            roles: null
          })
        })
      }
    },
    getInfo (id) {
      getAccount(id).then(res => {
        const { result } = res
        this.loading = false
        this.$nextTick(() => {
          this.form.setFieldsValue({
            name: result.name,
            nickname: result.nickname,
            dept_id: result.dept_id,
            roles: result.roles.map(item => item.id),
            posts: result.posts[0] ? result.posts[0].id : '',
            status: result.status
          })
        })
      })
    },
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          const promise = !this.id ? createAccount(values) : updateAccount(this.id, values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(this.selected === 0 ? '添加成功！' : '更新成功！')
            this.$router.back(-1)
          }).finally(() => {
            hide()
          })
        }
      })
    }
  }
}
</script>
