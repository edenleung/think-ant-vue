import { axios } from '@/utils/request'

import api from './index'

export function fetchDept (params) {
  return axios({
    url: api.Dept,
    method: 'get',
    params
  })
}

export function addDept (data) {
  return axios({
    url: api.Dept,
    method: 'post',
    data
  })
}

export function updateDept (id, data) {
  return axios({
    url: `${api.Dept}/${id}`,
    method: 'put',
    data
  })
}

export function deleteDept (id) {
  return axios({
    url: `${api.Dept}/${id}`,
    method: 'delete'
  })
}
