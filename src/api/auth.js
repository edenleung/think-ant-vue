import { axios } from '@/utils/request'
import api from './index'

export function fetchRule(params) {
  return axios({
    url: api.Rule,
    method: 'get',
    params
  })
}

export function fetchTree() {
  return axios({
    url: '/auth/tree',
    method: 'get'
  })
}

export function addRule (data) {
  return axios({
    url: api.Rule,
    method: 'post',
    data
  })
}

export function updateRule(id, data) {
  return axios({
    url: api.Rule + '/' + id,
    method: 'put',
    data
  })
}

export function deleteRule(params) {
  return axios({
    url: api.Rule + '/' + params.id,
    method: 'delete'
  })
}

export function fetchRole(params) {
  return axios({
    url: api.Role,
    method: 'get',
    params
  })
}

export function addRole(data) {
  return axios({
    url: api.Role,
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return axios({
    url: api.Role + '/' + id,
    method: 'put',
    data
  })
}

export function deleteRole(params) {
  return axios({
    url: api.Role + '/' + params.id,
    method: 'delete'
  })
}

export function fetchAccount(params) {
  return axios({
    url: api.User,
    method: 'get',
    params
  })
}

export function addAccount(data) {
  return axios({
    url: api.User,
    method: 'post',
    data
  })
}

export function updateAccount(id, data) {
  return axios({
    url: api.User + '/' + id,
    method: 'put',
    data
  })
}

export function deleteAccount(params) {
  return axios({
    url: api.User + '/' + params.id,
    method: 'delete'
  })
}
