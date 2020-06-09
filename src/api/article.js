import { axios } from '@/utils/request'
import api from './index'

export function fetchArticleCategory () {
  return axios({
    url: `${api.ArticleCategory}`,
    method: 'get'
  })
}

export function createArticleCategory (data) {
  return axios({
    url: `${api.ArticleCategory}`,
    method: 'post',
    data
  })
}

export function updateArticleCategory (id, data) {
  return axios({
    url: `${api.ArticleCategory}/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticleCategory (id) {
  return axios({
    url: `${api.ArticleCategory}/${id}`,
    method: 'delete'
  })
}

export function fetchArticle (params) {
  return axios({
    url: `${api.Article}`,
    method: 'get',
    params
  })
}

export function getArticle (id) {
  return axios({
    url: `${api.Article}/${id}`,
    method: 'get'
  })
}

export function createArticle (data) {
  return axios({
    url: `${api.Article}`,
    method: 'post',
    data
  })
}

export function updateArticle (id, data) {
  return axios({
    url: `${api.Article}/${id}`,
    method: 'put',
    data
  })
}

export function deleteArticle (id) {
  return axios({
    url: `${api.Article}/${id}`,
    method: 'delete'
  })
}
