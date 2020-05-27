<template>
  <a-modal
    title="详情"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="500"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')">
    <a-form :form="form">
      <a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-input
          placeholder="分类名称"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入分类名称!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="所属上级" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-select
          placeholder="选择所属上级"
          treeDefaultExpandAll
          v-decorator="[
            'pid',
            {
              rules: [{ required: true, message: '请选择所属上级!' }]
            }
          ]"
        >
          <a-select-option :value="category.id" v-for="category in treeData" :key="category.id">
            <span v-html="category.fulltitle"></span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
        <a-select
          v-decorator="[
            'disable',
            {
              rules: [{ required: true, message: '请选择状态!' }]
            }
          ]"
          placeholder="请选择"
        >
          <a-select-option :value="0">正常</a-select-option>
          <a-select-option :value="1">禁用</a-select-option>
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
    this.form = this.$form.createForm(this, { name: 'category_form' })
  }
}
</script>
