import { axios } from '@/utils/request'
import api from './index'

export function fetchRole (params) {
  return axios({
    url: api.Role,
    method: 'get',
    params
  })
}

export function fetchAllRole (params) {
  return axios({
    url: `${api.Role}/all`,
    method: 'get'
  })
}

export function addRole (data) {
  return axios({
    url: api.Role,
    method: 'post',
    data
  })
}

export function updateRole (id, data) {
  return axios({
    url: `${api.Role}/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole (id) {
  return axios({
    url: `${api.Role}/${id}`,
    method: 'delete'
  })
}

export function updateMode (id, data) {
  return axios({
    url: `${api.Role}/${id}/mode`,
    method: 'put',
    data
  })
}
