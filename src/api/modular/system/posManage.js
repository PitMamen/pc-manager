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
    url: '/bdcApi/health/patient/allArticlesPage?start=' + parameter.start + '&pageSize=' + parameter.pageSize + '&type=' + parameter.source,
    method: 'get',

    data: newPara
  })
}

/**
 * 获取文章  新增计划
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
 * 获取文章  教育文章
 *
 */
export function getAllArticlesTeach(parameter) {
  return axios({
    url: '/bdcApi/health/patient/allArticlesPage',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      // deptCode: parameter.deptCode,
      type: parameter.source,
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
 * 新增/修改文章信息，微信公众号推送文章
 *
 */
export function saveArticleWeixin(parameter) {
  return axios({
    url: '/pushapi/health/wx/uploadNews',
    method: 'post',

    data: parameter
  })
}

/**
 * 获取科室信息
 *
 */
export function pushArticle(param) {
  return axios({
    url: '/bdcApi/patient/pushWeixinArticle',
    method: 'get',
    params: param,
  })
}

/**
 * 获取二维码链接
 *
 */
export function getQrUrl(param) {
  return axios({
    url: '/pushapi/wx/qrcode/getQrCode',
    method: 'get',
    params: param,

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
 * 删除商品属性
 *
 */
export function delGoodsAttr(id) {
  return axios({
    url: '/bdcApi/patient/delGoodsAttr',
    method: 'get',
    params: {
      id: id
    },

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
    // url: '/bdcApi/patient/qryPatientList',
    url: '/bdcApi/patient/qryPatientListByReg',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增科室接口
 */
export function newDept(parameter) {
  return axios({
    url: '/accountapi/businessManagement/addDepartment',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增专病接口
 */
export function newDisease(parameter) {
  return axios({
    url: '/accountapi/businessManagement/addDiseaseList',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增病区接口
 */
export function newDiseaseArea(parameter) {
  return axios({
    url: '/accountapi/businessManagement/addInpatientArea',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除科室接口
 */
export function delDept(parameter) {
  return axios({
    url: '/accountapi/businessManagement/deleteDepartment',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除专病接口
 */
export function delDisease(parameter) {
  return axios({
    url: '/accountapi/businessManagement/deleteDisease',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除病区接口
 */
export function delDiseaseArea(parameter) {
  return axios({
    url: '/accountapi/businessManagement/deleteInpatientArea',
    method: 'post',
    data: parameter
  })
}

/**
 * 科室接口列表  科室后面都用这个接口
 * @param {} parameter 
 * @returns 
 */
export function getDepts(parameter) {
  return axios({
    url: '/accountapi/businessManagement/getDepartmentList',
    method: 'get',
    params: parameter
  })
}

export function getDiseasesNew(parameter) {
  return axios({
    url: '/accountapi/businessManagement/getDiseaseList',
    method: 'get',
    params: parameter
  })
}

export function getDiseaseAreas(parameter) {
  return axios({
    url: '/accountapi/businessManagement/getInpatientAreaList',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取角色列表
 */
export function getRoleList(parameter) {
  return axios({
    url: '/accountapi/getRoleList',
    method: 'get',
    params: parameter
  })
}

/**
 * 删除或修改角色接口
 */
export function delOrEditRole(parameter) {
  return axios({
    url: '/accountapi/updateRole',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增角色接口
 */
export function addRole(parameter) {
  return axios({
    url: '/accountapi/addRole',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取系统菜单树，用于新增，编辑时选择上级节点
 */
export function getMenuTree(parameter) {
  return axios({
    url: '/accountapi/sysMenu/tree',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取系统菜单树，用于给角色授权时选择
 */
export function getMenuTreeGrant(parameter) {
  return axios({
    url: '/accountapi/sysMenu/treeForGrant',
    method: 'get',
    params: parameter
  })
}

/**
 * 根据条件查询订单
 */
export function getOrders(parameter) {
  return axios({
    url: '/orderapi/order/tbOrder/getOrderList',
    method: 'get',
    params: parameter
  })
}

/**
 * 用户管理列表接口（不包括患者,医生和个案管理师）
 */
export function getUserList(parameter) {
  return axios({
    url: '/accountapi/accountInfo/getUsers',
    method: 'post',
    data: parameter
  })
}

/**
 * 创建医生,个案师账号
 */
export function createDoctorUser(parameter) {
  return axios({
    url: '/accountapi/accountInfo/createDoctorUser',
    method: 'post',
    data: parameter
  })
}

/**
 * 用户管理修改接口（角色不允许修改）
 */
export function updateUser(parameter) {
  return axios({
    url: '/accountapi/accountInfo/updateUser',
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
 * 预约工单查询
 */
export function getAppointList(parameter) {
  return axios({
    url: '/bdcApi/appoint/qryTradeAppointList',
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

/**
 * 获取类别列表
 *
 */
export function qryGoodsClass(param) {
  return axios({
    url: '/bdcApi/sys/qryGoodsClass',
    method: 'post',
    data: param,
  })
}

/**
 * 新增修改类别
 *
 */
export function saveGoodsClass(param) {
  return axios({
    url: '/bdcApi/sys/saveGoodsClass',
    method: 'post',
    data: param,
  })
}

/**
 * 删除类别
 *
 */
export function delGoodsClass(param) {
  return axios({
    url: '/bdcApi/sys/delGoodsClass',
    method: 'post',
    data: param,
  })
}

export function exportPatients(parameter) {
  return axios({
    url: '/patient/exportResult',
    method: 'post',
    data: parameter,
    // params: parameter,
    responseType: 'blob'
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
    params: { hospitalCode: '444885559' }
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
