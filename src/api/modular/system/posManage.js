import { axios } from '@/utils/request'


/**
 * 获取医生列表url和body都要传参数
 *
 * @author yubaoshan
 * @date 2020/5/25 01:31
 */
export function getDoctors(parameter) {
  parameter.start = parameter.pageNo
  var newPara = JSON.parse(JSON.stringify(parameter)) 
  delete newPara.pageSize
  delete newPara.start
  delete newPara.pageNo
  return axios({
    url: '/schedule/qryDeptDoctors',
    method: 'post',
    params: {
      start: parameter.start,
      pageSize: parameter.pageSize,
    },
    data: newPara
  })
}


export function changeStatus(parameter) {
  return axios({
    url: '/schedule/updateDeptDoctor',
    method: 'post',
    data: parameter
  })
}

export function getKeShiData(parameter) {
  return axios({
    url: '/bdcApi/health/patient/queryDepartment',
    method: 'get',
    params: parameter
  })
}

/**
 * 系统职位列表
 *
 * @author yubaoshan
 * @date 2020/6/21 23:50
 */
export function sysPosList(parameter) {
  return axios({
    url: '/sysPos/list',
    method: 'get',
    params: parameter
  })
}

/**
 * 添加系统职位
 *
 * @author yubaoshan
 * @date 2020/5/25 01:31
 */
export function sysPosAdd(parameter) {
  return axios({
    url: '/sysPos/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑系统职位
 *
 * @author yubaoshan
 * @date 2020/5/25 01:31
 */
export function sysPosEdit(parameter) {
  return axios({
    url: '/sysPos/edit',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除系统职位
 *
 * @author yubaoshan
 * @date 2020/5/25 01:31
 */
export function sysPosDelete(parameter) {
  return axios({
    url: '/sysPos/delete',
    method: 'post',
    data: parameter
  })
}
