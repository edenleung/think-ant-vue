import { axios } from '@/utils/request'
import api from './index'

// 导出
export function orderExport (params) {
  return axios({
    url: '/order/dump',
    method: 'get',
    responseType: 'blob',
    params
  })
}
