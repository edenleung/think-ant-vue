import { axios } from '@/utils/request'
import api from './index'

export function fetchLog (params) {
  return axios({
    url: api.Log.Acount,
    method: 'get',
    params
  })
}

export function deleteLog (params) {
  return axios({
    url: api.Log.Acount,
    method: 'delete',
    params
  })
}

export function fetchDbLog (params) {
  return axios({
    url: api.Log.Db,
    method: 'get',
    params
  })
}

export function deleteDbLog (params) {
  return axios({
    url: api.Log.Db,
    method: 'delete',
    params
  })
}
