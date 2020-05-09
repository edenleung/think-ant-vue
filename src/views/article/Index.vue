<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title"></div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button type="primary" icon="plus" @click="$router.push({ name: 'CreateArticle' })">新建文章</a-button>
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
        <template slot="exp" slot-scope="row">
          {{ row.contract_id > 0 ? `${row.exp_start_date} 至 ${row.exp_end_date}` : '/' }}
        </template>
        <template slot="tools" slot-scope="row">
          <a @click="$router.push({ name: 'UpdateArticle', params: { id: row.id } })">编辑</a>
          <a-divider type="vertical" />
          <a @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { fetchArticle, deleteArticle } from '@/api/article'
const columns = [
  {
    title: '文章标题',
    dataIndex: 'title'
  },
  {
    title: '分类名称',
    dataIndex: 'category_name'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'disable' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'tools' }
  }
]

export default {
  data () {
    return {
      columns,
      status,
      expandedKeys: [],
      queryParam: {},
      loadData: parameter => {
        return fetchArticle(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
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
  components: { STable },
  methods: {
    onSelectChange () {
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此客户吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          deleteArticle(id).then(res => {
            this.$message.success('删除成功！')
            this.refreshTable()
          }).finally(() => {
            hide()
          })
        }
      })
    }
  }
}
</script>
