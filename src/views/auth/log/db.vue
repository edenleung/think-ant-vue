<template>
  <div class="page-header-index-wide">
    <a-card>
      <div style="margin-bottom: 16px">
        <a-button type="danger" icon="delete" @click="handleDeleteSelected" :disabled="!hasSelected" :loading="loading">
          批量删除
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `已选中 ${selectedRowKeys.length} 项` }}
          </template>
        </span>
      </div>
      <a-table
        :columns="columns"
        :rowKey="item => item.id"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="sql" slot-scope="sql">
          <a-tooltip placement="left" :title="sql">
            <a>查看</a>
          </a-tooltip>
        </template>

        <template slot="tools" slot-scope="row">
          <a @click="handleDeleteRow(row)">删除</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { fetchDbLog, deleteDbLog } from '@/api/log'

const columns = [
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
      description: '查看CURD日志',
      loading: false,
      pagination: {},
      data: [],
      selectedRowKeys: [],
      form: this.$form.createForm(this),
      columns
    }
  },
  computed: {
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch (params = {}) {
      this.loading = true
      fetchDbLog(params).then(res => {
        const { data, pagination } = res.result
        this.data = data
        this.pagination = pagination
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
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
          deleteDbLog({ id: ids }).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.fetch({ page: this.data.length === 1 ? this.pagination.current - 1 : this.pagination.current, pageSize: this.pagination.pageSize })
          })
        }
      })
    },
    getPopupContainer (trigger) {
      return trigger.parentElement
    },
    handleTableChange (pagination, filters, sorter) {
      this.fetch({
        page: pagination.current,
        pageSize: pagination.pageSize
      })
    }
  }
}
</script>
