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
 * 列表
 */
 export function list2 (parameter) {
  return axios({
    url: '/medical-api/rightsUse/qryHistoryByPage',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询
 */
 export function info (parameter) {
  return axios({
    url: '/medical-api/rightsUse/getRightsReqData',
    method: 'get',
    params: parameter
  })
}
