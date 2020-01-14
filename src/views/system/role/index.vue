<template>
  <div class="page-header-index-wide">
    <a-modal
      title="详情"
      :width="650"
      :visible="visible"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="form" layout="horizontal">
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
            @change="handleTreeChange"
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

        <a-form-item label="拥有权限" v-if="form.getFieldValue('pid')" hasFeedback :label-col="{span: 4}" :wrapper-col="{span: 20}">
          <a-row v-for="(item, index) in rules" :key="index">
            <a-col :xl="5">
              {{ item.title }}：
            </a-col>
            <a-col :xl="19">
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

    <a-modal
      title="分配数据权限"
      :width="500"
      :visible="dataVisible"
      @ok="handleDataSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="dataForm">
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

        <a-form-item label="数据范围" hasFeedback>
          <a-select
            @change="handleSelectChange"
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

        <a-form-item v-if="dataForm.getFieldValue('mode') === 2" label="数据权限" hasFeedback>
          <a-tree
            checkable
            @expand="onExpand"
            v-model="checkedKeys"
            :autoExpandParent="true"
            @select="onSelect"
            :treeData="deptTreeData"
            :showLine="true"
            v-decorator="[
              'deptIds',
              {
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
            <a-button v-action:RoleAdd type="primary" icon="plus" @click="visible = true">新建</a-button>
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
        :expandIcon="expandIcon"
        :showPagination="false"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
          <a v-action:RoleUpdate @click="openInfoModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:RoleUpdate @click="openDataInfoModal(row)">数据权限</a>
          <a-divider type="vertical" />
          <a v-action:RoleDelete @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
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
      expandedKeys: ['0-0-0', '0-0-1'],
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      selectedKeys: [],
      checkedKeys: [],
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      loading: false,
      confirmLoading: false,
      visible: false,
      dataVisible: false,
      customDataVisable: false,
      form: this.$form.createForm(this, { name: 'role' }),
      dataForm: this.$form.createForm(this, { name: 'dept' }),
      rules: [],
      allActionIds: [],
      selected: 0,
      info: {},
      data: [],
      columns,
      roleTree: [],
      deptTreeData: [],
      queryParam: {},
      loadData: parameter => {
        return fetchRole(Object.assign(parameter, this.queryParam)).then(res => {
          const { rules, roles, depts } = res.result
          const { data, tree } = roles
          this.data = data
          this.roleTree = tree
          this.deptTreeData = depts

          this.rulesSelectedInit(rules)
          return roles
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable },
  watch: {
    checkedKeys (v) {
      this.dataForm.setFieldsValue({
        deptIds: v
      })
    }
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
    handleDataSubmit () {
      this.dataForm.validateFields((err, values) => {
        if (!err) {
          updateMode(this.selected, values).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '更新成功！'
            })
            this.handleCancel()
            this.refreshTable()
          })
        }
      })
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
          values.rules = checkedList
          const promise = this.selected === 0 ? addRole(values) : updateRole(this.selected, values)
          this.confirmLoading = true
          promise.then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: this.selected === 0 ? '添加成功！' : '更新成功！'
            })
            this.handleCancel()
            this.refreshTable()
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.dataVisible = false
      this.form.resetFields()
      this.selected = 0
      this.loading = false

      this.rules.map(rule => {
        rule.selected = []
        rule.indeterminate = false
        rule.checkedAll = false
        rule.actions.map(action => {
          action.disabled = false
        })
      })
    },
    filterRuleAction (selectRoleId = '1') {
      // 更新时 自动勾选已选择的权限
      if (this.selected > 0) {
        const { info: { pid } } = this
        selectRoleId = pid.toString()
      }
      const { data, rules } = this
      let allPermissionActionsIds = []
      if (selectRoleId !== '1') {
        const parentRole = data.find(item => {
          if (item.id.toString() === selectRoleId) {
            return item
          }
        })
        allPermissionActionsIds = parentRole.permissions
      } else {
        allPermissionActionsIds = this.allActionIds
      }
      // 更新时 自动勾选已选择的权限
      if (this.selected > 0) {
        const { info: { permissions } } = this
        rules.map(rule => {
          // 记录当前菜单可选操作数量
          let ruleSelectCount = 0
          rule.actions.map(action => {
            if (permissions.indexOf(action.id) !== -1) {
              rule.selected.push(action.id)
            }

            action.disabled = allPermissionActionsIds.indexOf(action.id) === -1
            if (action.disabled === false) {
              ruleSelectCount = ruleSelectCount + 1
            }
          })

          rule.indeterminate = !!rule.selected.length && (rule.selected.length < ruleSelectCount.length)
          rule.checkedAll = rule.selected.length === ruleSelectCount
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
    openInfoModal (row) {
      this.selected = row.id
      this.info = row
      this.visible = true
      this.filterRuleAction(row.pid.toString())
      this.$nextTick(() => {
        this.form.setFieldsValue({
          title: row.title,
          name: row.name,
          status: row.status,
          pid: row.pid.toString()
        })
      })
    },
    openDataInfoModal (row) {
      this.dataVisible = true
      this.selected = row.id
      const deptIds = row.deptIds.map(item => item.toString())
      this.checkedKeys = deptIds
      this.$nextTick(() => {
        this.dataForm.setFieldsValue({
          title: row.title,
          name: row.name,
          mode: row.mode,
          deptIds: deptIds
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
      const allActionIds = []
      this.rules = rules.map(item => {
        Object.assign(item, {
          selected: [],
          indeterminate: false,
          checkedAll: false
        })

        // 初始化状态
        item.actions.map(action => {
          allActionIds.push(action.id)
          action.disabled = false
        })
        return item
      })

      this.allActionIds = allActionIds
    },
    handleTreeChange (v) {
      this.filterRuleAction(v)
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleMenuClick () {},
    expandIcon ({ expanded }) {
      if (expanded === true) {
        return <a-icon type='down' />
      }
      return <a-icon type='right' />
    },
    handleSelectChange (v) {
      this.customDataVisable = v === 2
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>
