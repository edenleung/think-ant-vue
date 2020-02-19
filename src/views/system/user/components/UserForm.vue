<template>
  <a-modal
    title="详情"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')">
    <a-form :form="form" layout="inline">
      <a-row :gutter="0">
        <a-col :span="12">
          <a-form-item label="登录账号" hasFeedback>
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
        </a-col>

        <a-col :span="12">
          <a-form-item label="登录密码" hasFeedback>
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
        </a-col>

        <a-col :span="12">
          <a-form-item label="用户昵称" hasFeedback>
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
        </a-col>

        <a-col :span="12">
          <a-form-item label="归属部门" hasFeedback>
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
        </a-col>

        <a-col :span="12">
          <a-form-item label="选择角色" hasFeedback>
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
        </a-col>

        <a-col :span="12">
          <a-form-item label="状态" hasFeedback>
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
        </a-col>

        <a-col :span="12">
          <a-form-item label="岗位" hasFeedback>
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
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    selecteId: {
      type: Number,
      default: 0
    },
    deptTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    roleTree: {
      type: Array,
      default: () => {
        return []
      }
    },
    posts: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'user_form' })
  }
}
</script>
