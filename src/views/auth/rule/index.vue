<template>
  <div class="page-header-index-wide">
    <a-modal
      title="详情"
      :visible="visible"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="唯一识别码">
          <a-input
            placeholder="前端路由菜单识别码"
            v-decorator="['action', {
              rules: [{ required: true, message: '请输入唯一识别码!' }]
            }]"
          />
        </a-form-item>

        <a-form-item label="权限规则">
          <a-input
            placeholder="权限规则 用作权限验证"
            v-decorator="['name', {
              rules: [{ required: true, message: '请输入权限规则!' }]
            }]"
          />
        </a-form-item>

        <a-form-item label="权限名称">
          <a-input 
            placeholder="权限名称"
            v-decorator="['title', {
              rules: [{ required: true, message: '请输入权限名称!' }]
            }]"
          />
        </a-form-item>

        <a-form-item label="所属组别">
          <a-select
            v-decorator="['pid', {
              rules: [{ required: true, message: '请选择所属组别!' }]
            }]"
            placeholder="请选择所属组别"
          >
            <a-select-option :value="0">
              顶级分类
            </a-select-option>

            <a-select-option v-for="(item, index) in tree" :value="item.id" :key="index">
              {{ item.cname | html }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-decorator="['status', {
              rules: [{ required: true, message: '请选择状态!' }]
            }]"
            placeholder="请选择"
          >
            <a-select-option :value="1">
              正常
            </a-select-option>
            <a-select-option :value="0">
              禁用
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card>
      <a-row class="tools">
        <a-button v-action:add type="primary" ghost @click="openModal">添加</a-button>
      </a-row>

      <a-table :columns="columns"
        :rowKey="item => item.id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="actions" slot-scope="row">
          <template v-for="(action, index) in row.actions">
            <a-popover
              :key="index"
              title="详情"
              trigger="click"
            >
              <template slot="content">
                <div style="margin-bottom:15px">唯一识别码: {{ action.action }}</div>
                <a-button size='small' v-action:update type='primary' ghost @click="openActionModal(action)" style="margin-right:10px">编辑</a-button>
                <a-button size='small' v-action:delete type='danger' ghost @click="showDeleteConfirm(action.id)">删除</a-button>
              </template>
              <a-tag>{{ action.title }}</a-tag>
            </a-popover>
          </template>
        </template>

        <template slot="status" slot-scope="row">
          <template v-if="row.status === 1">正常</template>
          <template v-else>禁用</template>
        </template>

        <template slot="tools" slot-scope="row">
          <a-button v-action:update type="primary" ghost @click="openActionModal(row)" style="margin-right: 15px">编辑</a-button>
          <a-button v-action:delete type="danger" ghost @click="showDeleteConfirm(row.id)">删除</a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { createElement } from 'vue'
const columns = [{
  title: '唯一识别码',
  dataIndex: 'permissionId',
}, {
  title: '权限名称',
  dataIndex: 'title',
}, {
  title: '可操作权限',
  scopedSlots: { customRender: 'actions' }
}, {
  title: '状态',
  scopedSlots: { customRender: 'status' }
}, {
  title: '操作',
  scopedSlots: { customRender: 'tools' }
}]

export default {
  data() {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      columns: columns,
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
    html: (value) => {
      var arrEntities = {'nbsp' : '  '};
      return value.replace(/&(nbsp);/ig, function(all, t){return arrEntities[t]})
    }
  },
  mounted() {
    this.fetch()
    this.fetchTree().then(res => {
      this.tree = res
    })
  },
  methods: {
    ...mapActions([
      'fetchRule',
      'fetchTree',
      'deleteRule'
    ]),
    fetch(params = {}) {
      this.loading = true
      this.fetchRule(params).then(res => {
        const { data, pagination } = res
        this.data = data
        this.pagination = pagination
      }).finally(() => {
        this.loading = false
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.fetch({
        page: pagination.current,
        pageSize: pagination.pageSize
      })
    },
    openModal() {
      this.visible = true
    },
    openActionModal: function(row) {
      this.visible = true
      this.selected = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue(
          {
            title: row.title,
            name: row.name,
            action: row.action,
            pid: row.pid,
            status: row.status
          }
        )
      })
    },
    handleSubmit() {
      this.form.validateFields(
        (err, values) => {
          if (!err) {
            this.confirmLoading = true
            const action = this.selected === 0 ? 'addRule' : 'updateRule'
            values.selectId = this.selected
            this.$store.dispatch(action, values).then(res => {
              this.$notification['success']({
                message: '成功通知',
                description: this.selected === 0 ? '添加成功！' : '更新成功！',
              })
              this.fetch()
              this.handleCancel()
            })
            .finally(() => {
              this.confirmLoading = false
						})
          }
        }
      )
    },
    handleCancel() {
      this.visible = false
      this.selected = 0
      this.form.resetFields()
    },
    showDeleteConfirm(id) {
      this.$confirm({
        title: '确定删除此规则吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteRule({ id: id}).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！',
            })
            this.fetch()
          })
        }
      })
    }
  }
}
</script>
