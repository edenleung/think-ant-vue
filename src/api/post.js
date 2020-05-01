import { axios } from '@/utils/request'
import api from './index'

export function fetchAllPost (params) {
  return axios({
    url: api.Post,
    method: 'get',
    params
  })
}

export function createPost (data) {
  return axios({
    url: api.Post,
    method: 'post',
    data
  })
}

export function updatePost (id, data) {
  return axios({
    url: `${api.Post}/${id}`,
    method: 'put',
    data
  })
}

export function deletePost (id) {
  return axios({
    url: `${api.Post}/${id}`,
    method: 'delete'
  })
}
