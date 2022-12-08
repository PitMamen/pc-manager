import { axios } from '@/utils/request'
import { appId } from '@/utils/util'
import { data } from 'jquery'
import { method } from 'lodash'
import { start } from 'nprogress'

/**
 * 获取登录用户信息
 */
export function getTrueUser() {
  return axios({
    url: '/manager-api/user/userInfo',
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
    url: '/manager-api/schedule/qryDeptDoctors',
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
    url: '/health-api/health/patient/allArticlesPage?start=' + parameter.start + '&pageSize=' + parameter.pageSize + '&type=' + parameter.source,
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
    url: '/health-api/health/patient/allArticlesPage',
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
    url: '/health-api/health/patient/allArticlesPage',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      deptCode: parameter.deptCode,
      type: parameter.source,
    }
  })
}

// /**
//  * 获取问卷
//  *
//  */
// export function getAllQuestions(parameter) {
//   parameter.start = parameter.pageNo
//   var newPara = JSON.parse(JSON.stringify(parameter))
//   delete newPara.pageSize
//   delete newPara.start
//   delete newPara.pageNo
//   return axios({
//     url: '/patient/qryQuestByKeyWord?start=' + parameter.start + '&pageSize=' + parameter.pageSize,
//     method: 'get',

//     data: newPara
//   })
// }

/**
 * 获取问卷列表
 *
 */
export function getAllQuestions(parameter) {
  return axios({
    url: '/health-api/health/doctor/qryQuestByKeyWord',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      typeName: parameter.typeName
    },

  })
}
/**
 * 获取问卷统计列表
 *
 */
export function getAllQuestionsStat(parameter) {
  return axios({
    url: '/questionnaire-api/user/project/statistics',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      typeName: parameter.typeName
    },

  })
}
/**
 * 获取问卷统计列表
 *
 */
export function statisticsForUser(parameter) {
  return axios({
    url: '/questionnaire-api/user/project/statisticsForUser',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      projectKey: parameter.projectKey,
      deptIds: parameter.deptIds,
      startDate: parameter.startDate,
      endDate: parameter.endDate
    },

  })
}
/**
 * 导出问卷统计详情
 *
 */
export function exportProjectForUser(parameter) {
  return axios({
    url: '/questionnaire-api/user/project/exportProjectForUser',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      projectKey: parameter.projectKey,
      deptIds: parameter.deptIds,
      startDate: parameter.startDate,
      endDate: parameter.endDate
    },
    responseType: 'blob'
  })
}

/**
 * 新增/修改文章信息
 *
 */
export function saveArticle(parameter) {
  return axios({
    url: '/health-api/patient/saveArticle',
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
    url: '/health-api/health/patient/articleById',
    method: 'get',
    params: {
      id: id,
      recordId: 0
    },

  })
}

/**
 * 新增/修改文章信息，微信公众号推送文章
 *
 */
export function saveArticleWeixin(parameter) {
  return axios({
    url: '/wx-api/health/wx/' + appId + '/uploadNews',
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
    url: '/health-api/patient/pushWeixinArticle',
    method: 'get',
    params: param,
  })
}

/**
 * 获取二维码链接  科室的随访二维码和病区二维码
 *
 */
export function getQrUrl(param) {
  return axios({
    // 192.168.1.122:8126/wx/qrcode/{appid}/getQrCode?ks=1&bq=2
    // url: '/push-api/wx/qrcode/getQrCode',
    url: '/wx-api/wx/qrcode/' + appId + '/getQrCode',
    method: 'get',
    params: param,

  })
}

/**
 * 获取二维码链接   科室的套餐二维码
 *
 */
export function getQrGoodsCode(param) {
  return axios({
    // url: '/push-api/wx/qrcode/getQrGoodsCode',
    url: '/wx-api/wx/qrcode/' + appId + '/getQrGoodsCode',
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
    url: '/health-api/patient/qryDepartment',
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
    url: '/health-api/patient/delArticle',
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
    url: '/manager-api/schedule/qryDeptDoctors',
    method: 'post',
    params: {
      start: 0,
      pageSize: 100,
    },
    data: parameter
  })
}




/**
 * 
 * @param {复诊预约列表} data 
 * @returns 
 */

export function getRdiagnosisList(data) {

  return axios({
    url: '/health-api/revisit/deal/getRdiagnosisList',
    method: 'post',
    data: data,
  })

}


/**
 * 复诊预约
 */
export function rdiagnosisFun(data) {

  return axios({
    url: '/health-api/revisit/deal/rdiagnosisFun',
    method: 'post',
    data: data,
  })

}

/**
 * 复诊预约详情
 */
export function getRdiagnosisForId(id) {

  return axios({
    url: '/health-api//revisit/deal/getRdiagnosisForId',
    method: 'get',
    params: id,
  })

}



/**
 * 新增随访记录
 */
export function addExecuteRecord(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/addExecuteRecord',
    method: 'post',
    data: data,
  })
}


/**
 * 根据Userid 查询随访历史记录
 */
export function qryExecuteRecordByUserId(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/qryExecuteRecordByUserId',
    method: 'post',
    data: data,
  })
}


/**
 * 查询随访执行统计
 */
export function statExecuteRecord(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/statExecuteRecord',
    method: 'post',
    data: data,
  })
}


/**
 * 随访统计详情
 *
 */

export function statExecuteRecordDetail(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/statExecuteRecordDetail',
    method: 'post',
    data: data,
  })
}







/**
 * 获取科室套餐列表
 *
 */
