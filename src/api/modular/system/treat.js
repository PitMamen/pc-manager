import { axios } from '@/utils/request'

/**
 * 列表
 */
export function list (parameter) {
  return axios({
    url: '/medical-api/rightsUse/qryUserRightsList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询
 */
 export function info (parameter) {
  return axios({
    url: '/medical-api/application/detail',
    method: 'get',
    params: parameter
  })
}

/**
 * 添加
 */
 export function add (parameter) {
  return axios({
    url: '/medical-api/application/save',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update (parameter) {
  return axios({
    url: '/medical-api/application/enable',
    method: 'post',
    data: parameter
  })
}
