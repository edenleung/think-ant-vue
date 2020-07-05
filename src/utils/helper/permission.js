const PERMISSION_ENUM = {
  'Create': { key: 'Create', label: '新增' },
  'Delete': { key: 'Delete', label: '删除' },
  'Update': { key: 'Update', label: '修改' },
  'Save': { key: 'Save', label: '保存' },
  'Query': { key: 'Query', label: '查询' },
  'Info': { key: 'Info', label: '详情' },
  'Fetch': { key: 'Fetch', label: '列表' },
  'Enable': { key: 'Enable', label: '启用' },
  'Disable': { key: 'Disable', label: '禁用' },
  'Import': { key: 'Import', label: '导入' },
  'Export': { key: 'Export', label: '导出' }
}

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return (permissions) => {
          const [permission, action] = permissions.split('.')
          const permissionList = _this.$store.getters.roles.permissions
          return permissionList.find((val) => {
            return val.permissionId === permission
          }).actionList.findIndex((val) => {
            return val === action
          }) > -1
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        // const _this = this;
        return (val) => {
          let result = PERMISSION_ENUM
          val && val.split('.').forEach(v => {
            result = result && result[v] || null
          })
          return result
        }
      }
    }
  })
}

export default plugin
