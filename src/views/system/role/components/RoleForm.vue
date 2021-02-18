<template>
  <a-card>
    <a-skeleton :loading="loading">
      <a-form :form="form" @submit="handleSubmit">
        <!-- <a-form-item label="上级管理员" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
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
                rules: [{ required: true, message: '请选择上级管理员!' }],
              },
            ]"
          >
          </a-tree-select>
        </a-form-item> -->

        <a-form-item label="角色名称" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            placeholder="请入角色名称"
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: '请输入角色名称!' }],
              },
            ]"
          />
        </a-form-item>

        <a-form-item label="状态" hasFeedback :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-select
            v-decorator="[
              'status',
              {
                rules: [{ required: true, message: '请选择状态!' }],
              },
            ]"
            placeholder="请选择"
          >
            <a-select-option :value="1"> 启用 </a-select-option>
            <a-select-option :value="0"> 禁用 </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-button type="primary" html-type="submit"> Submit </a-button>
        </a-form-item>

        <a-divider>拥有权限</a-divider>
        <a-form-item label="" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
          <a-table
            rowKey="id"
            :loading="configLoading"
            :columns="columns"
            :defaultExpandAllRows="true"
            :dataSource="menus"
            :pagination="false"
          >
            <span slot="permission" slot-scope="row">
              <a-checkbox-group @change="changeAction(row)" v-model="row.selected">
                <a-checkbox
                  :value="action.id"
                  :disabled="action.disabled"
                  v-for="action in row.actions"
                  :key="action.id"
                  >{{ action.title }}</a-checkbox
                >
              </a-checkbox-group>
            </span>

            <span slot="checkAll" slot-scope="row">
              <a-checkbox
                v-if="row.type === 'menu'"
                :indeterminate="row.indeterminate"
                :checked="row.checkedAll"
                @change="checkAllActionChange($event, row)"
              ></a-checkbox>
            </span>
          </a-table>
        </a-form-item>
      </a-form>
    </a-skeleton>
  </a-card>
</template>

<script>
import { getRole, getConfig, addRole, updateRole } from '@/api/role'
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
  data () {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      columns,
      expandedRowKeys: [],
      loading: false,
      menus: [],
      selectedIds: [],
      configLoading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'role_from' })
  },
  async mounted () {
    if (this.id) {
      await this.fetch(this.id)
    }

    this.configLoading = true
    getConfig().then(res => {
      const { actionsIds, data } = res.result
      this.actionsIds = actionsIds
      this.initMenu(data)
      this.configLoading = false
    })
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    async fetch (id) {
      this.loading = true
      getRole(id).then(res => {
        const { info, actions } = res.result
        this.form.setFieldsValue({
          'title': info.title,
          'status': info.status
        })
        this.selectedIds = actions
        this.loading = false
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.actions = this.selectedIds
          const promise = this.id ? updateRole(this.id, values) : addRole(values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(!this.id ? '添加成功！' : '更新成功！')
          }).finally(() => {
            hide()
          })
        }
      })
    },
    initMenu (data) {
      if (this.selectedIds.length) {
        data = this.checkAction(data)
      }
      this.menus = data
    },
    checkAction (data) {
      for (const i in data) {
        if (data[i].type === 'menu') {
          for (const ii in data[i].actions) {
            const id = data[i].actions[ii].id
            if (this.selectedIds.indexOf(id) !== -1) {
              data[i].selected.push(id)
            }

            data[i].indeterminate = !!data[i].selected.length && (data[i].selected.length < data[i].actions.length)
            data[i].checkedAll = data[i].selected.length === data[i].actions.length
          }
        }

        if (data[i].children !== undefined) {
          data[i] = { ...data[i], ...this.checkAction(data[i].children) }
        }
      }

      return data
    },
    changeAction (row) {
      let notDisabledLen = 0
      row.actions.map(action => {
        if (action.disabled === false) {
          notDisabledLen = notDisabledLen + 1
        }
      })
      row.indeterminate = !!row.selected.length && (row.selected.length < notDisabledLen)
      row.checkedAll = row.selected.length === notDisabledLen
      this.menus = [...this.menus]
      this.handleSelected()
    },
    checkAllActionChange (e, row) {
      // 记录有权限的操作
      const hasPermissionAction = []
      row.actions.map(action => {
        if (action.disabled === false) {
          hasPermissionAction.push(action.id)
        }
      })
      Object.assign(row, {
        selected: e.target.checked ? hasPermissionAction : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
      this.menus = [...this.menus]
      this.handleSelected()
    },
    handleSelected () {
      this.selectedIds = this.getAllSelectedActions(this.menus)
    },
    getAllSelectedActions (data, ids = []) {
      for (const i in data) {
        if (data[i].selected.length) {
          ids = [...ids, ...data[i].selected]
        }
        if (data[i].children !== undefined) {
          ids = [...this.getAllSelectedActions(data[i].children, ids)]
        }
      }

      return ids
    }
  }
}
</script>
