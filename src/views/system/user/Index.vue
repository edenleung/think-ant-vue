<template>
  <div class="page-header-index-wide">
    <a-row :gutter="16">
      <a-col :xs="{span: 24}" :lg="4">
        <a-card :body-style="{ padding: '0 24px' }">
          <a-tree
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @select="onSelects"
            :selectedKeys="selectedKeys"
            :treeData="depts"
          />
        </a-card>
      </a-col>
      <a-col :xs="{span: 24}" :lg="20">
        <a-card :body-style="{ padding: 0 }">
          <!-- <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="角色ID">
                    <a-input placeholder="请输入"/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="状态">
                    <a-select placeholder="请选择" default-value="0">
                      <a-select-option value="0">全部</a-select-option>
                      <a-select-option value="1">关闭</a-select-option>
                      <a-select-option value="2">运行中</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-button type="primary">查询</a-button>
                    <a-button style="margin-left: 8px">重置</a-button>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div> -->

          <div class="ant-pro-table-toolbar">
            <div class="ant-pro-table-toolbar-title"></div>
            <div class="ant-pro-table-toolbar-option">
              <div class="ant-pro-table-toolbar-item">
                <a-button type="primary" icon="plus" @click="visible = true">新建</a-button>
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
            :expandRowByClick="true"
            :expandIcon="expandIcon"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          >

            <template slot="dept" slot-scope="row">
              <a-tag color="purple">{{ row.dept_name }}</a-tag>
            </template>

            <template slot="post" slot-scope="row">
              <span v-if="row.posts.length">
                <a-tag color="purple" v-for="post in row.posts" :key="post.postId">{{ post.postName }}</a-tag>
              </span>
              <span v-else>-</span>
            </template>

            <template slot="status" slot-scope="row">
              <template v-if="row.status === 1">正常</template>
              <template v-else>禁用</template>
            </template>

            <template slot="expandedRowRender" slot-scope="row">
              <a-row>
                <a-col class="rule-list" span="12" v-for="(item, index) in rules" :key="index">
                  <a-row>
                    <a-col span="4">{{ item.title }}：</a-col>
                    <a-col span="20">
                      <template v-if="!item.actions.length">-</template>
                      <template v-for="(action, i) in item.actions">
                        <a-tag :key="i" v-if="row.rules.indexOf(action.id) !== -1">
                          {{ action.title }}
                        </a-tag>
                      </template>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </template>

            <template slot="tools" slot-scope="row">
              <a v-action:AccountUpdate @click="showModal(row)">编辑</a>
              <a-divider type="vertical" />
              <a v-action:AccountDelete @click="showDeleteConfirm(row.id)">删除</a>
            </template>
          </s-table>
        </a-card>
      </a-col>
    </a-row>

    <UserForm
      ref="userForm"
      :visible="visible"
      :selecteId="selecteId"
      :deptTree="depts"
      :roleTree="roles"
      :posts="posts"
      :confirmLoading="confirmLoading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
<script>
import { STable } from '@/components'
import UserForm from './components/UserForm'
import { fetchAccount, addAccount, updateAccount, deleteAccount } from '@/api/account'
const columns = [
  {
    title: '账号名',
    dataIndex: 'nickname'
  },
  {
    title: '登录账号',
    dataIndex: 'name'
  },
  {
    title: '部门',
    scopedSlots: { customRender: 'dept' }
  },
  {
    title: '岗位',
    scopedSlots: { customRender: 'post' }
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
      description: '',
      visible: false,
      confirmLoading: false,
      pagination: {},
      rules: [],
      roles: [],
      depts: [],
      posts: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      columns,
      selecteId: 0,
      queryParam: {},
      loadData: parameter => {
        return fetchAccount(Object.assign(parameter, this.queryParam)).then(res => {
          res = res.result
          const { users, roles, rules, depts, posts } = res
          this.rules = rules
          this.roles = roles
          this.depts = depts
          this.posts = posts

          // 展开组织架构
          this.expandedDept(depts)
          return users
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  components: { STable, UserForm },
  methods: {
    showModal (row) {
      this.visible = true
      this.selecteId = row.id
      this.$nextTick(() => {
        this.$refs.userForm.form.setFieldsValue({
          name: row.name,
          nickname: row.nickname,
          status: row.status,
          dept_id: row.dept_id,
          posts: row.posts.map(item => item.postId),
          roles: row.roles.map(item => {
            return item.id.toString()
          })
        })
      })
    },
    handleSubmit () {
      this.$refs.userForm.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const promise = this.selecteId === 0 ? addAccount(values) : updateAccount(this.selecteId, values)
          promise.then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: this.selecteId === 0 ? '添加成功！' : '更新成功！'
            })
            this.refreshTable()
            this.handleCancel()
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    refreshTable (bool = false) {
      this.$refs.table.refresh(bool)
    },
    handleCancel () {
      this.visible = false
      this.$refs.userForm.form.resetFields()
      this.selecteId = 0
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此用户吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteAccount(id).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！'
            })
            this.refreshTable()
          })
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleMenuClick () {},
    expandIcon ({ expanded }) {
      if (expanded === true) {
        return <a-icon type='down' />
      }
      return <a-icon type='right' />
    },
    onSelect (value, node, extra) {
      if (node.dataRef.children.length > 0) {
        this.$message.info('不能选择父节点')
        this.$nextTick(() => {
          this.form.setFieldsValue({
            dept_id: null
          })
        })
        return false
      }
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelects (selectedKeys, info) {
      console.log('onSelect', info)
      const { node: { value } } = info
      this.selectedKeys = selectedKeys
      Object.assign(this.queryParam, {
        deptPid: value
      })
      this.refreshTable(true)
    },
    expandedDept (depts) {
      depts.map(dept => {
        this.expandedKeys.push(dept.value)
        if (dept.children !== undefined) {
          this.expandedDept(dept.children)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.company {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 24px;
    line-height: 64px;
    &-title {
      flex: 1 1;
      color: #000;
      font-size: 16px;
      line-height: 24px;
      opacity: .85;
    }
}
</style>
