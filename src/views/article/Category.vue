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
      <a-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :loading="loading"
        :data-source="loadData"
        :pagination="false"
      >
        <template slot="fulltitle" slot-scope="fulltitle">
          <span v-html="fulltitle" />
        </template>
        <template slot="disable" slot-scope="disable">
          <template v-if="disable === 0">正常</template>
          <template v-else>禁用</template>
        </template>

        <template slot="tools" slot-scope="row">
          <template v-if="row.pid !== 0">
            <a @click="showModal(row)">编辑</a>
            <a-divider type="vertical" />
            <a @click="showDeleteConfirm(row.id)" :disabled="row.pid === 0">删除</a>
          </template>
        </template>
      </a-table>
    </a-card>

    <Category
      ref="category"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :defaultExpandedRowKeys="expandedKeys"
      :treeData="loadData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
<script>
import { fetchArticleCategory, createArticleCategory, updateArticleCategory, deleteArticleCategory } from '@/api/article'
import Category from './components/Category'
const columns = [
  {
    title: '名称',
    dataIndex: 'fulltitle',
    scopedSlots: { customRender: 'fulltitle' }
  },
  {
    title: '状态',
    dataIndex: 'disable',
    scopedSlots: { customRender: 'disable' }
  },
  {
    title: '操作',
    width: '200px',
    scopedSlots: { customRender: 'tools' }
  }
]

export default {
  data () {
    return {
      description: '',
      loading: false,
      visible: false,
      loadData: [],
      confirmLoading: false,
      selected: 0,
      columns,
      expandedKeys: [],
      queryParam: {},
      selectedRows: [],
      expandedRowKeys: []
    }
  },
  components: { Category },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.loading = true
      fetchArticleCategory().then(res => {
        this.loading = false
        this.loadData = res.result
        this.expandedRow(res.result)
      })
    },
    showModal (row) {
      this.visible = true
      this.selected = row.id
      this.$nextTick(() => {
        this.$refs.category.form.setFieldsValue({
          ...row
        })
      })
    },
    expandedRow (data) {
      data.map(item => {
        this.expandedKeys.push(item.id)
        if (item.children !== undefined) {
          this.expandedRow(item.children)
        }
      })
    },
    handleSubmit () {
      this.$refs.category.form.validateFields((err, values) => {
        if (!err) {
          const promise = this.selected === 0 ? createArticleCategory(values) : updateArticleCategory(this.selected, values)
          const hide = this.$message.loading('执行中..', 0)
          promise.then(res => {
            this.$message.success(this.selected === 0 ? '添加成功！' : '更新成功！')
            this.handleCancel()
            this.refreshTable()
          }).finally(() => {
            hide()
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.$refs.category.form.resetFields()
      this.selected = 0
    },
    refreshTable () {
      this.fetch()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此条记录吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          deleteArticleCategory(id).then(res => {
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
