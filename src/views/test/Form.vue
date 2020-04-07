<template>
  <div class="page-header-index-wide">
    <a-card :body-style="{ padding: 0 }">
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title"></div>
        <div class="ant-pro-table-toolbar-option">
          <div class="ant-pro-table-toolbar-item">
            <a-button icon="plus" type="primary" @click="$router.push('/form/create')">创建表单</a-button>
          </div>
        </div>
      </div>

      <a-table :columns="columns" :dataSource="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            :key="tag"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
        </span>
      </a-table>
      <div style="padding: 15px">
        <p>菜单配置</p>
        <p>创建路由跳转表单创建表单，表单菜单页需与表单列表同级，且表单页需选择隐藏</p>
        <p>- 测试(栏目 RouteView) /form </p>
        <p>- - 表单列表（菜单 可见）/form/list</p>
        <p>- - 创建表单（菜单 隐藏菜单）/form/create</p>
      </div>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' }
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]
export default {
  data () {
    return {
      description: '不用Modal弹窗，可通过路由跳转方式，显示Form表单.',
      columns,
      data
    }
  },
  mounted () {
    console.log(this.$route)
  }
}
</script>
