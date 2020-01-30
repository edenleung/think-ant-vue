<template>
  <div class="page-header-index-wide">
    <a-modal
      :title="selected ? '修改菜单' : '添加菜单'"
      :visible="visible"
      :width="650"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="form" layout="inline">
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item label="菜单类型">
              <a-radio-group
                v-decorator="[
                  'type',
                  {
                    rules: [{ required: true, message: '请选择类型!' }]
                  }
                ]"
              >
                <a-radio-button :value="type.value" v-for="type in typeMap" :key="type.value">{{ type.text }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="上级类目" hasFeedback>
              <a-tree-select
                style="min-width:171px"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择所属组别"
                allowClear
                treeDefaultExpandAll
                :treeData="tree"
                @change="handleTreeChange"
                v-decorator="[
                  'pid',
                  {
                    rules: [{ required: true, message: '请选择所属组别!' }]
                  }
                ]"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="菜单标题" hasFeedback>
              <a-input
                placeholder="菜单标题"
                :readonly="form.getFieldValue('type') === 'action'"
                v-decorator="[
                  'title',
                  {
                    rules: [{ required: true, message: '请输入菜单标题!' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="权限标识" hasFeedback>
              <a-input
                placeholder="唯一识别码"
                :disabled="this.selected !== 0"
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '请输入唯一识别码!' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-col :span="12">
              <a-form-item v-show="form.getFieldValue('type') !== 'action'" label="组件地址">
                <a-select
                  style="width: 171px"
                  v-decorator="[
                    'component',
                    {
                      rules: [{ required: form.getFieldValue('type') !== 'action', message: '请选择组件!' }]
                    }
                  ]">
                  >
                  <a-select-opt-group v-for="(list, type) in Components" :key="type" :label="type">
                    <a-select-option :value="name" v-for="(item, name) in list" :key="name">{{ name }}</a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12" v-show="form.getFieldValue('type') !== 'action'">
              <a-form-item label="路由地址" hasFeedback>
                <a-input
                  placeholder="路由地址"
                  v-decorator="[
                    'path',
                    {
                      rules: [{ required: form.getFieldValue('type') !== 'action', message: '请填写路由地址!' }]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-col>
          <a-col :span="24">
            <a-form-item v-show="form.getFieldValue('type') === 'path'" label="Redirect">
              <a-input
                v-decorator="[
                  'redirect',
                  {
                    rules: [{ required: form.getFieldValue('type') === 'path', message: '请重定向地址!' }]
                  }
                ]"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-col :span="12">
              <a-form-item label="菜单状态">
                <a-radio-group
                  v-decorator="[
                    'status',
                    {
                      rules: [{ required: true, message: '请选择菜单状态!' }],
                      initialValue: 1
                    }
                  ]"
                >
                  <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">{{ type.label }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="菜单缓存" v-show="form.getFieldValue('type') !== 'action'">
                <a-radio-group
                  v-decorator="[
                    'keepAlive',
                    {
                      rules: [{ required: true, message: '请选择菜单缓存!' }],
                      initialValue: 0
                    }
                  ]"
                >
                  <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">{{ type.label }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="菜单可见" v-show="form.getFieldValue('type') !== 'action'">
                <a-radio-group
                  v-decorator="[
                    'visable',
                    {
                      rules: [{ required: true, message: '请选择菜单可见!' }],
                      initialValue: 1
                    }
                  ]"
                >
                  <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">
                    {{ type.label }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="隐藏子菜单" v-show="form.getFieldValue('type') !== 'action'">
                <a-radio-group
                  v-decorator="[
                    'hideChildrenInMenu',
                    {
                      rules: [{ required: true, message: '请选择隐藏子菜单!' }],
                      initialValue: 0
                    }
                  ]"
                >
                  <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">{{ type.label }}</a-radio-button>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-col>

          <a-col :span="12">
            <a-form-item v-show="form.getFieldValue('type') !== 'action'" label="查看权限">
              <a-select
                style="min-width: 171px"
                mode="tags"
                placeholder="选择查看权限"
                v-decorator="[
                  'permission'
                ]"
              >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item v-show="form.getFieldValue('type') !== 'action'" label="菜单图标">
              <a-input
                slot="default"
                style="width: 171px;"
                v-decorator="[
                  'icon'
                ]">
                <a-icon slot="prefix" type="search" />
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">规则列表</div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button v-action:PermissionAdd type="primary" icon="plus" @click="visible = true">新建</a-button>
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
        <template slot="actions" slot-scope="row">
          <template v-if="row.type !== 'menu'">-</template>
          <template v-for="(action, index) in row.actions" v-else>
            <a-popover :key="index" title="详情" trigger="click">
              <template slot="content">
                <div style="margin-bottom:15px">唯一识别码: {{ action.name }}</div>
                <a-button
                  size="small"
                  v-action:PermissionUpdate
                  type="primary"
                  ghost
                  @click="openActionModal(action)"
                  style="margin-right:10px">编辑</a-button>
                <a-button size="small" v-action:PermissionDelete type="danger" ghost @click="showDeleteConfirm(action.id)">删除</a-button>
              </template>
              <a-tag>{{ action.title }}</a-tag>
            </a-popover>
          </template>
        </template>

        <template slot="icon" slot-scope="row">
          <a-icon :type="row.icon" v-if="row.icon"/> {{ row.icon }}
        </template>

        <template slot="type" slot-scope="row">
          <a-tag :color="row.type | typeColorFilter">{{ row.type | typeTextFilter }}</a-tag>
        </template>

        <template slot="status" slot-scope="row">
          <a-badge :status="row.status | statusTypeFilter" :text="row.status | statusFilter" />
        </template>

        <template slot="tools" slot-scope="row">
          <a v-action:PermissionUpdate @click="openActionModal(row)">编辑</a>
          <a-divider type="vertical" />
          <a v-action:PermissionDelete @click="showDeleteConfirm(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { STable } from '@/components'
