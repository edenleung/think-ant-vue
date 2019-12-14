import { axios } from '@/utils/request'
import api from './index'

export function current () {
  return axios({
    url: api.UserCurrent,
    method: 'get'
  })
}

export function updateCurrent (data) {
  return axios({
    url: api.UserCurrent,
    method: 'put',
    data
  })
}
