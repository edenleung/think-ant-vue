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

    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">规则列表</div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:rule-add type="primary" icon="plus" @click="openModal">新建</a-button>
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
              <a-icon type="reload" />
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
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { STable } from '@/components'
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
      queryParam: {},
      loadData: parameter => {
        return this.fetchRule(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      loading: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      info: {},
      tree: [],
      selected: 0,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(['fetchRule', 'deleteRule']),
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
              this.refreshTable()
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
            this.refreshTable()
          })
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
    handleMenuClick () {}
  }
}
</script>

<style scoped>
.rule-list {
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 12px;
  min-height: 23px;
}
</style>
