import { axios } from '@/utils/request'

export function fetchPost (params) {
  return axios({
    url: '/system/post',
    method: 'get',
    params
  })
}

export function createPost (data) {
  return axios({
    url: '/system/post',
    method: 'post',
    data
  })
}

export function updatePost (id, data) {
  return axios({
    url: `/system/post/${id}`,
    method: 'put',
    data
  })
}

export function deletePost (id) {
  return axios({
    url: `/system/post/${id}`,
    method: 'delete'
  })
}
