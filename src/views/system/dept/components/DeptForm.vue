<template>
  <a-modal
    title="详情"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="500"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')">
    <a-form :form="form">
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-input
          placeholder="公司/部门名称"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入公司/部门名称!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="所属上级" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-tree-select
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          placeholder="选择所属上级"
          treeDefaultExpandAll
          v-decorator="[
            'pid',
            {
              rules: [{ required: true, message: '请选择所属上级!' }]
            }
          ]"
        >
        </a-tree-select>
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
    treeData: {
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
    this.form = this.$form.createForm(this, { name: 'from' })
  }
}
</script>
