<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="depts"
          :openKeys="['1', '2', '3']"
          :search="true"
          @click="onSelects"
        />
      </a-col>
      <a-col :span="19">
        <!-- <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="角色  ID">
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
              <a-button v-action:CreateAccount type="primary" icon="plus" @click="$router.push({ name: 'CreateAccountView' })">新建</a-button>
            </div>
            <!-- <template v-if="selectedRows.length">
              <div class="ant-pro-table-toolbar-item">
                <a-dropdown>
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item key="remove"><a-icon type="delete" />批量删除</a-menu-item>
                  </a-menu>
                  <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
                </a-dropdown>
              </div>
            </template> -->
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
              <a-tag color="purple" v-for="post in row.posts" :key="post.postId">{{ post.post_name }}</a-tag>
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
            <a v-action:UpdateAccount @click="$router.push({ name: 'UpdateAccountView', params: { id: row.id } })">编辑</a>
            <a-divider type="vertical" />
            <a v-action:DeleteAccount @click="showDeleteConfirm(row.id)">删除</a>
          </template>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import { STable } from '@/components'
import STree from '@/components/Tree/Tree'
import UserForm from './components/UserForm'
import { fetchAccount, deleteAccount } from '@/api/account'
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
  components: { STable, UserForm, STree },
  methods: {
    refreshTable (bool = false) {
      this.$refs.table.refresh(bool)
    },
    showDeleteConfirm (id) {
      this.$confirm({
        title: '确定删除此用户吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const hide = this.$message.loading('删除中..', 0)
          deleteAccount(id).then(res => {
            this.$message.success('删除成功！')
            this.refreshTable()
          }).finally(() => {
            hide()
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
    onSelects (selectedKeys) {
      const { key } = selectedKeys
      Object.assign(this.queryParam, {
        deptPid: key
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
