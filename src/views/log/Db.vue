<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">日志</div>
        <div class="ant-pro-table-toolbar-option">
          <template v-if="selectedRows.length">
            <div class="ant-pro-table-toolbar-item">
              <a-dropdown>
                <a-menu slot="overlay" @click="handleMenuClick">
                  <a-menu-item key="remove"><a-icon type="delete" />批量删除</a-menu-item>
                </a-menu>
                <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
              </a-dropdown>
            </div>
            <a-divider type="vertical" />
          </template>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template slot="sql" slot-scope="sql">
          <a-tooltip placement="left" :title="sql">
            <a>查看</a>
          </a-tooltip>
        </template>

        <template slot="tools" slot-scope="row">
          <a @click="handleDeleteRow(row)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { fetchDbLog, deleteDbLog } from '@/api/log'
import { STable } from '@/components'
const columns = [
  {
    title: '用户',
    dataIndex: 'nickname'
  },
  {
    title: 'Model',
    dataIndex: 'model'
  },
  {
    title: 'Action',
    dataIndex: 'action'
  },
  {
    title: 'Url',
    dataIndex: 'url'
  },
  {
    title: 'SQL',
    dataIndex: 'sql',
    scopedSlots: { customRender: 'sql' }
  },
  {
    title: 'CreateTime',
    dataIndex: 'create_time'
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
      selectedRowKeys: [],
      selectedRows: [],
      form: this.$form.createForm(this),
      columns,
      queryParam: {},
      loadData: parameter => {
        return fetchDbLog(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      }
    }
  },
  components: { STable },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted () {
  },
  methods: {
    handleDeleteRow (row) {
      this.handleDelete(true, row)
    },
    handleDeleteSelected () {
      this.handleDelete(false, this.selectedRowKeys)
    },
    handleDelete (isRow = false, value = '') {
      const ids = isRow ? value.id : this.selectedRowKeys.join()
      this.$confirm({
        title: isRow ? '确定删除此项吗' : '确定删除已选中项吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          const hide = this.$message.loading('删除中..', 0)
          deleteDbLog({ id: ids }).then(res => {
            this.$message.success('删除成功！')
          }).finally(() => {
            hide()
            this.loading = false
          })
          this.refreshTable()
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
          this.handleDeleteSelected()
        }
      }
    }
  }
}
</script>
