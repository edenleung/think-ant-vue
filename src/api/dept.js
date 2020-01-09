import { axios } from '@/utils/request'

export function fetchDept (params) {
  return axios({
    url: '/system/dept',
    method: 'get',
    params
  })
}

export function addDept (data) {
  return axios({
    url: '/system/dept',
    method: 'post',
    data
  })
}

export function updateDept (id, data) {
  return axios({
    url: `/system/dept/${id}`,
    method: 'put',
    data
  })
}

export function deleteDept (id) {
  return axios({
    url: `/system/dept/${id}`,
    method: 'delete'
  })
}
