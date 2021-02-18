<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">角色列表</div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button type="primary" icon="plus" @click="$router.push({ name: 'CreateRole' })">新建</a-button>
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
        :alert="false"
        :expandRowByClick="true"
        :showPagination="false"
      >
        <template slot="status" slot-scope="row">
          <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
        </template>

        <template slot="fulltitle" slot-scope="row">
          <span v-html="row.title"></span>
        </template>

        <!-- <p slot="expandedRowRender" slot-scope="row">
          <a-row>
            <a-col class="rule-list" span="12" v-for="(item, index) in rules[0].children" :key="index">
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
        </p> -->

        <template slot="tools" slot-scope="row">
          <a @click="$router.push({ name: 'UpdateRole', params: { id: row.id} })">编辑</a>
          <a-divider type="vertical" />
          <a @click="showDataAccessModal(row)">数据权限</a>
          <a-divider type="vertical" />
          <a @click="handleRoleDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>

    <DataAccessForm
      ref="dataAccessForm"
      :treeData="deptTree"
      :defaultExpandedKeys="dataAccessDefaultExpandedKeys"
      :visible="dataAccessVisable"
      :confirmLoading="confirmLoading"
      @submit="handleDataAccessSubmit"
      @cancel="handleDataAccessCancel"
    />
  </div>
</template>
<script>
import { STable } from '@/components'
import DataAccessForm from './components/DataAccessForm'
import { fetchRole, deleteRole, updateMode } from '@/api/role'
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
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      confirmLoading: false,
      info: {},
      rules: [],
      roleVisible: false,
      roles: [],
      dataAccessVisable: false,
      dataAccessDefaultExpandedKeys: [],
      selectedId: 0,
      roleTree: [],
      deptTree: [],
      queryParam: {},
      loadData: parameter => {
        return fetchRole(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      selectedRows: [],
      allActionIds: [],
      columns
    }
  },
  components: { STable, DataAccessForm },
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
    showRoleModal (row) {
      this.roleVisible = true
      this.selectedId = row.id
      this.info = row
      this.filterRuleAction(row.pid.toString())
      this.$nextTick(() => {
        this.$refs.roleForm.form.setFieldsValue({
          name: row.name,
          pid: row.pid.toString(),
          title: row.title,
          status: row.status
        })
      })
    },
    handleRoleCancel () {
      this.roleVisible = false
      this.$refs.roleForm.form.resetFields()
      this.selectedId = 0
      this.rulesSelectedInit(this.rules)
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
            this.$message.success('删除成功！')
            this.refreshTable()
          }).finally(r => {
            hide()
          })
        }
      })
    },
    showDataAccessModal (row) {
      this.dataAccessVisable = true
      this.selectedId = row.id
      const deptIds = row.deptIds.map(item => item.toString())
      // 展开组织架构
      this.dataAccessDefaultExpandedKeys = this.expandedDept(this.deptTree)
      this.$nextTick(() => {
        this.$refs.dataAccessForm.form.setFieldsValue({
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
      this.$refs.dataAccessForm.form.resetFields()
      this.dataAccessVisable = this.confirmLoading = false
      this.dataAccessDefaultExpandedKeys = []
    },
    handleDataAccessSubmit () {
      this.$refs.dataAccessForm.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const hide = this.$message.loading('执行中..', 0)
          updateMode(this.selectedId, values).then(res => {
            this.$message.success('更新成功！')
            this.handleDataAccessCancel()
            this.refreshTable()
          }).finally(() => {
            hide()
          })
        }
      })
    },
    onChangeAction (permission) {
      let notDisabledLen = 0
      permission.actions.map(action => {
        if (action.disabled === false) {
          notDisabledLen = notDisabledLen + 1
        }
      })
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < notDisabledLen)
      permission.checkedAll = permission.selected.length === notDisabledLen
      this.rules = [ ...this.rules ]
    },
    onCheckAllActionChange (e, permission) {
      // 记录有权限的操作
      const hasPermissionAction = []
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
      this.rules = [ ...this.rules ]
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    filterRuleAction (parentId) {
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
        this.updateRole(this.rules, permissions, allPermissionActionsIds)
      } else {
        // 创建时
        rules.map(rule => {
          rule.actions.map(action => {
            action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
          })
        })
      }
      this.rules = [ ...rules ]
    },
    updateRole (rules, permissions, allPermissionActionsIds) {
      console.log(allPermissionActionsIds)
      for (const i in rules) {
        if (rules[i].type === 'menu') {
          rules[i].selected = []
          // 记录当前菜单可选操作数量
          let ruleSelectCount = 0
          rules[i].actions.map(action => {
            if (permissions.indexOf(action.id) !== -1) {
              rules[i].selected.push(action.id)
            }
            action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
            if (action.disabled === false) {
              ruleSelectCount = ruleSelectCount + 1
            }
          })

          rules[i].indeterminate = !!rules[i].selected.length && (rules[i].selected.length < ruleSelectCount)
          if (rules[i].selected.length) {
            rules[i].checkedAll = rules[i].selected.length === ruleSelectCount
          }
        }
        if (rules[i].children !== undefined && rules[i].children.length) {
          this.updateRole(rules[i].children, permissions, allPermissionActionsIds)
        }
      }
    },
    rulesSelectedInit (rules, allActionIds = []) {
      for (const i in rules) {
        const item = Object.assign(rules[i], {
          selected: [],
          indeterminate: false,
          checkedAll: false,
          disabled: false
        })
        if (rules[i].type === 'menu') {
          // 初始化状态
          item.actions.map(action => {
            allActionIds.push(action.id)
            action.disabled = false
            return action
          })
        }
        if (rules[i].children && rules[i].type !== 'action') {
          this.rulesSelectedInit(rules[i]['children'], allActionIds)
        }
      }
      this.rules = rules
      this.allActionIds = allActionIds
    }
  }
}
</script>
