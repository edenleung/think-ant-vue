<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title"></div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:CreatePost type="primary" icon="plus" :loading="loading" @click="visible = true">新建</a-button>
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
        :showPagination="false"
      >
        <template slot="status" slot-scope="row">
          <template v-if="row.status === 1">正常</template>
          <template v-else>禁用</template>
        </template>

        <template slot="tools" slot-scope="row">
          <a v-action:UpdatePost @click="showModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:DeletePost @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>

      <PostForm ref="postForm" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel" @submit="handleSubmit"/>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
import PostForm from './components/PostForm'
import { fetchAllPost, createPost, updatePost, deletePost } from '@/api/post'
const columns = [
  {
    title: '岗位标识',
    dataIndex: 'code'
  },
  {
    title: '岗位名称',
    dataIndex: 'name'
  },
  {
    title: '岗位排序',
    dataIndex: 'sort'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
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
      visible: false,
      confirmLoading: false,
      selected: 0,
      columns,
      queryParam: {},
      loadData: parameter => {
        return fetchAllPost(Object.assign(parameter, this.queryParam)).then(res => {
          this.tree = res.result
          return { data: res.result }
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      posts: []
    }
  },
  components: { STable, PostForm },
  methods: {
    showModal (row) {
      this.visible = true
      this.selected = row.id
      const form = this.$refs.postForm.form
      this.$nextTick(() => {
        form.setFieldsValue({
          name: row.name,
          code: row.code,
          sort: row.sort,
          status: row.status
        })
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleMenuClick () {},
    handleSubmit () {
      const form = this.$refs.postForm.form
      form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selected === 0 ? createPost(values) : updatePost(this.selected, values)
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
      this.$refs.postForm.form.resetFields()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此岗位吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          deletePost(id).then(res => {
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
