<template>
  <div class="page-header-index-wide">
    <a-modal
      title="详情"
      :visible="visible"
      :width="800"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="唯一识别码" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input
            placeholder="唯一识别码 用作权限验证"
            :disabled="this.selected !== 0"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入唯一识别码!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="权限名称" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback>
          <a-input
            placeholder="权限名称"
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: '请输入权限名称!' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item label="所属组别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="[
              'pid',
              {
                rules: [{ required: true, message: '请选择所属组别!' }]
              }
            ]"
            placeholder="请选择所属组别"
          >
            <a-select-option :value="0">顶级分类</a-select-option>

            <a-select-option v-for="(item, index) in tree" :value="item.id" :key="index">{{
              item.title
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="[
              'status',
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

    <a-card>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="openModal">新建</a-button>
      </div>

      <a-table
        :columns="columns"
        :rowKey="item => item.id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="actions" slot-scope="row">
          <template v-for="(action, index) in row.actions">
            <a-popover :key="index" title="详情" trigger="click">
              <template slot="content">
                <div style="margin-bottom:15px">唯一识别码: {{ action.name }}</div>
                <a-button
                  size="small"
                  v-action:rule-update
                  type="primary"
                  ghost
                  @click="openActionModal(action)"
                  style="margin-right:10px">编辑</a-button>
                <a-button size="small" v-action:rule-delete type="danger" ghost @click="showDeleteConfirm(action.id)">删除</a-button>
              </template>
              <a-tag>{{ action.title }}</a-tag>
            </a-popover>
          </template>
        </template>

        <template slot="status" slot-scope="row">
          <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
        </template>

        <template slot="tools" slot-scope="row">
          <a v-action:rule-update @click="openActionModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:rule-delete @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'

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
    title: '权限名称',
    dataIndex: 'title'
  },
  {
    title: '可操作权限',
    scopedSlots: { customRender: 'actions' }
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
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      columns: columns,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      data: [],
      pagination: {},
      loading: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      info: {},
      tree: [],
      selected: 0
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
  mounted () {
    this.fetch()
  },
  methods: {
    ...mapActions(['fetchRule', 'deleteRule']),
    fetch (params = {}) {
      this.loading = true
      this.fetchRule(params)
        .then(res => {
          const { data, pagination, tree } = res
          this.data = data
          this.pagination = pagination
          this.tree = tree
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleTableChange (pagination, filters, sorter) {
      this.fetch({
        page: pagination.current,
        pageSize: pagination.pageSize
      })
    },
    openModal () {
      this.visible = true
    },
    openActionModal (row) {
      this.visible = true
      this.selected = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue({
          title: row.title,
          name: row.name,
          action: row.action,
          pid: row.pid,
          status: row.status
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const action = this.selected === 0 ? 'addRule' : 'updateRule'
          values.selectId = this.selected
          this.$store
            .dispatch(action, values)
            .then(res => {
              this.$notification['success']({
                message: '成功通知',
                description: this.selected === 0 ? '添加成功！' : '更新成功！'
              })
              this.fetch()
              this.handleCancel()
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.selected = 0
      this.form.resetFields()
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此规则吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteRule({ id: id }).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.fetch({ page: this.data.length === 1 ? this.pagination.current - 1 : this.pagination.current, pageSize: this.pagination.pageSize })
          })
        }
      })
    }
  }
}
</script>
