import { axios } from '@/utils/request'
import api from './index'

export function fetchMenu (params) {
  return axios({
    url: api.Menu + '/tree',
    method: 'get',
    params
  })
}

export function addMenu (data) {
  return axios({
    url: api.Menu,
    method: 'post',
    data
  })
}

export function updateMenu (id, data) {
  return axios({
    url: `${api.Menu}/${id}`,
    method: 'put',
    data
  })
}

export function deleteMenu (id) {
  return axios({
    url: `${api.Menu}/${id}`,
    method: 'delete'
  })
}

export function addAction (data) {
  return axios({
    url: api.Action,
    method: 'post',
    data
  })
}

export function updateAction (id, data) {
  return axios({
    url: `${api.Action}/${id}`,
    method: 'put',
    data
  })
}

export function deleteAction (id) {
  return axios({
    url: `${api.Action}/${id}`,
    method: 'delete'
  })
}
