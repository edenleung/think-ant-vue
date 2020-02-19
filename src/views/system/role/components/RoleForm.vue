<template>
  <a-modal
    title="详情"
    :width="650"
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

        <template v-for="(item, index) in rules">
          <a-row :key="index" v-if="item.actions.length">
            <a-col :xl="4" :lg="24">
              {{ item.title }}：
            </a-col>
            <a-col :xl="20" :lg="24">
              <a-checkbox
                :indeterminate="item.indeterminate"
                :checked="item.checkedAll"
                @change="$emit('checkAllActionChange', $event, item)"
              >
                全选
              </a-checkbox>

              <a-checkbox-group @change="$emit('changeAction', item)" v-model="item.selected">
                <a-checkbox :value="action.id" :disabled="action.disabled" v-for="(action, i) in item.actions" :key="i">{{
                  action.title
                }}</a-checkbox>
              </a-checkbox-group>
            </a-col>
          </a-row>
        </template>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
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
      wrapperCol: { span: 20 }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'role_from' })
  }
}
</script>
