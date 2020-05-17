import Vue from 'vue'
import { login, getInfo, logout, refreshToken } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    email: '',
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
      state.info.nickname = name
    },
    SET_WELCOME: (state, welcome) => {
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      if (avatar === null) {
        avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
      state.avatar = process.env.VUE_APP_API_BASE_URL + '/' + avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          // 缓存到刷新时间内
          Vue.ls.set(ACCESS_TOKEN, result.token, result.refresh_in * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.result
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', result.nickname)
          commit('SET_WELCOME', welcome())
          commit('SET_AVATAR', result.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    },

    // Token续期
    RefreshToken ({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken({ token: state.token }).then((response) => {
          const result = response.result
          Vue.ls.set(ACCESS_TOKEN, result.token, (result.expires_in + 10) * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 重置 Token
    ResetToken ({ commit, state }, data) {
      Vue.ls.set(ACCESS_TOKEN, data.token, data.refreshAt * 1000)
      commit('SET_TOKEN', data.token)
    }
  }
}

export default user