export function getDepPlans(parameter) {
  return axios({
    url: '/health-api/health/patient/queryGoodsList',
    method: 'get',
    params: parameter
  })
}



/**
 * 科室属性查询
 */
export function getDepartmentAttr(parameter) {
  return axios({
    url: '/info-api/departments/getDepartmentAttr',
    method: 'get',
    params: parameter
  })
}


/**
 * 删除科室属性
 */
export function delDepartmentAttr(parameter) {
  return axios({
    url: '/info-api/departments/delDepartmentAttr',
    method: 'post',
    data: parameter
  })
}


/**
 * 新增或修改科室属性
 */
export function saveOrUpdateDepartmentAttr(parameter) {
  return axios({
    url: '/info-api/departments/saveOrUpdateDepartmentAttr',
    method: 'post',
    data: parameter
  })
}


/**
 * 复诊预约 发送短信
 */







/**
 * 获取科室套餐列表
 *
 */
export function getDiseases(parameter) {
  return axios({
    // url: '/account-api/businessManagement/getDiseaseList',//重构接口
    url: '/info-api/disease/getDiseaseList',
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
    url: '/health-api/patient/delGoodsAttr',
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
    url: '/manager-api/patient/savePlanTemplate',
    method: 'post',
    data: parameter
  })
}

/**
 * 上传图片
 */
export function uploadImg(parameter) {
  return axios({
    url: '/api/content-api/fileUpload/uploadImgFile',
    method: 'post',
    data: parameter
  })
}

/**
 * 分配计划
 */
export function dispatchPlan(parameter) {
  return axios({
    url: '/manager-api/patient/distributePlan',
    method: 'post',
    data: parameter
  })
}
/** 
 * 分配计划 多人distributePlanList
 */
