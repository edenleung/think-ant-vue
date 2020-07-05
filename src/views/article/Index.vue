<template>
  <div class="page-header-index-wide">
    <div class="ant-pro-table-search">
      <a-form :form="searchForm" @submit="handleSearch">
        <a-row type="flex" justify="start">
          <a-col
            :xl="8"
            :sm="12"
            :md="12"
            :lg="8"
            :xxl="8"
            style="padding-left: 8px;padding-right:8px;"
          >
            <a-form-item label="文章名称">
              <a-input
                v-decorator="[
                  `title`
                ]"
                placeholder="搜索文章"
              />
            </a-form-item>
          </a-col>
          <a-col
            :xl="5"
            :sm="12"
            :md="12"
            :lg="5"
            :xxl="5"
            style="padding-left: 8px;padding-right:8px;"
          >
            <a-form-item label="状态">
              <a-select
                placeholder="筛选状态"
                v-decorator="[
                  `status`
                ]"
              >
                <a-select-option :value="index" v-for="(item, index) in type" :key="index">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :sm="12"
            :md="12"
            :lg="8"
            :xl="8"
            :xxl="8"
            class="ant-pro-table-search-option"
          >
            <a-form-item label="">
              <div class="ant-space ant-space-horizontal ant-space-align-center">
                <div class="ant-space ant-space-horizontal ant-space-align-center">
                  <div class="ant-space-item">
                    <a-button icon="search" type="primary" html-type="submit">
                      搜索
                    </a-button>
                  </div>
                  <div class="ant-space-item">
                    <a-button :style="{ marginLeft: '8px' }" @click="handleSearchReset">
                      重置
                    </a-button>
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title"></div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:CreateArticle type="primary" icon="plus" @click="$router.push({ name: 'CreateArticleView' })">新建</a-button>
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
        :showPagination="true"
        :defaultExpandedRowKeys="expandedKeys"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <template slot="title" slot-scope="row">
          <span v-if="row.top === 1" style="color:red">
            [置顶]
          </span>
          {{ row.title }}
        </template>
        <template slot="image" slot-scope="image">
          <img :src="baseUrl + '/' + image" class="article-image" v-if="image" />
          <span v-else>/</span>
        </template>
        <template slot="status" slot-scope="text">
          <a-badge :status="type[text].status" :text="type[text].label" />
        </template>
        <template slot="tools" slot-scope="row">
          <a v-action:UpdateArticle @click="$router.push({ name: 'UpdateArticleView', params: { id: row.id } })">编辑</a>
          <a-divider type="vertical" />
          <a v-action:DeleteArticle @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { fetchArticle, deleteArticle } from '@/api/article'
const type = {
  0: {
    label: '隐藏',
    status: 'error'
  },
  1: {
    label: '正常',
    status: 'success'
  }
}
const columns = [
  {
    title: '文章标题',
    scopedSlots: { customRender: 'title' }
  },
  {
    title: '封面图',
    dataIndex: 'image',
    scopedSlots: { customRender: 'image' }
  },
  {
    title: '分类名称',
    dataIndex: 'category_name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time'
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
      type,
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
      selectedRows: [],
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      searchForm: this.$form.createForm(this, { name: 'search' })
    }
  },
  components: { STable },
  methods: {
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        console.log('error', error)
        this.queryParam = { ...values }
        this.refreshTable()
      })
    },
    handleSearchReset () {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.refreshTable()
    },
    onSelectChange () {
    },
    refreshTable () {
      this.$refs.table.refresh()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此文章吗?',
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

<style lang="scss" scoped>
.article-image {
  max-width: 25px;
  max-height: 25px;
}
</style>
