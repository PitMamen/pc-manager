import { axios } from '@/utils/request'

/**
 * 列表
 */
export function list (parameter) {
  return axios({
    url: '/follow-api/ward/getWardPageList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询
 */
 export function info2 (parameter) {
  return axios({
    url: `/follow-api/ward/getWardDepartmentMapping/${parameter.wardId}`,
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add (parameter) {
  return axios({
    url: '/follow-api/ward/addWard',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update (parameter) {
  return axios({
    url: '/follow-api/ward/modifyWard',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改2
 */
 export function update2 (parameter) {
  return axios({
    url: '/follow-api/ward/saveWardDepartmentMapping',
    method: 'post',
    data: parameter
  })
}
