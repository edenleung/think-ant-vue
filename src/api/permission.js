import { axios } from '@/utils/request'
import api from './index'

export function fetchPermission (params) {
  return axios({
    url: api.Permission,
    method: 'get',
    params
  })
}

export function addPermission (data) {
  return axios({
    url: api.Permission,
    method: 'post',
    data
  })
}

export function updatePermission (id, data) {
  return axios({
    url: `${api.Permission}/${id}`,
    method: 'put',
    data
  })
}

export function deletePermission (id) {
  return axios({
    url: `${api.Permission}/${id}`,
    method: 'delete'
  })
}
