<template>
  <div class="page-header-index-wide">
    <a-modal title="详情" :visible="visible" @ok="handleSubmit" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="登录账号" hasFeedback>
          <a-input
            :readonly="this.selected !== 0"
            placeholder="请入登录账号"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入登录账号!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="登录密码" hasFeedback>
          <a-input
            :placeholder="this.selected === 0 ? '请入登录密码' : '如需修改密码请输入新密码'"
            v-decorator="[
              'password',
              {
                rules: [{ required: this.selected === 0, message: '请输入登录密码!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="用户昵称" hasFeedback>
          <a-input
            placeholder="请入用户昵称"
            v-decorator="[
              'nickname',
              {
                rules: [{ required: true, message: '请输入用户名称!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="归属部门" hasFeedback>
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="depts"
            placeholder="请选择角色"
            treeDefaultExpandAll
            @select="onSelect"
            v-decorator="[
              'dept_id',
              {
                rules: [{ required: true, message: '请选择归属部门!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="选择角色" hasFeedback>
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="roles"
            placeholder="请选择角色"
            treeDefaultExpandAll
            multiple
            v-decorator="[
              'roles',
              {
                rules: [{ required: true, message: '请选择角色!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="状态" hasFeedback>
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
              正常
            </a-select-option>
            <a-select-option :value="0">
              禁用
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card :body-style="{ padding: 0 }">
      <!-- <div class="table-page-search-wrapper">
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
      </div> -->

      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">用户列表</div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:account-add type="primary" icon="plus" :loading="loading" @click="visible = true">新建</a-button>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >

        <template slot="dept" slot-scope="row">
          <a-tag color="purple">{{ row.dept_name }}</a-tag>
        </template>

        <template slot="status" slot-scope="row">
          <template v-if="row.status === 1">正常</template>
          <template v-else>禁用</template>
        </template>

        <template slot="expandedRowRender" slot-scope="row">
          <a-row>
            <a-col class="rule-list" span="12" v-for="(item, index) in rules" :key="index">
              <a-row>
                <a-col span="4">{{ item.title }}：</a-col>
                <a-col span="20">
                  <template v-if="!item.actions.length">-</template>
                  <template v-for="(action, i) in item.actions">
                    <a-tag :key="i" v-if="row.rules.indexOf(action.id) !== -1">
                      {{ action.title }}
                    </a-tag>
                  </template>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </template>

        <template slot="tools" slot-scope="row">
          <a v-action:account-update @click="openInfoModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:account-delete @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
import { fetchAccount, addAccount, updateAccount, deleteAccount } from '@/api/account'
const columns = [
  {
    title: '账号名',
    dataIndex: 'nickname'
  },
  {
    title: '登录账号',
    dataIndex: 'name'
  },
  {
    title: '部门',
    scopedSlots: { customRender: 'dept' }
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
      description: '',
      visible: false,
      loading: false,
      confirmLoading: false,
      pagination: {},
      data: [],
      rules: [],
      roles: [],
      depts: [],
      form: this.$form.createForm(this),
      columns,
      selected: 0,
      queryParam: {},
      loadData: parameter => {
        return fetchAccount(Object.assign(parameter, this.queryParam)).then(res => {
          res = res.result
          const { users, roles, rules, depts } = res
          this.rules = rules
          this.roles = roles
          this.depts = depts

          return users
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable },
  mounted () {
  },
  methods: {
    openInfoModal (row) {
      this.visible = true
      this.selected = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: row.name,
          nickname: row.nickname,
          status: row.status,
          dept_id: row.dept_id,
          roles: row.roles.map(item => {
            return item.id.toString()
          })
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selected === 0 ? addAccount(values) : updateAccount(this.selected, values)
          promise.then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: this.selected === 0 ? '添加成功！' : '更新成功！'
            })
            this.refreshTable()
            this.handleCancel()
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields()
      this.selected = 0
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此用户吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteAccount(id).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.refreshTable()
          })
        }
      })
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
    onSelect (value, node, extra) {
      if (node.dataRef.children.length > 0) {
        this.$message.info('不能选择父节点')
        this.$nextTick(() => {
          this.form.setFieldsValue({
            dept_id: null
          })
        })
        return false
      }
    }
  }
}
</script>
