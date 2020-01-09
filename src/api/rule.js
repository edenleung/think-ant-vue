import { axios } from '@/utils/request'
import api from './index'

export function fetchRule (params) {
  return axios({
    url: api.Rule,
    method: 'get',
    params
  })
}

export function addRule (data) {
  return axios({
    url: api.Rule,
    method: 'post',
    data
  })
}

export function updateRule (id, data) {
  return axios({
    url: `${api.Rule}/${id}`,
    method: 'put',
    data
  })
}

export function deleteRule (id) {
  return axios({
    url: `${api.Rule}/${id}`,
    method: 'delete'
  })
}