import { Components } from '@/config/componentConfigs'
import { fetchPermission, addPermission, updatePermission, deletePermission } from '@/api/permission'

const status = [{ label: '是', value: 1 }, { label: '否', value: 0 }]
const dataSource = [
  {
    title: '话题',
    children: [
      {
        title: 'AntDesign',
        count: 10000
      },
      {
        title: 'AntDesign UI',
        count: 10600
      }
    ]
  },
  {
    title: '问题',
    children: [
      {
        title: 'AntDesign UI 有多好',
        count: 60100
      },
      {
        title: 'AntDesign 是啥',
        count: 30010
      }
    ]
  },
  {
    title: '文章',
    children: [
      {
        title: 'AntDesign 是一个设计语言',
        count: 100000
      }
    ]
  }
]

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

const typeMap = {
  'path': {
    value: 'path',
    text: '目录',
    color: 'purple'
  },
  'menu': {
    value: 'menu',
    text: '菜单',
    color: 'blue'
  },
  'action': {
    value: 'action',
    text: '按钮',
    color: 'cyan'
  }
}

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'title'
  },
  {
    title: '唯一识别码',
    dataIndex: 'name'
  },
  {
    title: '菜单 ICON',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '可操作权限',
    scopedSlots: { customRender: 'actions' }
  },
  {
    title: '类型',
    scopedSlots: { customRender: 'type' }
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
      columns,
      typeMap,
      expandedKeys: [],
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
        return fetchPermission(Object.assign(parameter, this.queryParam)).then(res => {
          res = res.result
          const { tree, data } = res
          this.tree = tree

          // 展开所有
          this.expandedRow(data)
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
      selectedRows: [],
      dataSource,
      status,
      Components
    }
  },
  computed: {
    actions () {
      return this.$enum()
    }
  },
  components: { STable },
  mounted () {
    console.log('$enum', this.$enum())
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    typeTextFilter (type) {
      return typeMap[type].text
    },
    typeColorFilter (type) {
      return typeMap[type].color
    }
  },
  methods: {
    openActionModal (row) {
      this.visible = true
      this.selected = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue({
          ...row,
          permission: row.permission ? row.permission.split(',') : []
        })
      })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selected === 0 ? addPermission(values) : updatePermission(this.selected, values)
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
          deletePermission(id).then(res => {
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
    handleMenuClick ({ key }) {
      switch (key) {
        case 'remove': {
          // TODO
        }
      }
    },
    handleTreeChange (v) {
      if (v === '0') {
        // TODO 当选择‘根’时，类型不能选择按钮
      }
    },
    expandedRow (data) {
      data.map(item => {
        this.expandedKeys.push(item.id)
        if (item.children !== undefined) {
          this.expandedRow(item.children)
        }
      })
    },
    onActionChange (action) {
      this.form.setFieldsValue({
        title: this.actions[action].label,
        name: this.actions[action].key
      })
    }
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
.ant-form-inline .ant-form-item {
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 18px;
}
</style>
