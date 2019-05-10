import { axios } from '@/utils/request'

export function fetchRule(params) {
  return axios({
    url: '/auth/rule',
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
    url: '/auth/rule',
    method: 'post',
    data
  })
}

export function updateRule(id, data) {
  return axios({
    url: '/auth/rule/' + id,
    method: 'put',
    data
  })
}

export function deleteRule(params) {
  return axios({
    url: '/auth/rule/' + params.id,
    method: 'delete'
  })
}

export function fetchRole(params) {
  return axios({
    url: '/auth/role',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return axios({
    url: '/auth/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return axios({
    url: '/auth/role/' + id,
    method: 'put',
    data
  })
}

export function deleteRole(params) {
  return axios({
    url: '/auth/role/' + params.id,
    method: 'delete'
  })
}

export function fetchAccount(params) {
  return axios({
    url: '/auth/user',
    method: 'get',
    params
  })
}

export function addAccount(data) {
  return axios({
    url: '/auth/user',
    method: 'post',
    data
  })
}

export function updateAccount(id, data) {
  return axios({
    url: '/auth/user/' + id,
    method: 'put',
    data
  })
}

export function deleteAccount(params) {
  return axios({
    url: '/auth/user/' + params.id,
    method: 'delete'
  })
}