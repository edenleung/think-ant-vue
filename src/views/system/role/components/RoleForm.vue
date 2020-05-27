<template>
  <a-modal
    title="详情"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')"
  >
    <a-form :form="form">
      <a-form-item label="唯一识别码" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          placeholder="请入唯一识别码（英文即可）"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入唯一识别码!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="上级管理员" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-tree-select
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="选择上级管理员"
          allowClear
          treeDefaultExpandAll
          @change="$emit('changeRole', $event)"
          :treeData="treeData"
          v-decorator="[
            'pid',
            {
              rules: [{ required: true, message: '请选择上级管理员!' }]
            }
          ]"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item label="角色名称" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          placeholder="请入角色名称"
          v-decorator="[
            'title',
            {
              rules: [{ required: true, message: '请输入角色名称!' }]
            }
          ]"
        />
      </a-form-item>

      <a-form-item label="状态" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-select
          v-decorator="[
            'status',
            {
              rules: [{ required: true, message: '请选择状态!' }]
            }
          ]"
          placeholder="请选择"
        >
          <a-select-option :value="1">
            启用
          </a-select-option>
          <a-select-option :value="0">
            禁用
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-divider v-if="form.getFieldValue('pid')">拥有权限</a-divider>
      <a-form-item label="" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }" v-show="form.getFieldValue('pid')">
        <a-table :columns="columns" :dataSource="rules" :pagination="false">
          <span slot="permission" slot-scope="row">
            <a-checkbox-group @change="$emit('changeAction', row)" v-model="row.selected">
              <a-checkbox :value="action.id" :disabled="action.disabled" v-for="(action, i) in row.actions" :key="i">{{
                action.title
              }}</a-checkbox>
            </a-checkbox-group>
          </span>

          <span slot="checkAll" slot-scope="row">
            <a-checkbox
              :indeterminate="row.indeterminate"
              :checked="row.checkedAll"
              @change="$emit('checkAllActionChange', $event, row)"
            ></a-checkbox>
          </span>
        </a-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '操作对象',
    dataIndex: 'title'
  },
  {
    title: '权限',
    scopedSlots: { customRender: 'permission' }
  },
  {
    title: '全选',
    scopedSlots: { customRender: 'checkAll' }
  }
]

export default {
  props: {
    rules: {
      type: Array,
      default: () => {
        return []
      }
    },
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
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      columns
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'role_from' })
  }
}
</script>
