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
				<a-form-item label="登录账号">
					<a-input
						:readonly="this.selected !== 0"
						placeholder="请入登录账号"
						v-decorator="['name', {
							rules: [{ required: true, message: '请输入登录账号!' }]
						}]"
					/>
				</a-form-item>

				<a-form-item label="登录密码">
					<a-input
						:placeholder="this.selected === 0 ? '请入登录密码' : '如需修改密码请输入新密码'"
						v-decorator="['password', {
							rules: [{ required: this.selected === 0, message: '请输入登录密码!' }]
						}]"
					/>
				</a-form-item>

				<a-form-item label="用户昵称">
					<a-input
						placeholder="请入用户昵称"
						v-decorator="['nickname', {
							rules: [{ required: true, message: '请输入用户名称!' }]
						}]"
					/>
				</a-form-item>

				<a-form-item label="选择角色">
					<a-select
						mode="tags"
            v-decorator="['roles', {
              rules: [{ required: true, message: '请选择所属组别!' }]
            }]"
            placeholder="请选择角色"
          >
            <a-select-option v-for="(role, index) in roles" :value="role.id.toString()" :key="index">
              {{ role.title }}
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
				<a-button v-action:add @click="openModal" type="primary" ghost>添加</a-button>
			</a-row>

			<a-table :columns="columns"
        :rowKey="item => item.id"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
				>

				<template slot="status" slot-scope="row">
          <template v-if="row.status === 1">正常</template>
          <template v-else>禁用</template>
        </template>

				<p slot="expandedRowRender" slot-scope="row">
					<a-row>
						<a-col class='rule-list' span="12" v-for="(item, index) in rules" :key="index">
							<a-row>
								<a-col span="4">{{ item.title }}：</a-col>
								<a-col span="20">
									<template v-for="(action, i) in item.actions">
										<a-tag :key="i" v-if="row.rules.indexOf(action.id) !== -1">
											{{ action.title }}
										</a-tag>
									</template>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</p>

				<template slot="tools" slot-scope="row">
          <a-button v-action:update type="primary" ghost @click="openInfoModal(row)" style="margin-right: 15px">编辑</a-button>
          <a-button v-action:delete type="danger" ghost @click="showDeleteConfirm(row.id)">删除</a-button>
        </template>
			</a-table>
		</a-card>
	</div>
</template>
<script>
import { mapActions } from 'vuex'

const columns = [{
  title: '账号名',
  dataIndex: 'nickname',
}, {
  title: '登录账号',
  dataIndex: 'name',
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
			visible: false,
			loading: false,
			confirmLoading: false,
			pagination: {},
			data: [],
			rules: [],
			roles: [],
			form: this.$form.createForm(this),
			columns,
			selected: 0
		}
	},
	mounted() {
		this.fetch()
	},
	methods: {
		...mapActions([
			'fetchAccount',
			'deleteAccount'
		]),
		fetch(params = {}) {
			this.loading = true
			this.fetchAccount(params).then(res => {
				const { users, roles, rules } = res
				this.data = users.data
				this.pagination = users.pagination
				this.rules = rules.data
				this.roles = roles.data
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
		openInfoModal(row) {
			this.visible = true
			this.selected = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue(
          {
            name: row.name,
            nickname: row.nickname,
						status: row.status,
						roles: row.roles.map(item => { return item.id.toString() })
          }
        )
      })
		},
		handleSubmit() {
			this.form.validateFields(
        (err, values) => {
          if (!err) {
            this.confirmLoading = true
            const action = this.selected === 0 ? 'addAccount' : 'updateAccount'
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
			this.form.resetFields()
			this.selected = 0
		},
		showDeleteConfirm(id) {
      this.$confirm({
        title: '确定删除此用户吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteAccount({ id: id}).then(res => {
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

