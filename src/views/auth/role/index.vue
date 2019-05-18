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
				<a-form-item label="唯一标识">
					<a-input
						placeholder="请入唯一标识（英文即可）"
						v-decorator="['name', {
							rules: [{ required: true, message: '请输入唯一标识!' }]
						}]"
					/>
				</a-form-item>

				<a-form-item label="角色名称">
					<a-input
						placeholder="请入角色名称"
						v-decorator="['title', {
							rules: [{ required: true, message: '请输入角色名称!' }]
						}]"
					/>
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

				<a-form-item label="拥有权限">
					<a-row v-for="(item, index) in rules" :key="index">
						<a-col :span="4">{{ item.title }}</a-col>
						<a-col :span="20">
							<a-checkbox-group :options="item.actions" v-model="checkedList"/>
						</a-col>
					</a-row>
				</a-form-item>

			</a-form>
		</a-modal>

		<a-card>
			<a-row class="tools">
				<a-button v-action:add @click="openRole" type="primary" ghost>添加</a-button>
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
										<a-tag :key="i" v-if="row.permissions.indexOf(action.id) !== -1">
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
  title: '唯一识别码',
  dataIndex: 'name',
}, {
  title: '角色名称',
  dataIndex: 'title',
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
			loading: false,
			confirmLoading: false,
			visible: false,
			form: this.$form.createForm(this),
			rules: [],
			checkedList: [],
			selected: 0,
			data: [],
			pagination: {},
			columns
		}
	},
	mounted() {
		this.fetch()
	},
	methods: {
		...mapActions([
			'fetchRule',
			'fetchRole',
			'deleteRole'
		]),
		fetch(params = {}) {
			this.loading = true
			this.fetchRole(params).then(res => {
				const { data, pagination } = res.roles
				this.data = data
				this.pagination = pagination

				this.rules = res.rules.data
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
		openRole() {
			this.visible = true
		},
		handleSubmit() {
			this.form.validateFields(
        (err, values) => {
          if (!err) {
            this.confirmLoading = true
            const action = this.selected === 0 ? 'addRole' : 'updateRole'
						values.selectId = this.selected
						values.rules = this.checkedList
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
			this.checkedList = []
		},
		openInfoModal(row) {
			this.visible = true
			if (row.permissions) {
				this.checkedList = row.permissions
			}
			this.selected = row.id
      this.$nextTick(() => {
        this.form.setFieldsValue(
          {
            title: row.title,
            name: row.name,
            status: row.status
          }
        )
      })
		},
		showDeleteConfirm(id) {
			this.$confirm({
        title: '确定删除此角色吗?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.deleteRole({ id: id }).then(res => {
            this.$notification['success']({
              message: '成功通知',
              description: '删除成功！',
            })
            this.fetch()
          })
        }
      })
		}
  },
}
</script>

