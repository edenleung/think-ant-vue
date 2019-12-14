import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401) {
      if (data.code === 50401) {
        notification.error({
          message: 'Unauthorized',
          description: 'Authorization verification failed'
        })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
      } else if (data.code === 50402) {
        const key = `open${Date.now()}`
        notification.open({
          message: 'Notification',
          description:
            'Token已过期，你暂不能操作任何操作，是否续期(10秒后重新登录)？',
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    store.dispatch('RefreshToken').then(() => {
                      message.success('登录已续期')
                      setTimeout(() => {
                        window.location.reload()
                      }, 1500)
                    })
                  }
                }
              },
              'Confirm'
            )
          },
          key,
          onClose: close
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  const res = response.data
  if (res.code !== 20000) {
    message.warning(res.message)
    return Promise.reject(new Error('error'))
  } else {
    return response.data
  }
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
