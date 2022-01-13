import { axios } from '@/utils/request'

/**
 * 获取登录用户信息
 */
 export function getUserInfo2 () {
  return axios({
    url: '/api/user/info',
    method: 'get',
    
  })
}
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
/**
 * 获取文章列表url和body都要传参数
 *
 */
 export function getAllArticles(parameter) {
  parameter.start = parameter.pageNo
  var newPara = JSON.parse(JSON.stringify(parameter))
  delete newPara.pageSize
  delete newPara.start
  delete newPara.pageNo
  return axios({
    url: '/bdcApi/health/patient/allArticlesPage?start='+parameter.start+'&pageSize='+parameter.pageSize,
    method: 'get',
   
    data: newPara
  })
}

/**
 * 新增/修改文章信息
 *
 */
 export function saveArticle(parameter) {
  return axios({
    url: '/bdcApi/patient/saveArticle',
    method: 'post',
   
    data: parameter
  })
}
/**
 * 获取文章信息
 *
 */
 export function getArticleById(id) {
  return axios({
    url: '/bdcApi/health/patient/articleById',
    method: 'get',
    params: {
      id: id
    },
    
  })
}
/**
 * 获取科室信息
 *
 */
 export function queryDepartment(hospitalCode) {
  return axios({
    url: '/bdcApi/patient/qryDepartment',
    method: 'get',
    params: {
      hospitalCode: hospitalCode
    },
    
  })
}
/**
 * 删除文章
 *
 */
 export function delArticle(id) {
  return axios({
    url: '/bdcApi/patient/delArticle',
    method: 'get',
    params: {
      id: id
    },
    
  })
}
/**
 * 写死的获取医生列表，传入科室数据
 */
export function getDoctorsNew(parameter) {
  parameter.start = parameter.pageNo
  // var newPara = JSON.parse(JSON.stringify(parameter))
  // delete newPara.pageSize
  // delete newPara.start
  // delete newPara.pageNo
  return axios({
    url: '/schedule/qryDeptDoctors',
    method: 'post',
    params: {
      start: 0,
      pageSize: 100,
    },
    data: parameter
  })
}

export function uploadPaiban(parameter) {
  return axios({
    url: '/schedule/saveDoctorSchedule',
    method: 'post',
    data: parameter
  })
}

export function getPaibans(parameter) {
  return axios({
    url: '/schedule/qryDoctorSchedule',
    method: 'get',
    params: parameter
  })
}

export function deletePaiban(id) {
  return axios({
    url: '/schedule/delDoctorSchedule',
    method: 'get',
    params: {
      id: id
    },
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

export function getBanci(thisWeekData) {
  let newPara = {

  }
  return axios({
    url: '/schedule/qrySchedulePeriods',
    method: 'post',
    params: {
      start: 0,
      pageSize: 100,
    },
    data: newPara
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
