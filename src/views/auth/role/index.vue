<template>
  <div class="page-header-index-wide">
    <a-modal
      title="详情"
      :width="800"
      :visible="visible"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="唯一识别码">
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

        <a-form-item label="上级管理员">
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="选择上级管理员"
            allowClear
            treeDefaultExpandAll
            @change="handleTreeChange"
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

        <a-form-item label="角色名称">
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

        <a-form-item label="状态">
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

        <a-form-item label="拥有权限">
          <a-row :gutter="16" v-for="(item, index) in rules" :key="index">
            <a-col :xl="4" :lg="24">
              {{ item.title }}：
            </a-col>
            <a-col :xl="20" :lg="24">
              <a-checkbox
                v-if="item.actions.length > 0"
                :indeterminate="item.indeterminate"
                :checked="item.checkedAll"
                @change="onCheckAllChange($event, item)"
              >
                全选
              </a-checkbox>
              <a-checkbox-group :options="item.actions" v-model="item.selected" @change="onChange(item)" />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色ID">
                <a-input placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="openRole" :loading="loading" :disabled="loading">新建</a-button>
      </div>

      <a-table
        :columns="columns"
        :rowKey="item => item.id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="row">
          <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
        </template>

        <template slot="fulltitle" slot-scope="row">
          <span v-html="row.fulltitle"></span>
        </template>

        <p slot="expandedRowRender" slot-scope="row">
          <a-row>
            <a-col class="rule-list" span="12" v-for="(item, index) in rules" :key="index">
              <a-row>
                <a-col span="4">{{ item.title }}：</a-col>
                <a-col span="20">
                  <template v-for="(action, i) in item.actions">
                    <a-tag :key="i" v-if="row.permissions.indexOf(action.id) !== -1">
                      {{ action.title }}
                    </a-tag>
                  </template>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </p>

        <template slot="tools" slot-scope="row">
          <a v-action:role-update @click="openInfoModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:role-delete @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
// import permission from '../../../store/modules/permission'
// import permission from '../../../store/modules/permission'
// import action from '../../../core/directives/action'
const statusMap = {
  0: {
    status: 'default',
    text: '已禁用'
  },
  1: {
    status: 'processing',
    text: '使用中'
  }
}

const columns = [
  {
    title: '唯一识别码',
    dataIndex: 'name'
  },
  {
    title: '角色名称',
    scopedSlots: { customRender: 'fulltitle' }
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'tools' }
  }
]
export default {
  data () {
    return {
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      loading: false,
      confirmLoading: false,
      visible: false,
      form: this.$form.createForm(this),
      rules: [],
      selected: 0,
      data: [],
      pagination: {},
      columns,
      treeData: [],
      rolePermissionSelect: []
    }
  },
  mounted () {
    this.fetch()
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    ...mapActions(['fetchRule', 'fetchRole', 'deleteRole']),
    fetch (params = {}) {
      this.loading = true
      this.fetchRole(params).then(res => {
        const { rules, roles } = res
        const { data, pagination, tree } = roles
        this.data = data
        this.treeData = tree
        this.pagination = pagination

        this.rulesSelectedInit(rules)
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange (pagination, filters, sorter) {
      this.fetch({
        page: pagination.current,
        pageSize: pagination.pageSize
      })
    },
    openRole () {
      this.visible = true
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const checkedList = []
          this.rules.map(item => {
            item.selected.map(s => {
              checkedList.push(s)
            })
          })

          const action = this.selected === 0 ? 'addRole' : 'updateRole'
          values.selectId = this.selected
          values.rules = checkedList
          this.confirmLoading = true
          this.$store
            .dispatch(action, values)
            .then(res => {
              this.$notification['success']({
                message: '成功通知',
                description: this.selected === 0 ? '添加成功！' : '更新成功！'
              })
              this.fetch()
              this.handleCancel()
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields()
      this.selected = 0
      this.loading = false
      this.rolePermissionSelect = []

      this.rules.map(rule => {
        rule.selected = []
        rule.indeterminate = false
        rule.checkedAll = false
        rule.actions.map(action => {
          action.disabled = false
        })
      })
    },
    openInfoModal (row) {
      const { id, permissions } = row
      this.visible = true
      this.selected = id
      this.rolePermissionSelect = permissions
      if (permissions.length) {
        // 自动勾选当前角色拥有的权限
        this.rules.map(rule => {
          // 记录当前权限可选操作数量
          let ruleSelectCount = 0
          rule.actions.map(action => {
            action.readonly = true
            if (permissions.indexOf(action.value) >= 0) {
              rule.selected.push(action.value)
              action.disabled = false
              ruleSelectCount = ruleSelectCount + 1
            } else {
              action.disabled = true
            }
          })
          rule.indeterminate = !!rule.selected.length && (rule.selected.length < ruleSelectCount)
          rule.checkedAll = rule.selected.length === ruleSelectCount
        })
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          title: row.title,
          name: row.name,
          status: row.status,
          pid: row.pid.toString()
        })
      })
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此角色吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          this.deleteRole({ id: id }).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.fetch({ page: this.data.length === 1 ? this.pagination.current - 1 : this.pagination.current, pageSize: this.pagination.pageSize })
          }).finally(r => {
            hide()
          })
        }
      })
    },
    onChange (permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actions.length)
      permission.checkedAll = permission.selected.length === permission.actions.length
    },
    onCheckAllChange (e, permission) {
      // 记录有权限的操作
      const hasPermissionAction = []
      permission.actions.map(action => {
        if (action.disabled === false) {
          hasPermissionAction.push(action.value)
        }
      })
      Object.assign(permission, {
        selected: e.target.checked ? hasPermissionAction : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    rulesSelectedInit (rules) {
      this.rules = rules.map(item => {
        Object.assign(item, {
          selected: [],
          indeterminate: false,
          checkedAll: false
        })

        // 初始化状态
        item.actions.map(action => {
          action.disabled = false
        })
        return item
      })
    },
    handleTreeChange (v) {
      if (v !== '0') {
        const { data, rules } = this
        // 获取当前已选中角色
        const role = data.find(item => {
          if (item.id.toString() === v) {
            return item
          }
        })
        const { permissions } = role
        this.rolePermissionSelect = permissions
        rules.map(rule => {
          rule.selected = []
          rule.indeterminate = false
          rule.checkedAll = false
          rule.actions.map(action => {
            // 清除上一次所选角色设置的禁用状态
            action.disabled = false
            if (permissions.indexOf(action.value) === -1) {
              action.disabled = true
            }
          })
        })
      }
    }
  }
}
</script>
