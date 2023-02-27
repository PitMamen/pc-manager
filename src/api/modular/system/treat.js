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
 * 列表2
 */
 export function list2 (parameter) {
  return axios({
    url: '/medical-api/rightsUse/qryHistoryByPage',
    method: 'post',
    data: parameter
  })
}

/**
 * 列表3
 */
 export function list3 (orderId) {
  return axios({
    url: `/medical-api/rightsUse/qryRightsUseLogForOrderId/${orderId}`,
    method: 'get'
  })
}

/**
 * 查询
 */
 export function info (parameter) {
  return axios({
    url: '/medical-api/rightsUse/getRightsInfo',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询2
 */
 export function info2 (parameter) {
  return axios({
    url: '/medical-api/rightsUse/getRightsReqData',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询3
 */
 export function info3 (parameter) {
  return axios({
    url: '/health-api/health/patient/articleById',
    method: 'get',
    params: parameter
  })
}

/**
 * 查询4
 */
 export function info4 (parameter) {
  return axios({
    url: '/medical-api/admorder/detail',
    method: 'get',
    params: parameter
  })
}


