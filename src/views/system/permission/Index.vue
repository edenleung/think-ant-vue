<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">规则列表</div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:CreatePermission type="primary" icon="plus" @click="visible = true">新建</a-button>
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
        :showPagination="false"
        :defaultExpandedRowKeys="expandedKeys"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template slot="actions" slot-scope="row">
          <template v-if="row.type !== 'menu'">-</template>
          <template v-for="(action, index) in row.actions" v-else>
            <a-popover :key="index" title="详情" trigger="click">
              <template slot="content">
                <div style="margin-bottom:15px">唯一识别码: {{ action.name }}</div>
                <a-button
                  size="small"
                  v-action:UpdatePermission
                  type="primary"
                  ghost
                  @click="showActionModal(action)"
                  style="margin-right:10px">编辑</a-button>
                <a-button size="small" v-action:DeletePermission type="danger" ghost @click="showDeleteConfirm(action.id)">删除</a-button>
              </template>
              <a-tag>{{ action.title }}</a-tag>
            </a-popover>
          </template>
        </template>

        <template slot="icon" slot-scope="row">
          <a-icon :type="row.icon" v-if="row.icon"/> {{ row.icon }}
        </template>

        <template slot="type" slot-scope="row">
          <a-tag :color="row.type | typeColorFilter">{{ row.type | typeTextFilter }}</a-tag>
        </template>

        <template slot="status" slot-scope="row">
          <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
        </template>

        <template slot="tools" slot-scope="row">
          <a v-action:UpdatePermission @click="showActionModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:DeletePermission @click="showDeleteConfirm(row.id)" :disabled="row.name === 'Index'">删除</a>
        </template>
      </s-table>
    </a-card>

    <PermissionForm
      ref="permissionForm"
      :visible="visible"
      :selected="selected"
      :status="status"
      :typeMap="typeMap"
      :treeData="roleTree"
      :confirmLoading="confirmLoading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
<script>
import { STable } from '@/components'
import PermissionForm from './components/PermissionForm'
import { fetchPermission, addPermission, updatePermission, deletePermission } from '@/api/permission'
const status = [{ label: '是', value: 1 }, { label: '否', value: 0 }]
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
const typeMap = {
  'path': {
    value: 'path',
    text: '目录',
    color: 'purple'
  },
  'menu': {
    value: 'menu',
    text: '菜单',
    color: 'blue'
  },
  'action': {
    value: 'action',
    text: '按钮',
    color: 'cyan'
  }
}
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'title'
  },
  {
    title: '唯一识别码',
    dataIndex: 'name'
  },
  {
    title: '菜单 ICON',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '可操作权限',
    scopedSlots: { customRender: 'actions' }
  },
  {
    title: '类型',
    scopedSlots: { customRender: 'type' }
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
      columns,
      typeMap,
      status,
      expandedKeys: [],
      queryParam: {},
      loadData: parameter => {
        return fetchPermission(Object.assign(parameter, this.queryParam)).then(res => {
          res = res.result
          const { tree, data } = res
          this.roleTree = tree
          // 展开所有
          this.expandedRow(data)
          return res
        })
      },
      loading: false,
      visible: false,
      confirmLoading: false,
      info: {},
      roleTree: [],
      selected: 0,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable, PermissionForm },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    typeTextFilter (type) {
      return typeMap[type].text
    },
    typeColorFilter (type) {
      return typeMap[type].color
    }
  },
  methods: {
    showActionModal (row) {
      this.visible = true
      this.selected = row.id
      this.$nextTick(() => {
        this.$refs.permissionForm.form.setFieldsValue({
          type: row.type,
          title: row.title,
          name: row.name,
          component: row.component,
          path: row.path,
          pid: row.pid.toString(),
          redirect: row.redirect,
          status: row.status,
          keepAlive: row.keepAlive,
          hidden: row.hidden,
          hideChildrenInMenu: row.hideChildrenInMenu,
          icon: row.icon,
          permission: row.permission ? row.permission.split(',') : [],
          action_type: row.action_type,
          button_type: row.button_type
        })
      })
    },
    handleSubmit () {
      this.$refs.permissionForm.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selected === 0 ? addPermission(values) : updatePermission(this.selected, values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(this.selected === 0 ? '添加成功！' : '更新成功！')
            this.refreshTable()
            this.handleCancel()
            this.$store.dispatch('ReloadRouters')
          }).finally(() => {
            hide()
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.selected = 0
      this.$refs.permissionForm.form.resetFields()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此规则吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          deletePermission(id).then(res => {
            this.$message.success('删除成功！')
            this.refreshTable()
            this.$store.dispatch('ReloadRouters')
          }).finally(() => {
            hide()
            this.updating = false
          })
        }
      })
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleMenuClick ({ key }) {
      switch (key) {
        case 'remove': {
          // TODO
        }
      }
    },
    handleTreeChange (v) {
      if (v === '0') {
        // TODO 当选择‘根’时，类型不能选择按钮
      }
    },
    expandedRow (data) {
      data.map(item => {
        this.expandedKeys.push(item.id)
        if (item.children !== undefined) {
          this.expandedRow(item.children)
        }
      })
    },
    onActionChange (action) {
      this.form.setFieldsValue({
        title: this.actions[action].label,
        name: this.actions[action].key
      })
    }
  }
}
</script>

<style scoped>
.rule-list {
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 12px;
  min-height: 23px;
}
</style>
