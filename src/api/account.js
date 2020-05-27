import { axios } from '@/utils/request'
import api from './index'

export function fetchAccount (params) {
  return axios({
    url: api.User,
    method: 'get',
    params
  })
}

export function fetchData () {
  return axios({
    url: `${api.User}/data`,
    method: 'get'
  })
}

export function getAccount (id) {
  return axios({
    url: `${api.User}/${id}`,
    method: 'get'
  })
}

export function createAccount (data) {
  return axios({
    url: api.User,
    method: 'post',
    data
  })
}

export function updateAccount (id, data) {
  return axios({
    url: `${api.User}/${id}`,
    method: 'put',
    data
  })
}

export function deleteAccount (id) {
  return axios({
    url: `${api.User}/${id}`,
    method: 'delete'
  })
}
