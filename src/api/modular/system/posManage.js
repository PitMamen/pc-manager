import { axios } from '@/utils/request'
import { start } from 'nprogress'

/**
 * 获取登录用户信息
 */
export function getTrueUser() {
  return axios({
    url: '/user/userInfo',
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
    url: '/bdcApi/health/patient/allArticlesPage?start=' + parameter.start + '&pageSize=' + parameter.pageSize,
    method: 'get',

    data: newPara
  })
}

/**
 * h获取文章
 *
 */
export function getAllArticlesNew(parameter) {
  return axios({
    url: '/bdcApi/health/patient/allArticlesPage',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      deptCode: parameter.deptCode,
    }
  })
}

/**
 * 获取问卷
 *
 */
export function getAllQuestions(parameter) {
  parameter.start = parameter.pageNo
  var newPara = JSON.parse(JSON.stringify(parameter))
  delete newPara.pageSize
  delete newPara.start
  delete newPara.pageNo
  return axios({
    url: '/patient/qryQuestByKeyWord?start=' + parameter.start + '&pageSize=' + parameter.pageSize,
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

/**
 * 获取科室套餐列表
 *
 */
export function getDepPlans(parameter) {
  return axios({
    url: '/bdcApi/health/patient/queryGoodsList',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取科室套餐列表
 *
 */
export function getDiseases(parameter) {
  return axios({
    url: '/accountapi/businessManagement/getDiseaseList',
    method: 'get',
    params: parameter
  })
}


/**
 * 修改计划
 */
export function savePlan(parameter) {
  return axios({
    url: '/patient/savePlanTemplate',
    method: 'post',
    data: parameter
  })
}

/**
 * 上传图片
 */
 export function uploadImg(parameter) {
  return axios({
    url: '/api/contentapi/fileUpload/uploadImgFile',
    method: 'post',
    data: parameter
  })
}

/**
 * 分配计划
 */
export function dispatchPlan(parameter) {
  return axios({
    url: '/patient/distributePlan',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询计划详情
 */
export function getPlanDetail(planId) {
  return axios({
    url: '/patient/qryPlanTemplateDetail',
    method: 'post',
    data: { templateId: planId }
  })
}

/**
 * 删除计划
 */
export function delPlan(parameter) {
  return axios({
    url: '/patient/delPlanTemplate',
    method: 'post',
    data: { templateId: parameter }
  })
}

/**
 * 删除计划任务
 */
export function delPlanTask(parameter) {
  return axios({
    url: '/patient/delPlanTemplateTask',
    method: 'post',
    data: {
      templateId: parameter.templateId,
      taskId: parameter.taskId
    }
  })
}

/**
 * 删除计划任务项目
 */
export function delPlanTaskContent(parameter) {
  return axios({
    url: '/patient/delPlanTemplateTaskContent',
    method: 'post',
    data: {
      templateId: parameter.templateId,
      taskId: parameter.taskId,
      id: parameter.id
    }
  })
}

/**
 * 获取医生创建的套餐列表
 *
 */
export function getDocPlans(parameter) {
  return axios({
    // url: '/patient/qryMyPlanTemplates?pageNo =' + parameter.start + '&pageSize=' + parameter.pageSize,
    url: '/patient/qryMyPlanTemplates',
    method: 'get',
    params: parameter,
  })
}

/**
 * 获取出院患者列表
 */
export function getOutPatients(parameter) {
  return axios({
    url: '/bdcApi/patient/qryPatientList',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取健康套餐列表
 */
 export function getServicePackages(parameter) {
  return axios({
    url: '/bdcApi/patient/qryServiceGoodsList',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增检查检验
 * 
 * 检查：Check，检验： Exam
 */
export function addCheckData(content, type) {
  return axios({
    url: '/bdcApi/health/manage/addDict',
    method: 'post',
    data: {
      name: content,
      type: type
    }
  })
}

/**
 * 修改检查检验
 */
export function editCheckData(record) {
  return axios({
    url: '/bdcApi/health/manage/editDict',
    method: 'post',
    data: {
      name: record.name,
      type: record.type,
      id: record.id
    }
  })
}

/**
 * 删除检查检验
 */
export function delCheckData(parameter) {
  return axios({
    url: '/bdcApi/health/manage/deleteDict',
    method: 'post',
    data: { id: parameter.id }
  })
}

/**
 * parameter  包含pageNo pageSize type
 * 
 */
export function getCheckDataList(parameter) {
  return axios({
    url: '/bdcApi/health/manage/getDictList',
    method: 'post',
    data: {
      pageSize: parameter.pageSize,
      start: parameter.pageNo,
      type: parameter.type
    }
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
