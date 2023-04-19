import { axios } from '@/utils/request'

/**
 * 列表
 */
export function list (parameter) {
  return axios({
    url: '/medical-api/tfUserAppraise/getList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询
 */
 export function info (parameter) {
  return axios({
    url: `/medical-api/tfUserAppraise/getAppraiseById/${parameter}`,
    method: 'post'
  })
}

/**
 * 修改
 */
 export function update (parameter) {
  return axios({
    url: '/medical-api/tfUserAppraise/checkUserAppraise',
    method: 'post',
    data: parameter
  })
}



