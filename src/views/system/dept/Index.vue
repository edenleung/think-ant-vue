<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title"></div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button type="primary" icon="plus" :loading="loading" @click="visible = true">新建</a-button>
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
        :defaultExpandedRowKeys="expandedKeys"
        :showPagination="false"
      >
        <template slot="status" slot-scope="row">
          <template v-if="row.status === 1">正常</template>
          <template v-else>禁用</template>
        </template>

        <template slot="tools" slot-scope="row">
          <span v-if="row.pid">
            <a v-action:UpdateDept @click="showModal(row)">编辑</a>
            <a-divider type="vertical" />
            <a v-action:DeleteDept @click="showDeleteConfirm(row.id)">删除</a>
          </span>
        </template>
      </s-table>
    </a-card>

    <DeptForm
      ref="deptForm"
      :visible="visible"
      :treeData="tree"
      :confirmLoading="confirmLoading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
<script>
import { STable } from '@/components'
import DeptForm from './components/DeptForm'
import { fetchDept, addDept, updateDept, deleteDept } from '@/api/dept'
const columns = [
  {
    title: '部门名称',
    dataIndex: 'name'
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
      loading: false,
      visible: false,
      tree: [],
      confirmLoading: false,
      selected: 0,
      columns,
      expandedKeys: [],
      queryParam: {},
      loadData: parameter => {
        return fetchDept(Object.assign(parameter, this.queryParam)).then(res => {
          this.tree = res.result
          // 展开所有行
          this.expandedRow(res.result)
          return { data: res.result }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable, DeptForm },
  methods: {
    showModal (row) {
      this.visible = true
      this.selected = row.id
      const data = row
      this.$nextTick(() => {
        this.$refs.deptForm.form.setFieldsValue({
          name: data.name,
          pid: data.pid.toString(),
          status: data.status
        })
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
    handleSubmit () {
      this.$refs.deptForm.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selected === 0 ? addDept(values) : updateDept(this.selected, values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(this.selected === 0 ? '添加成功！' : '更新成功！')
            this.refreshTable()
            this.handleCancel()
          }).finally(() => {
            hide()
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
      this.selected = 0
      this.$refs.deptForm.form.resetFields()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此部门吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('执行中..', 0)
          deleteDept(id).then(res => {
            this.$message.success('删除成功！')
            this.refreshTable()
          }).finally(() => {
            hide()
          })
        }
      })
    },
    expandedRow (data) {
      console.log(data)
      data.map(item => {
        this.expandedKeys.push(item.id)
        if (item.children !== undefined) {
          this.expandedRow(item.children)
        }
      })
    }
  }
}
</script>
