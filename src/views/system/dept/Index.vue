<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">部门列表</div>
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
        :rowKey="(record) => record.dept_id"
        :columns="columns"
        :data="loadData"
        :defaultExpandedRowKeys="expandedKeys"
      >
        <template slot="status" slot-scope="row">
          <template v-if="row.dept_status === 1">正常</template>
          <template v-else>禁用</template>
        </template>

        <template slot="tools" slot-scope="row">
          <span v-if="row.dept_pid">
            <a v-action:DeptUpdate @click="openDeptModal(row)">编辑</a>
            <a-divider type="vertical" />
            <a v-action:DeptDelete @click="showDeleteConfirm(row.dept_id)">删除</a>
          </span>
        </template>
      </s-table>
    </a-card>

    <a-modal
      title="详情"
      :visible="visible"
      :width="500"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input
            placeholder="公司/部门名称"
            v-decorator="[
              'dept_name',
              {
                rules: [{ required: true, message: '请输入公司/部门名称!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="所属上级" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="tree"
            placeholder="选择所属上级"
            treeDefaultExpandAll
            v-decorator="[
              'dept_pid',
              {
                rules: [{ required: true, message: '请选择所属上级!' }]
              }
            ]"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-select
            v-decorator="[
              'dept_status',
              {
                rules: [{ required: true, message: '请选择状态!' }]
              }
            ]"
            placeholder="请选择"
          >
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>
<script>
import { STable } from '@/components'
import { fetchDept, addDept, updateDept, deleteDept } from '@/api/dept'
const columns = [
  {
    title: '部门名称',
    dataIndex: 'dept_name'
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
      value: '',
      tree: [],
      confirmLoading: false,
      selected: 0,
      columns,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      expandedKeys: [],
      queryParam: {},
      loadData: parameter => {
        return fetchDept(Object.assign(parameter, this.queryParam)).then(res => {
          this.tree = res.result.data
          // 展开所有行
          this.expandedRow(res.result.data)
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable },
  methods: {
    openDeptModal (row) {
      this.visible = true
      this.selected = row.dept_id
      const data = row
      data.dept_pid = data.dept_pid.toString()
      this.$nextTick(() => {
        this.form.setFieldsValue({ ...data })
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
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selected === 0 ? addDept(values) : updateDept(this.selected, values)
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
      this.selected = 0
      this.form.resetFields()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此部门吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteDept(id).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.refreshTable()
          })
        }
      })
    },
    expandedRow (data) {
      console.log(data)
      data.map(item => {
        this.expandedKeys.push(item.dept_id)
        if (item.children !== undefined) {
          this.expandedRow(item.children)
        }
      })
    }
  }
}
</script>