export function distributePlanList(parameter) {
  return axios({
    url: '/health-api/health/doctor/distributePlanList',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询计划详情
 */
export function getPlanDetail(planId) {
  return axios({
    url: '/manager-api/patient/qryPlanTemplateDetail',
    method: 'post',
    data: { templateId: planId }
  })
}

/**
 * 删除计划
 */
export function delPlan(parameter) {
  return axios({
    url: '/manager-api/patient/delPlanTemplate',
    method: 'post',
    data: { templateId: parameter }
  })
}

/**
 * 删除计划任务
 */
export function delPlanTask(parameter) {
  return axios({
    url: '/manager-api/patient/delPlanTemplateTask',
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
    url: '/manager-api/patient/delPlanTemplateTaskContent',
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
    url: '/manager-api/patient/qryMyPlanTemplates',
    method: 'get',
    params: parameter,
  })
}



/**
 * 获取出院患者列表
 */
export function getOutPatients(parameter) {
  return axios({
    // url: '/health-api/patient/qryPatientList',
    url: '/health-api/patient/qryPatientListByReg',
    method: 'post',
    data: parameter
  })
}

// /**
//  * 新增科室接口
//  */
// export function newDept(parameter) {
//   return axios({
//     url: '/account-api/businessManagement/addDepartment',
//     method: 'post',
//     data: parameter
//   })
// }

/**
 * 新增科室接口  重构接口
 */
export function newDept(parameter) {
  return axios({
    url: '/info-api/departments/addDepartment',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增专病接口
 */
export function newDisease(parameter) {
  return axios({
    // url: '/account-api/businessManagement/addDiseaseList',//重构接口
    url: '/info-api/disease/addDiseaseList',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增病区接口
 */
export function newDiseaseArea(parameter) {
  return axios({
    // url: '/account-api/businessManagement/addInpatientArea',//重构接口
    url: '/info-api/wards/addInpatientArea',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除科室接口
 */
export function delDept(parameter) {
  return axios({
    url: '/info-api/departments/deleteDepartment',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除专病接口
 */
export function delDisease(parameter) {
  return axios({
    // url: '/account-api/businessManagement/deleteDisease',重构接口
    url: '/info-api/disease/deleteDisease',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除病区接口
 */
export function delDiseaseArea(parameter) {
  return axios({
    url: '/info-api/wards/deleteInpatientArea',
    method: 'post',
    data: parameter
  })
}

// /**
//  * 科室接口列表  科室后面都用这个接口
//  * @param {} parameter 
//  * @returns 
//  */
// export function getDepts(parameter) {
//   return axios({
//     url: '/account-api/businessManagement/getDepartmentList',
//     method: 'get',
//     params: parameter
//   })
// }

/**
 * 科室接口列表 扩展接口   1全部科室(病区) , 2管理科室(病区)
 * @returns 
 */
export function getDepts() {
  return axios({
    url: '/info-api/departments/getDepartmentList',
    method: 'get',
    params: { accessFlag: 1 }
  })
}

/**
 * 科室接口列表 扩展接口   1全部科室(病区) , 2管理科室(病区)
 * @returns 
 */
export function getDeptsPersonal() {
  return axios({
    url: '/info-api/departments/getDepartmentList',
    method: 'get',
    params: { accessFlag: 2 }
  })
}

export function getDiseasesNew(parameter) {
  return axios({
    // url: '/account-api/businessManagement/getDiseaseList',//重构接口
    url: '/info-api/disease/getDiseaseList',
    method: 'get',
    params: parameter
  })
}

export function getDiseaseAreas(parameter) {
  return axios({
    // url: '/account-api/businessManagement/getInpatientAreaList',重构接口
    url: '/info-api/wards/getInpatientAreaList',
    method: 'get',
    params: parameter
  })
}

export function getDoctorList(parameter) {
  return axios({
    // url: '/account-api/businessManagement/getDoctorList',
    url: '/info-api/doctors/getDoctorList',//重构接口
    method: 'get',
    params: parameter
  })
}

/**
 * 获取角色列表
 */
export function getRoleList(parameter) {
  return axios({
    url: '/account-api/getRoleList',
    method: 'get',
    params: parameter
  })
}

/**
 * 切换角色
 */
export function changeRole(parameter) {
  return axios({
    url: '/account-api/changeLoginUserRole',
    method: 'get',
    params: parameter
  })
}

/**
 * 删除或修改角色接口
 */
export function delOrEditRole(parameter) {
  return axios({
    url: '/account-api/updateRole',
    method: 'post',
    data: parameter
  })
}

/**
 * 新增角色接口
 */
export function addRole(parameter) {
  return axios({
    url: '/account-api/addRole',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取系统菜单树，用于新增，编辑时选择上级节点
 */
export function getMenuTree(parameter) {
  return axios({
    url: '/account-api/sysMenu/tree',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取系统菜单树，用于给角色授权时选择
 */
export function getMenuTreeGrant(parameter) {
  return axios({
    url: '/account-api/sysMenu/treeForGrant',
    method: 'get',
    params: parameter
  })
}

/**
 * 根据条件查询订单
 */
export function getOrders(parameter) {
  return axios({
    url: '/order-api/order/tbOrder/getOrderList',
    method: 'get',
    params: parameter
  })
}

/**
 * 用户管理列表接口（不包括患者,医生和个案管理师）
 */
export function getUserList(parameter) {
  return axios({
    url: '/account-api/accountInfo/getUsers',
    method: 'post',
    data: parameter
  })
}

/**
 * 创建医生,个案师账号
 */
export function createDoctorUser(parameter) {
  return axios({
    url: '/account-api/accountInfo/createDoctorUser',
    method: 'post',
    data: parameter
  })
}

/**
 * 用户管理修改接口（角色不允许修改）
 */
export function updateUser(parameter) {
  return axios({
    url: '/account-api/accountInfo/updateUser',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取健康套餐列表
 */
export function getServicePackages(parameter) {
  return axios({
    url: '/health-api/patient/qryServiceGoodsList',
    method: 'post',
    data: parameter
  })
}

/**
 * 预约工单查询
 */
export function getAppointList(parameter) {
  return axios({
    url: '/health-api/appoint/qryTradeAppointList',
    method: 'post',
    data: parameter
  })
}

/**
 * 预约工单日志
 */
export function qryTradeAppointLog(parameter) {
  return axios({
    url: '/health-api/appoint/qryTradeAppointLog',
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
    url: '/health-api/health/manage/addDict',
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
    url: '/health-api/health/manage/editDict',
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
    url: '/health-api/health/manage/deleteDict',
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
    url: '/health-api/health/manage/getDictList',
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
    url: '/health-api/sys/qryGoodsClass',
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
    url: '/health-api/sys/saveGoodsClass',
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
    url: '/health-api/sys/delGoodsClass',
    method: 'post',
    data: param,
  })
}

export function exportPatients(parameter) {
  return axios({
    url: '/manager-api/patient/exportResult',
    method: 'post',
    data: parameter,
    // params: parameter,
    responseType: 'blob'
  })
}

export function uploadPaiban(parameter) {
  return axios({
    url: '/manager-api/schedule/saveDoctorSchedule',
    method: 'post',
    data: parameter
  })
}

// 医生管理界面 查询医生列表
export function queryDoctorList(parameter) {
  return axios({
    url: '/account-api/accountInfo/getUsers',
    method: 'post',
    data: parameter
  })
}


// 医生管理界面 修改配置接口
export function updateRegisterTypes(parameter) {
  return axios({
    url: '/account-api/accountInfo/updateRegisterTypes',
    method: 'post',
    data: parameter
  })
}






export function getPaibans(parameter) {
  return axios({
    url: '/manager-api/schedule/qryDoctorSchedule',
    method: 'get',
    params: parameter
  })
}

export function deletePaiban(id) {
  return axios({
    url: '/manager-api/schedule/delDoctorSchedule',
    method: 'get',
    params: {
      id: id
    },
  })
}

export function changeStatus(parameter) {
  return axios({
    url: '/manager-api/schedule/updateDeptDoctor',
    method: 'post',
    data: parameter
  })
}

export function getKeShiData(parameter) {
  return axios({
    url: '/health-api/health/patient/queryDepartment',
    method: 'get',
    params: { hospitalCode: '444885559' }
  })
}

export function getBanci(thisWeekData) {
  let newPara = {

  }
  return axios({
    url: '/manager-api/schedule/qrySchedulePeriods',
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
    url: '/manager-api/sysPos/list',
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
    url: '/manager-api/sysPos/add',
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
    url: '/manager-api/sysPos/edit',
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
    url: '/manager-api/sysPos/delete',
    method: 'post',
    data: parameter
  })
}

/**
 * 查询权益使用列表
 * {"execDept":"1040300","rightsType":"textNum","userName":"张三",
 * "execName":"刘医生","execFlag":1,"beginDate":"2022-04-01","endDate":"2022-04-02","pageNo":1,"pageSize":10}
 *
 */
export function qryRightsUserRecordList(param) {
  return axios({
    url: '/health-api/patient/qryRightsUserRecordList',
    method: 'post',
    data: param,
  })
}

/**
 * 提醒通知
 * {"remindType":"videoRemind","eventType":1,"userId":301}
 *
 */
export function sysRemind(param) {
  return axios({
    url: '/health-api/sys/sysRemind',
    method: 'post',
    data: param,
  })
}

/**
 * 根据类别查询枚举值
 *
 */
export function qryCodeValue(codeType) {
  return axios({
    url: '/health-api/medical/common/qryCodeValue',
    method: 'get',
    params: { codeGroup: codeType }
  })
}

/**
 * 根据类别查询枚举值
 *
 */
export function getGoodsServiceType() {
  return axios({
    url: '/health-api/medical/common/getGoodsServiceType',
    method: 'get',
    // params: { codeGroup: codeType }
  })
}

/**
 * 新建/修改枚举值
 *
 */
export function saveCodeValue(data) {
  return axios({
    url: '/health-api/medical/common/saveCodeValue',
    method: 'post',
    data: data,
  })
}

/**
 * 开启关闭枚举值，用于套餐服务项配置的状态管理；也可以用于删除套餐服务项，目前没做此功能
 *
 */
export function delCodeValue(data) {
  return axios({
    url: '/health-api/medical/common/delCodeValue',
    method: 'post',
    data: data,
  })
}

/**
 * 新建/修改提醒参数
 *
 */
export function saveRemindParam(data) {
  return axios({
    url: '/health-api/sys/saveRemindParam',
    method: 'post',
    data: data,
  })
}

/**
 * 查询问答列表
 */
export function qrySysKnowledge(data) {
  return axios({
    url: '/health-api/sys/qrySysKnowledge',
    method: 'post',
    data: data,
  })
}
/**
 * 新建/修改问答
 */
export function saveSysKnowledge(data) {
  return axios({
    url: '/health-api/sys/saveSysKnowledge',
    method: 'post',
    data: data,
  })
}
/**
 * 删除某个问答
 */
export function delSysKnowledge(data) {
  return axios({
    url: '/health-api/sys/delSysKnowledge',
    method: 'post',
    data: data,
  })
}

/**
 * 获取提醒参数配置
 *
 */
export function qryRemindParam(params) {
  return axios({
    url: '/health-api/sys/qryRemindParam',
    method: 'get',
    params: params
  })
}

/**
 * 统计咨询总量
 */
export function statRightsUserRecord(data) {
  return axios({
    url: '/health-api/stat/statRightsUserRecord',
    method: 'post',
    data: data,
  })
}

/**
 * 根据医生统计咨询总量
 */
export function statRightsUserRecordByDoc(data) {
  return axios({
    url: '/health-api/stat/statRightsUserRecordByDoc',
    method: 'post',
    data: data,
  })
}

/**
 * 日问诊量统计
 */
export function statRightsUserRecordDaily(data) {
  return axios({
    url: '/health-api/stat/statRightsUserRecordDaily',
    method: 'post',
    data: data,
  })
}

/**
 * 
预约申请
 */
export function saveTradeAppoint(data) {
  return axios({
    url: '/health-api/appoint/saveTradeAppoint',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 新增app版本
 */
export function addAppVersion(data) {
  return axios({
    url: '/health-api/appManager/addAppVersion',
    method: 'post',
    data: data,
  })
}
/**
 * 
 * 查询app版本列表
 */
export function listAppVersion(data) {
  return axios({
    url: '/health-api/appManager/listAppVersion',
    method: 'post',
    data: data,
  })
}
/**
 * 
 * 修改app版本
 */
export function updateAppVersion(data) {
  return axios({
    url: '/health-api/appManager/updateAppVersion',
    method: 'post',
    data: data,
  })
}
/**
 * 
 * 删除app版本
 */
export function deleteAppVersion(data) {
  return axios({
    url: '/health-api/appManager/deleteAppVersion',
    method: 'post',
    data: data,
  })
}

/**
 * 获取医生排班预约详情信息
 *
 */
export function getScheduleInfo(params) {
  return axios({
    url: '/health-api/sys/getScheduleInfo',
    method: 'get',
    params: params
  })
}

/**
 * 获取医生排班时段信息
 * 
 */
export function getSchedulePeriods(params) {
  return axios({
    url: '/health-api/sys/getSchedulePeriods',
    method: 'get',
    params: params
  })
}

/**
 * 获取护士排班时段信息
 *
 */
export function getScheduleNursePeriods(params) {
  return axios({
    url: '/health-api/sys/getScheduleNursePeriods',
    method: 'get',
    params: params
  })
}

/**
 * 
 * 创建/修改医生排班
 */
export function saveDoctorSchedule(data) {
  return axios({
    url: '/health-api/sys/saveDoctorSchedule',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 删除医生排班
 */
export function delDoctorSchedule(data) {
  return axios({
    url: '/health-api/sys/delDoctorSchedule',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 电子处方列表
 */
export function qryMedicalOrdersListUsePc(data) {
  return axios({
    url: '/health-api/prescription/qryMedicalOrdersListUsePc',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 电子处方详情
 */
export function getMedicalOrdersDetail(data) {
  return axios({
    url: '/health-api/prescription/getMedicalOrdersDetail',
    method: 'post',
    data: data,
  })
}

/**
 * 随访详情
 */
export function qryRevisitDetail(data) {
  return axios({
    url: '/health-api/revisit/qryRevisitDetail',
    method: 'post',
    data: data,
  })
}


/**
 * 获取随访计划规则列表
 */
export function getTemplateRuleList(data) {
  return axios({
    url: '/health-api/sys/getTemplateRuleList',
    method: 'get',
    data: data,
  })
}

/**
 * 修改、保存随访计划规则
 */
export function saveTemplateRule(data) {
  return axios({
    url: '/health-api/sys/saveTemplateRule',
    method: 'post',
    data: data,
  })
}


/**
 * 删除 随访计划 规则
 */

export function deleteTempPlanRule(data) {
  return axios({
    url: '/health-api/sys/delTemplateRule',
    method: 'get',
    params: data,
  })
}




/**
 * 随访名单列表
 */
export function qryMetaConfigure(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/qryMetaConfigure',
    method: 'post',
    data: data,
  })
}


/**
 * 新增随访名单
 */
export function saveMetaConfigure(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/saveMetaConfigure',
    method: 'post',
    data: data,
  })
}



/**
 * 查看随访名单详情
 */
export function checkDetail(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/qryMetaConfigureDetail',
    method: 'post',
    data: data,
  })
}



/**
 * 更新名单配置状态
 *
 */
export function updateMetaConfigure(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/updateMetaConfigure',
    method: 'post',
    data: data,
  })
}



/**
 * 获取微信模板分页列表
 */
export function getWxTemplateList(data) {
  return axios({
    url: '/follow-api/wxTemplate/getWxTemplateList',
    method: 'post',
    data: data,
  })
}

/**
 * 微信模板 启用 禁用
 */
export function changeStatusWxTemplate(data) {
  return axios({
    url: '/follow-api/wxTemplate/changeStatusWxTemplate',
    method: 'post',
    data: data,
  })
}




/**
 * 短信模板 分页列表
 */
export function getSmsTemplateList(data) {
  return axios({
    url: '/follow-api/smsTemplate/getSmsTemplateList',
    method: 'post',
    data: data,
  })
}



/**
 * 短信模板 启用 禁用
 */
export function changeStatusSmsTemplate(data) {
  return axios({
    url: '/follow-api/smsTemplate/changeStatusSmsTemplate',
    method: 'post',
    data: data,
  })
}




/**
 * 
 * 患者管理列表分页查询
 */
export function qryMetaDataByPage(data) {
  return axios({
    url: '/follow-api/followMetaConfigureDetail/qryPatientByPage',
    method: 'post',
    data: data,
  })
}




/**
 * 随访方案列表分页查询
 */
export function qryFollowPlan(data) {
  return axios({
    url: '/follow-api/follow/plan/qryFollowPlan',
    method: 'post',
    data: data,
  })
}

/**
 * 获取公众号列表接口
 */
export function getWxConfigureList(data) {
  return axios({
    url: '/follow-api/wxConfigure/getWxConfigureList',
    method: 'post',
    data: data,
  })
}

/**
 * 获取公众号模板消息列表接口
 */
export function getTemplateWxMsg(data) {
  return axios({
    url: '/follow-api/wxConfigure/getTemplateWxMsg',
    method: 'post',
    data: data,
  })
}

/**
 * 查询名单配置详情数据
 */
export function qryMetaConfigureDetail(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/qryMetaConfigureDetail',
    method: 'post',
    data: data,
  })
}

/**
 * 添加微信模板接口
 */
export function addWxTemplate(data) {
  return axios({
    url: '/follow-api/wxTemplate/addWxTemplate',
    method: 'post',
    data: data,
  })
}
/**
 * 修改微信模板接口
 */
export function modifyWxTemplate(data) {
  return axios({
    url: '/follow-api/wxTemplate/modifyWxTemplate',
    method: 'post',
    data: data,
  })
}
/**
 * 获取微信模板详情
 */
export function getWxTemplateById(id) {
  return axios({
    url: '/follow-api/wxTemplate/getWxTemplateById/' + id,
    method: 'post',

  })
}

/**
 * 获取微信模板详情
 */
export function updateFollowPlanStatus(data) {
  return axios({
    url: '/follow-api/follow/plan/updateFollowPlanStatus',
    method: 'post',
    data: data,
  })
}





/**
 * 
 * 处方订单列表
 */
export function qryOrdersList(data) {
  return axios({
    url: '/health-api/prescription/qryOrdersList',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 配送信息导出
 */
export function exportOrders() {
  return axios({
    url: '/health-api/excel/exportOrders',
    method: 'get',
    // data: data,
  })
}

/**
 * 
 * 根据订单id修改订单状态  get post 请求的结合体
 */
export function updateOrderStatusById(data) {
  return axios({
    url: '/order-api/order/tbOrder/updateOrderStatusById',
    method: 'get',
    params: data
  })
}
/**
 * 
 * 管理端-查询申请列表
 */
export function getReviewList(data) {
  return axios({
    url: '/health-api/health/apply/page',
    method: 'post',
    data: data,
  })
}
/**
 * 
 * 管理端-审核操作
 */
export function auditReview(data) {
  return axios({
    url: '/health-api/health/apply/audit',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 后台管理员退费接口
 */
export function refundByAdmin(data) {
  return axios({
    url: '/health-api/appoint/refundByAdmin',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 获取基本信息和更多信息
 */
export function getBaseInfo(data) {
  return axios({
    url: '/account-api/userInfo/getBaseInfo',
    method: 'get',
    params: data,
  })
}

/**
 * 
 * 查询随访病人列表
 */
export function qryRevisitPatientList(data) {
  return axios({
    url: '/health-api/revisit/qryRevisitPatientList',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 保存/修改处理信息（修改时传记录ID）
 */

export function dealsave(data) {
  return axios({
    url: '/health-api/revisit/deal/save',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 获取处理信息
 */
export function dealget(data) {
  return axios({
    url: '/health-api/revisit/deal/get',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 随访计划类型列表
 */
export function getPlatTypeList(data) {
  return axios({
    url: '/health-api/revisit/deal/getPlatTypeList',
    method: 'get',
    params: data,
  })
}


/**
 * 
 * 查询随访病人列表
 */
export function statRevisit(data) {
  return axios({
    url: '/health-api/revisit/statRevisit',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 用户健康计划任务列表
 */
export function queryHealthPlanTaskList(data) {
  return axios({
    url: '/health-api/patient/queryHealthPlanTaskList',
    method: 'get',
    params: data,
  })
}

/**
 * 
 * 任务内容
 */
export function queryHealthPlanContent(data) {
  return axios({
    url: '/health-api/health/patient/queryHealthPlanContent',
    method: 'get',
    params: data,
  })
}

/**
 * 
 * 保存/修改抽查信息（修改时传记录ID）
 */

export function checksave(data) {
  return axios({
    url: '/health-api/revisit/check/save',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 获取抽查信息
 */

export function checkget(data) {
  return axios({
    url: '/health-api/revisit/check/get',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 聊天记录
 */
export function queryHistoryIMRecordPage(data) {
  return axios({
    url: '/im-api/tencentIM/queryHistoryIMRecordPage',
    method: 'get',
    params: data,
  })
}

/**
 * 随访类型列表：1:关怀型随访2:管理型随访3:科研型随访
 */
export function followTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/followTypes',
    method: 'get',
    params: data,
  })
}

/**
 * 来源名单列表：门诊病人，住院病人，体检病人
 */
export function tables(data) {
  return axios({
    url: '/follow-api/follow/dict/tables',
    method: 'get',
    params: data,
  })
}

/**
 * /follow/dict/fields 名单过滤字段列表：科室，患者姓名，出院日期
 */
export function fields(data) {
  return axios({
    url: '/follow-api/follow/dict/fields',
    method: 'get',
    params: data,
  })
}

/**
 * /follow/dict/dateFields 时间过滤字段列表：科室，患者姓名，出院日期
 */
export function dateFields(data) {
  return axios({
    url: '/follow-api/follow/dict/dateFields',
    method: 'get',
    params: data,
  })
}

/**
 * /follow/dict/operationTypes 操作类型列表：>大于、<小于、=精准匹配、like模糊匹配、in包含
 */
export function operationTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/operationTypes',
    method: 'get',
    params: data,
  })
}

/**
 * /follow/dict/messageTypes 消息类别列表: 1:电话回访2:微信消息3:短信消息
 */
export function messageTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/messageTypes',
    method: 'get',
    params: data,
  })
}

/**
 * /follow/dict/messageContentTypes 推送模板类型：1:问卷2:文章3:短信模板4:微信模板
 */
export function messageContentTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/messageContentTypes',
    method: 'get',
    params: data,
  })
}

/**
 * /follow/dict/taskTypes 任务类别列表：1:问卷收集2:健康宣教3:消息提醒
 */
export function taskTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/taskTypes',
    method: 'get',
    params: data,
  })
}

/**
 *
/follow/dict/taskExecTypes 执行周期列表: 1:临时执行2:长期执行
 */
export function taskExecTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/taskExecTypes',
    method: 'get',
    params: data,
  })
}

/**
 *
/follow/dict/repeatTimeUnitTypes 重复周期列表: 1:间隔2:每周第3:每月第4:每年第
 */
export function repeatTimeUnitTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/repeatTimeUnitTypes',
    method: 'get',
    params: data,
  })
}

/**
 *
/follow/dict/timeUnitTypes 时间单位列表: 1:天2:周3:月
 */
export function timeUnitTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/timeUnitTypes',
    method: 'get',
    params: data,
  })
}

/**
 *

/follow/dict/personnelAssignmentTypes 人员分配方案类型;1:系统自动执行2:每次随机分配3:首次随机分配4:指定人员
 */
export function personnelAssignmentTypes(data) {
  return axios({
    url: '/follow-api/follow/dict/personnelAssignmentTypes',
    method: 'get',
    params: data,
  })
}

/**
 * 获取短信平台列表
 */
export function getSmsConfigureList(data) {
  return axios({
    url: '/follow-api/smsConfigure/getSmsConfigureList',
    method: 'post',
    data: data,
  })
}

/**
* 获取短信模板内容列表
*/
export function getSmsConfigureTemplateList(smsConfigureId) {
  return axios({
    url: '/follow-api/smsConfigureTemplate/getSmsConfigureTemplateList/' + smsConfigureId,
    method: 'post',

  })
}
/**
* 添加短信模板接口
*/
export function addSmsTemplate(data) {
  return axios({
    url: '/follow-api/smsTemplate/addSmsTemplate',
    method: 'post',
    data: data,
  })
}

/**
* 添加短信模板接口
*/
export function modifySmsTemplate(data) {
  return axios({
    url: '/follow-api/smsTemplate/modifySmsTemplate',
    method: 'post',
    data: data,
  })
}

/**
* 获取短信模板详情
*/
export function getSmsTemplateById(id) {
  return axios({
    url: '/follow-api/smsTemplate/getSmsTemplateById/' + id,
    method: 'post',

  })
}

/**
 *accountInfo/getUsersByDeptIdAndRole 根据科室与角色查询用户列表
 */
export function getUsersByDeptIdAndRole(data) {
  return axios({
    url: '/account-api/accountInfo/getUsersByDeptIdAndRole',
    method: 'post',
    data: data,
  })
}

/**
 *follow/saveFollow 新增/修改方案
 */
export function saveFollow(data) {
  return axios({
    url: '/follow-api/follow/plan/save',
    method: 'post',
    data: data,
  })
}

/**
 *  /smsTemplate/getSmsTemplateListForJumpType/{jumpType} 获取短信模板列表,根据jumpType
 */
export function getSmsTemplateListForJumpType(data) {
  return axios({
    url: '/follow-api/smsTemplate/getSmsTemplateListForJumpType/' + data,
    method: 'post',
    data: {},
  })
}

/**
 * /wxTemplate/getWxTemplateListForJumpType/{jumpType} 获取微信模板,根据模板跳转内容
 */
export function getWxTemplateListForJumpType(data) {
  return axios({
    url: '/follow-api/wxTemplate/getWxTemplateListForJumpType/' + data,
    method: 'post',
    data: {},
  })
}

/**
 * /follow/plan/detail  查询方案详情
 */
export function getDetail(data) {
  return axios({
    url: '/follow-api/follow/plan/detail',
    method: 'get',
    params: data,
  })
}

/**
 * 本次随访，随访结果
 */
export function followPlanPhoneCurrent(id) {
  return axios({
    url: '/follow-api/followPlanPhone/current/' + id,
    method: 'post'
  })
}
/**
 * 本次随访，随访名单信息
 */
export function followPlanPhonePatientInfo(userId) {
  return axios({
    url: '/follow-api/followPlanPhone/getPatientInfo/' + userId,
    method: 'post'
  })
}

/**
 * /tbFollowExecuteRecord/qryPhoneFollowTaskStatistics 查询电话随访任务-统计
 */
export function qryPhoneFollowTaskStatistics(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/qryPhoneFollowTaskStatistics',
    method: 'get',
    params: data,

  })
}

/**
 * 执行随访
 */
export function modifyFollowExecuteRecord(data) {
  return axios({
    url: '/follow-api/followPlanPhone/modifyFollowExecuteRecord',
    method: 'post',
    data: data,
  })
}

/**
 * /tbFollowExecuteRecord/qryPhoneFollowTask 查询电话随访任务
 */
export function qryPhoneFollowTask(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/qryPhoneFollowTask',
    method: 'post',
    data: data,
  })
}


/**
 * 随访人历史随访列表
 */
export function followPlanPhoneHistory(userId) {
  return axios({
    url: '/follow-api/followPlanPhone/history/' + userId,
    method: 'post'
  })
}

/**
 * 随访历史记录详情(页面中间部分)
 */
export function followPlanPhonehistoryDetail(id) {
  return axios({
    url: '/follow-api/followPlanPhone/historyDetail/' + id,
    method: 'post'
  })
}

/**
 * 历史随访结果(类型不同展示不一样)
 */
export function historyFollowResult(id) {
  return axios({
    url: '/follow-api/followPlanPhone/historyFollowResult/' + id,
    method: 'post'
  })
}
/**
 *  /ccc/createSdkLoginToken 创建 SDK 登录 Token
 */
export function createSdkLoginToken() {
  return axios({
    url: '/follow-api/follow/ccc/createSdkLoginToken',
    method: 'post'
  })
}

/**
 *  /ccc/addTencentPhoneTape 新增腾讯云呼叫电话记录
 */
export function addTencentPhoneTape(param) {
  return axios({
    url: '/follow-api/follow/ccc/addTencentPhoneTape',
    method: 'post',
    data: param,
  })
}

/**
 * paramKey follow_caller_phone获取账号打电话号码
 * accountParamInfo/getAccountParam/{paramKey} 获取账号参数值
 */
export function getAccountParam(paramKey) {
  return axios({
    url: '/account-api/accountParamInfo/getAccountParam/' + paramKey,
    method: 'get',
    // params: data,
  })
}

/**
 *   
 * /tbFollowExecuteRecord/followRecords 查询随访任务列表
 */
export function followRecords(param) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/followRecords',
    method: 'post',
    data: param,
  })
}

/**
 *   
 * /follow/plan/questionnaires 随访方案问卷列表
 */
export function questionnaires(param) {
  return axios({
    url: '/follow-api/follow/plan/questionnaires',
    method: 'post',
    data: param,
  })
}

/**
 * 电话录音列表
 */
export function getSoundRecordingList(id) {
  return axios({
    url: '/follow-api/followPlanPhone/getSoundRecordingList/' + id,
    method: 'post'
  })
}

/**
 * 抽查
 */
export function modifyFollowSpotExecuteRecord(data) {
  return axios({
    url: '/follow-api/followPlanPhone/modifyFollowSpotExecuteRecord',
    method: 'post',
    data: data,
  })
}

/**
 * 抽查详情
 */
export function spotDetailForId(id) {
  return axios({
    url: '/follow-api/followPlanPhone/spotDetailForId/' + id,
    method: 'post',
  })
}

/**
 * /follow/dict/taskBizStatus 任务状态;2:成功3:失败
 */
export function taskBizStatus(data) {
  return axios({
    url: '/follow-api/follow/dict/taskBizStatus',
    method: 'get',
    params: data,
  })
}

/**
 * /pushRecordHistory/getSmsPushRecordHistory 短信推送日志
 */
export function getSmsPushRecordHistory(data) {
  return axios({
    url: '/follow-api/pushRecordHistory/getSmsPushRecordHistory',
    method: 'post',
    data: data,
  })
}

/**
 * /pushRecordHistory/getWxPushRecordHistory 短信推送日志
 */
export function getWxPushRecordHistory(data) {
  return axios({
    url: '/follow-api/pushRecordHistory/getWxPushRecordHistory',
    method: 'post',
    data: data,
  })
}

/** 
 *
 * /account-api/application/list 查询应用列表
 */
export function getApplicationlist(data) {
  return axios({
    url:'/uam-api/application/list',
    method:'post',
    data:data,
  })
}


/**
 * 
 * @param {租户信息列表} data 
 * @returns 
 */
export function getTenantList(data) {
  return axios({
    url: '/uam-api/tenant/list',
    method: 'post',
    data: data,
  })
}


/***
 * 新增租户、修改租户信息
 */
export function saveaddTenand(data) {
  return axios({
    url: '/uam-api/tenant/save',
    method: 'post',
    data: data,
  })
}

/**
 * 查看租户详情
 */
export function queryTenantDetail(data) {
  return axios({
    url: "/uam-api/tenant/detail",
    method: 'get',
    params: data,
  })
}



/***
 * 查看初始化进度
 */
export function queryinitProgress(data) {
  return axios({
    url: '/uam-api/tenant/initProgress',
    method: 'get',
    params: data,
  })
}

/**
 * /pushRecordHistory/historySmsPushDetail/{id} 短信推送日志详情
 */
 export function historySmsPushDetail(data) {
  return axios({
    url: '/follow-api/pushRecordHistory/historySmsPushDetail/' + data,
    method: 'post',
    // data: data,
  })
}

/**
 * /pushRecordHistory/historySmsPushDetail/{id} 随访历史记录详情(页面中间部分)
 */
 export function historyWxPushDetail(data) {
  return axios({
    url: '/follow-api/pushRecordHistory/historyWxPushDetail/' + data,
    method: 'post',
    // data: data,
  })
}

/*
 * 租户初始化操作接口
 */
 export function tenantInit(data){
  return axios({
    url:'/uam-api/tenant/init',
    method:'get',
    params:data,
  })
 }


 /**
  * 重置管理员密码
  */
 export function resetTenantPwd(data){
  return axios({
    url:'/uam-api/tenant/resetPwd',
    method:'post',
    data:data,
  })
 }

 /**
  * 机构列表
  */
 export function queryHospitalList(data){
  return axios({
    url:'/uam-api/hospital/list',
    method:'post',
    data:data,
  })
 }


 /**
  * 机构类型
  */
 export function queryHospitalType(data){
  return axios({
    url:'/uam-api/hospital/hospitalType',
    method:'get',
    params:data,
  })
 }



 /**
  * 机构等级
  */
 export function queryHospitalLevel(data){
  return axios({
    url:'/uam-api/hospital/hospitalLevel',
    method:'get',
    params:data,
  })
 }

 /***
  * 上级机构
  */
export function parent(data){
  return axios({
    url:'/uam-api/hospital/parent',
    method:'get',
    params:data,
  })
}


 /**
  * 新增机构
  */
  export function save(data){
    return axios({
      url:'/uam-api/hospital/save',
      method:'post',
      data:data,
    })
   } 


   /**
    * 机构详情
    */

   export function queryHospitaldetail(data){
    return axios({
      url:'/uam-api/hospital/detail',
      method:'get',
      params:data,
    })
   }


   /**
    * 科室列表
    */
   export function getDepartmentListForReq(data){
    return axios({
      url:'/follow-api/departmentManger/getDepartmentListForReq',
      method:'post',
      data:data,
    })
   }

   /**
    * 添加科室
    */
   export function addDepartmentForReq(data){
    return axios({
      url:"/follow-api/departmentManger/addDepartmentForReq",
      method:'post',
      data:data,
    })
   }
   /**
    * 获取档案列表
    */
   export function getFileList(data){
    return axios({
      url:"/ehr-api/ehr/v1/list",
      method:'post',
      data:data,
    })
   }
   /**
    * 获取档案详情
    */
   export function getFileDtail(data){
    return axios({
      url:"/ehr-api/ehr/v1/getRecord",
      method:'post',
      data:data,
    })
   }

     /**
    * 修改科室
    */
      export function modifyDepartmentForReq(data){
        return axios({
          url:"/follow-api/departmentManger/modifyDepartmentForReq",
          method:'post',
          data:data,
        })
       }


       /**
        * 随访任务列表
        */
       export function followList(data){
        return axios({
          url:'/follow-api/tbFollowExecuteRecord/page',
          method:'post',
          data:data,
        })
       }


       /**
        * 随访医生列表
        */

       export function getUsersByDeptIdsAndRoles(data){
        return axios({
          url:'/account-api/accountInfo/getUsersByDeptIdsAndRoles',
          method:'post',
          data:data,
        })
       }


       /**
        * 审核随访任务
        */
       export function audit(data){
        return axios({
          url:'/follow-api/tbFollowExecuteRecord/audit',
          method:'post',
          data:data,
        })
       }

       /**
        * 转移随访任务
        */

       export function transfer(data){
        return axios({
          url:'/follow-api/tbFollowExecuteRecord/transfer',
          method:'post',
          data:data,
        })
       }

