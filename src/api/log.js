import { axios } from '@/utils/request'
import api from './index'

export function fetchLog (params) {
  return axios({
    url: api.Log,
    method: 'get',
    params
  })
}

export function deleteLog (params) {
  return axios({
    url: api.Log,
    method: 'delete',
    params
  })
}
