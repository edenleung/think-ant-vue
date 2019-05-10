import { 
  fetchRule, addRule, fetchTree, updateRule, deleteRule,
  fetchRole, addRole, updateRole, deleteRole,
  fetchAccount, addAccount, updateAccount, deleteAccount
} from '@/api/auth'

const auth = {
  state: {
  },

  mutations: {
  },

  actions: {
    // 规则列表
    fetchRule(state, params) {
      return new Promise((resolve, reject) => {
        fetchRule(params).then(response => {
          const result = response.data
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      }) 
    },

    // 获取树型结构
    fetchTree(state) {
      return new Promise((resolve, reject) => {
        fetchTree().then(response => {
          const result = response.data
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      }) 
    },

    // 添加规则
    addRule (state, data) {
      return new Promise((resolve, reject) => {
        addRule(data).then(response => {
          const result = response.data
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 更新规则
    updateRule(state, data) {
      const id = data.selectId
      delete data.selectId
      return new Promise((resolve, reject) => {
        updateRule(id, data).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除规则
    deleteRule(state, params) {
      return new Promise((resolve, reject) => {
        deleteRule(params).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取角色
    fetchRole(state, params) {
      return new Promise((resolve, reject) => {
        fetchRole(params).then(response => {
          const result = response.data
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 添加角色
    addRole(state, data) {
      return new Promise((resolve, reject) => {
        addRole(data).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 更新角色
    updateRole(state, data) {
      const id = data.selectId
      delete data.selectId
      return new Promise((resolve, reject) => {
        updateRole(id, data).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除角色
    deleteRole(state, params) {
      return new Promise((resolve, reject) => {
        deleteRole(params).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取管理员
    fetchAccount(state, params) {
      return new Promise((resolve, reject) => {
        fetchAccount(params).then(response => {
          const result = response.data
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 添加管理员
    addAccount(state, data) {
      return new Promise((resolve, reject) => {
        addAccount(data).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 更新管理员
    updateAccount(state, data) {
      const id = data.selectId
      delete data.selectId
      return new Promise((resolve, reject) => {
        updateAccount(id, data).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除管理员
    deleteAccount(state, params) {
      return new Promise((resolve, reject) => {
        deleteAccount(params).then(_ => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default auth
