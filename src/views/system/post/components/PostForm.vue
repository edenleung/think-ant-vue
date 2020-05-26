<template>
  <a-modal
    title="详情"
    :visible="visible"
    :width="500"
    :confirmLoading="confirmLoading"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }"
  >
    <a-form :form="form">
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-input
          placeholder="岗位名称"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入岗位名称!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="标识" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-input
          placeholder="岗位标识"
          v-decorator="[
            'code',
            {
              rules: [{ required: true, message: '请输入岗位标识!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-input
          placeholder="排序"
          v-decorator="[
            'sort',
            {
              rules: [{ required: true, message: '请输入排序!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-select
          v-decorator="[
            'status',
            {
              rules: [{ required: true, message: '请选择状态!' }]
            }
          ]"
          placeholder="请选择"
        >
          <a-select-option :value="1">正常</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'post_from' })
  }
}
</script>
