<template>
  <a-modal
    title="分配数据权限"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')"
  >
    <a-form :form="form">
      <a-form-item label="唯一识别码" hasFeedback>
        <a-input read-only v-decorator="['name']" />
      </a-form-item>

      <a-form-item label="角色名称" hasFeedback>
        <a-input read-only v-decorator="['title']" />
      </a-form-item>

      <a-form-item label="数据范围">
        <a-select
          v-decorator="[
            'mode',
            {
              rules: [{ required: true, message: '请输入角色名称!' }]
            }
          ]"
        >
          <a-select-option :value="1">全部数据权限</a-select-option>
          <a-select-option :value="2">自定义数据权限</a-select-option>
          <a-select-option :value="3">本部门数据权限</a-select-option>
          <a-select-option :value="4">本部门及以下数据权限</a-select-option>
          <a-select-option :value="5">仅本人数据权限</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="数据权限" v-show="form.getFieldValue('mode') === 2">
        <a-tree
          checkable
          :treeData="treeData"
          :autoExpandParent="true"
          :showLine="true"
          v-decorator="[
            'deptIds',
            {
              valuePropName: 'deptIds',
              trigger: 'check',
              validateTrigger: 'check',
              rules: [{ required: false, message: '请选择数据权限!' }]
            }
          ]"
        />
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
    defaultExpandedKeys: {
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
  created () {
    this.form = this.$form.createForm(this, { name: 'data_access_form' })
  }
}
</script>
