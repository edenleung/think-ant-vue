<template>
  <div class="page-header-index-wide">
    <a-modal
      title="详情"
      :width="650"
      :visible="roleVisible"
      @ok="handleRoleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleRoleCancel">
      <a-form :form="roleForm">
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
            @change="filterRuleAction"
            :treeData="roleTree"
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

        <a-divider v-if="roleForm.getFieldValue('pid')">拥有权限</a-divider>
        <a-form-item label="" :label-col="{span: 24}" :wrapper-col="{span: 24}" v-show="roleForm.getFieldValue('pid')">
          <a-row v-for="(item, index) in rules" :key="index">
            <a-checkbox
              :indeterminate="item.indeterminate"
              :checked="item.checkedAll"
              @change="onCheckAllActionChange($event, item)"
            >
              全选
            </a-checkbox>
            <a-checkbox-group
              @change="onChangeAction(item)"
              v-model="item.selected"
            >
              <a-checkbox :value="item.id" :disabled="item.disabled">{{ item.title }}</a-checkbox>
              <a-checkbox :value="action.id" :disabled="action.disabled" v-for="(action, i) in item.actions" :key="i">{{ action.title }}</a-checkbox>
            </a-checkbox-group>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      title="分配数据权限"
      :width="500"
      :visible="dataAccessVisable"
      @ok="handleDataAccessSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleDataAccessCancel">
      <a-form :form="dataAccessForm">
        <a-form-item label="唯一识别码" hasFeedback>
          <a-input
            readonly
            v-decorator="[
              'name'
            ]"
          />
        </a-form-item>

        <a-form-item label="角色名称" hasFeedback>
          <a-input
            readonly
            v-decorator="[
              'title'
            ]"
          />
        </a-form-item>

        <a-form-item label="数据范围">
          <a-select
            v-decorator="[
              'mode',
              {
                rules: [{ required: true, message: '请输入角色名称!' }]
              }
            ]">
            <a-select-option :value="1">全部数据权限</a-select-option>
            <a-select-option :value="2">自定义数据权限</a-select-option>
            <a-select-option :value="3">本部门数据权限</a-select-option>
            <a-select-option :value="4">本部门及以下数据权限</a-select-option>
            <a-select-option :value="5">仅本人数据权限</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="数据权限" v-show="dataAccessForm.getFieldValue('mode') === 2">
          <a-tree
            checkable
            :treeData="deptTree"
            :autoExpandParent="true"
            :showLine="true"
            :defaultExpandedKeys="dataAccessDefaultExpandedKeys"
            v-decorator="[
              'deptIds',
              {
                valuePropName: 'deptIds', trigger: 'check', validateTrigger: 'check',
                rules: [{ required: true, message: '请选择数据权限!' }]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">角色列表</div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:RoleAdd type="primary" icon="plus" @click="roleVisible = true">新建</a-button>
          </div>
          <template v-if="selectedRows.length">
            <div class="ant-pro-table-toolbar-item">
              <a-dropdown>
                <a-menu slot="overlay" @click="handleMenuClick">
                  <a-menu-item key="remove"><a-icon type="delete" />批量删除</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
              </a-dropdown>
            </div>
          </template>
          <a-divider type="vertical" />
          <span class="ant-pro-table-toolbar-item-icon">
            <a-tooltip placement="top">
              <template slot="title">
                <span>刷新</span>
              </template>
              <a-icon type="reload" @click="refreshTable()"/>
            </a-tooltip>
          </span>
        </div>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :expandRowByClick="true"
        :showPagination="false"
      >
        <template slot="status" slot-scope="row">
          <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
        </template>

        <template slot="fulltitle" slot-scope="row">
          <span v-html="row.title"></span>
        </template>

        <p slot="expandedRowRender" slot-scope="row">
          <a-row>
            <a-col class="rule-list" span="12" v-for="(item, index) in rules" :key="index">
              <a-row>
                <a-col span="4">{{ item.title }}：</a-col>
                <a-col span="20">
                  <template v-if="!item.actions.length">-</template>
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
          <a v-action:RoleUpdate @click="openRoleModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:RoleUpdate @click="openDataAccessModal(row)">数据权限</a>
          <a-divider type="vertical" />
          <a v-action:RoleDelete @click="handleRoleDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
// eslint-disable-next-line no-unused-vars
import { fetchRole, addRole, updateRole, deleteRole, updateMode } from '@/api/role'
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
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      confirmLoading: false,
      info: {},
      rules: [],
      roleVisible: false,
      roleForm: this.$form.createForm(this, { name: 'role' }),
      roles: [],
      dataAccessVisable: false,
      dataAccessForm: this.$form.createForm(this, { name: 'dept' }),
      dataAccessDefaultExpandedKeys: [],
      selectedId: 0,
      roleTree: [],
      deptTree: [],
      queryParam: {},
      loadData: parameter => {
        return fetchRole(Object.assign(parameter, this.queryParam)).then(res => {
          // eslint-disable-next-line no-unused-vars
          const { rules, roles, depts } = res.result
          const { data, tree } = roles
          this.roles = data
          this.rules = rules
          this.roleTree = tree
          this.deptTree = depts

          this.rulesSelectedInit(rules)
          return roles
        })
      },
      selectedRows: [],
      allActionIds: [],
      columns
    }
  },
  components: { STable },
  watch: {},
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    openRoleModal (row) {
      this.roleVisible = true
      this.selectedId = row.id
      this.info = row
      this.filterRuleAction(row.pid.toString())
      this.$nextTick(() => {
        this.roleForm.setFieldsValue({
          ...row,
          pid: row.pid.toString()
        })
      })
    },
    handleRoleCancel () {
      this.roleVisible = false
      this.roleForm.resetFields()
      this.selectedId = 0
      this.rules.map(rule => {
        rule.selected = []
        rule.indeterminate = false
        rule.checkedAll = false
        rule.disabled = false
        rule.actions.map(action => {
          action.disabled = false
        })
      })
    },
    handleRoleSubmit () {
      this.roleForm.validateFields((err, values) => {
        if (!err) {
          const checkedList = []
          const { selectedId, rules } = this
          rules.map(item => {
            item.selected.map(s => {
              checkedList.push(s)
            })
          })
          values.rules = checkedList
          const promise = selectedId === 0 ? addRole(values) : updateRole(selectedId, values)
          this.confirmLoading = true
          promise.then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: this.selectedId === 0 ? '添加成功！' : '更新成功！'
            })
            this.handleRoleCancel()
            this.refreshTable()
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleRoleDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此角色吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          deleteRole(id).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.refreshTable()
          }).finally(r => {
            hide()
          })
        }
      })
    },
    openDataAccessModal (row) {
      this.dataAccessVisable = true
      this.selectedId = row.id
      const deptIds = row.deptIds.map(item => item.toString())
      // 展开组织架构
      this.dataAccessDefaultExpandedKeys = this.expandedDept(this.deptTree)
      this.$nextTick(() => {
        this.dataAccessForm.setFieldsValue({
          title: row.title,
          name: row.name,
          mode: row.mode,
          deptIds: deptIds
        })
      })
    },
    expandedDept (depts) {
      const expandedKeys = []
      depts.map(dept => {
        expandedKeys.push(dept.value)
        if (dept.children !== undefined) {
          expandedKeys.push(...this.expandedDept(dept.children))
        }
      })

      return expandedKeys
    },
    handleDataAccessCancel () {
      this.dataAccessForm.resetFields()
      this.dataAccessVisable = this.confirmLoading = false
      this.dataAccessDefaultExpandedKeys = []
    },
    handleDataAccessSubmit () {
      this.dataAccessForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          updateMode(this.selectedId, values).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '更新成功！'
            })
            this.handleDataAccessCancel()
            this.refreshTable()
          })
        }
      })
    },
    onChangeAction (permission) {
      console.log(permission)
      let notDisabledLen = 0
      if (permission.disabled === false) {
        notDisabledLen = notDisabledLen + 1
      }
      permission.actions.map(action => {
        if (action.disabled === false) {
          notDisabledLen = notDisabledLen + 1
        }
      })
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < notDisabledLen)
      permission.checkedAll = permission.selected.length === notDisabledLen
    },
    onCheckAllActionChange (e, permission) {
      // 记录有权限的操作
      const hasPermissionAction = []
      if (permission.disabled === false) {
        hasPermissionAction.push(permission.id)
      }
      permission.actions.map(action => {
        if (action.disabled === false) {
          hasPermissionAction.push(action.id)
        }
      })
      Object.assign(permission, {
        selected: e.target.checked ? hasPermissionAction : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    filterRuleAction (parentId = '1') {
      const { roles, rules } = this
      let allPermissionActionsIds = []
      if (parentId !== '1') {
        const parentRole = roles.find(item => {
          if (item.id.toString() === parentId) {
            return item
          }
        })
        // 获取父级所有可选权限
        allPermissionActionsIds = parentRole.permissions
      } else {
        // 当选中顶级时，获取所有可选权限
        allPermissionActionsIds = this.allActionIds
      }
      // 更新时 自动勾选已选择的权限
      if (this.selectedId > 0) {
        const { info: { permissions } } = this
        rules.map(rule => {
          rule.selected = []
          // 记录当前菜单可选操作数量
          let ruleSelectCount = 0
          if (permissions.indexOf(rule.id) !== -1) {
            ruleSelectCount = ruleSelectCount + 1
            rule.selected.push(rule.id)
          }

          rule.actions.map(action => {
            if (permissions.indexOf(action.id) !== -1) {
              rule.selected.push(action.id)
            }
            action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
            if (action.disabled === false) {
              ruleSelectCount = ruleSelectCount + 1
            }
          })

          rule.indeterminate = !!rule.selected.length && (rule.selected.length < ruleSelectCount)
          if (rule.selected.length) {
            rule.checkedAll = rule.selected.length === ruleSelectCount
          }
        })
      } else {
        // 创建时
        rules.map(rule => {
          rule.actions.map(action => {
            action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
          })
        })
      }
    },
    rulesSelectedInit (rules) {
      const allActionIds = []
      this.rules = rules.map(item => {
        Object.assign(item, {
          selected: [],
          indeterminate: false,
          checkedAll: false,
          disabled: false
        })
        // 初始化状态
        item.actions.map(action => {
          allActionIds.push(action.id)
          action.disabled = false
        })
        return item
      })
      this.allActionIds = allActionIds
    }
  }
}
</script>
