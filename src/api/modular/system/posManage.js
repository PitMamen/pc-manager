import { axios } from '@/utils/request'
import { appId } from '@/utils/util'
import { data, param } from 'jquery'
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
    url: '/health-api/health/patient/allArticlesNewPage?start=' + parameter.start + '&pageSize=' + parameter.pageSize + '&type=' + parameter.source,
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
    url: '/health-api/health/patient/allArticlesNewPage',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      deptCode: parameter.deptCode,
      title: parameter.title
    }
  })
}

/**
 * 获取文章  教育文章
 *
 */
export function getAllArticlesTeach(parameter) {
  return axios({
    url: '/health-api/health/patient/allArticlesNewPage',
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
 * 获取二维码链接  套餐二维码
 *
 */
export function getCommodityQrCode(param) {
  return axios({
    url: '/wx-api/wx/qrcode/' + appId + '/getCommodityQrCode',
    method: 'get',
    params: param,

  })
}
/**
 * 获取二维码链接  机构的随访二维码
 *
 */
export function getHospitalQrCode(param) {
  return axios({
    url: '/wx-api/wx/qrcode/' + appId + '/getHospitalQrCode',
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
 * /tbFollowExecuteRecord/addExecuteRecordTempTask 新增临时任务
 */
export function addExecuteRecordTempTask(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/addExecuteRecordTempTask',
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
export function getRoleList(data) {
  return axios({
    url: '/account-api/page',
    method: 'post',
    data: data,
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
 * 退款账单-按天汇总分页
 */
export function refundBillPage(data) {
  return axios({
    url: '/order-api/order/bill/refundBillPage',
    method: 'post',
    data: data
  })
}

/**
 * 
 * 退款账单-按天汇总导出
 */
export function refundBillExport(data) {
  return axios({
    url: '/order-api/order/bill/refundBillExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 
 * 退款账单-按天对账流水导出
 */
export function refundRecordExport(data) {
  return axios({
    url: '/order-api/order/bill/refundRecordExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 
 * 退款账单-汇总信息
 */
export function refundBillSummary(data) {
  return axios({
    url: '/order-api/order/bill/refundBillSummary',
    method: 'post',
    data: data
  })
}

/**
 * 
 * 退款账单-按收款方Tab信息
 */
export function refundBillTab(data) {
  return axios({
    url: '/order-api/order/bill/refundBillTab',
    method: 'post',
    data: data
  })
}

/**
 * 
 * 退款账单-对账流水分页
 */
export function refundRecordPage(data) {
  return axios({
    url: '/order-api/order/bill/refundRecordPage',
    method: 'post',
    data: data
  })
}

/**
 * 
 * 退款账单-按天对账流水TAB
 */
export function refundRecordTab(data) {
  return axios({
    url: '/order-api/order/bill/refundRecordTab',
    method: 'post',
    data: data
  })
}

/**
 * 
 * 退款账单-对账流水分渠道汇总
 */
export function refundRecordChannelSummary(data) {
  return axios({
    url: '/order-api/order/bill/refundRecordChannelSummary',
    method: 'post',
    data: data
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
 * 模糊查询
 *  /smsTemplate/getSmsTemplateListForJumpType/{jumpType} 获取短信模板列表,根据jumpType
 */
export function getSmsTemplateListForJumpTypeFuzzy(data) {
  return axios({
    url: '/follow-api/smsTemplate/getSmsTemplateListForJumpTypeNew/0/' + data,
    method: 'post',
    data: {},
  })
}

/**
 * 模糊查询
 * /wxTemplate/getWxTemplateListForJumpType/{jumpType} 获取微信模板,根据模板跳转内容
 */
export function getWxTemplateListForJumpTypeFuzzy(data) {
  return axios({
    url: '/follow-api/wxTemplate/getWxTemplateListForJumpTypeNew/0/' + data,
    method: 'post',
    data: {},
  })
}

/**
 * 模糊查询
 * 获取问卷列表
 */
export function getAllQuestionsFuzzy(parameter) {
  return axios({
    url: '/health-api/health/doctor/qryQuestByKeyWord',
    method: 'get',
    params: {
      start: parameter.pageNo,
      pageSize: parameter.pageSize,
      keyWord: parameter.keyWord,
      typeName: parameter.typeName
    },

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
 * 挂起
 */
export function hangExecuteRecord(data) {
  return axios({
    url: '/follow-api/followPlanPhone/hangExecuteRecord',
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
    url: '/uam-api/application/list',
    method: 'post',
    data: data,
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
export function tenantInit(data) {
  return axios({
    url: '/uam-api/tenant/init',
    method: 'get',
    params: data,
  })
}


/**
 * 重置管理员密码
 */
export function resetTenantPwd(data) {
  return axios({
    url: '/uam-api/tenant/resetPwd',
    method: 'post',
    data: data,
  })
}

/**
 * 机构列表
 */
export function queryHospitalList(data) {
  return axios({
    url: '/uam-api/hospital/list',
    method: 'post',
    data: data,
  })
}


/**
 * 可访问机构列表
 */
export function accessHospitals(data) {
  return axios({
    url: '/uam-api/hospital/accessHospitals',
    method: 'get',
    params: data,
  })
}

/**
 * 可访问机构列表 处方流转
 */
export function accessHospitalsNew(data) {
  return axios({
    url: '/uam-api/hospital/accessHospitalsNew',
    method: 'get',
    params: data,
  })
}


/**
 * 修改机构状态
 */
export function updateStatus(data) {
  return axios({
    url: '/uam-api/hospital/updateStatus',
    method: 'post',
    data: data,
  })
}

/**
 * 
 * 修改租户状态
 */

export function updateTenantStatus(data) {
  return axios({
    url: '/uam-api/tenant/updateStatus',
    method: 'post',
    data: data,
  })
}




/**
 * 机构类型
 */
export function queryHospitalType(data) {
  return axios({
    url: '/uam-api/hospital/hospitalType',
    method: 'get',
    params: data,
  })
}



/**
 * 机构等级
 */
export function queryHospitalLevel(data) {
  return axios({
    url: '/uam-api/hospital/hospitalLevel',
    method: 'get',
    params: data,
  })
}

/***
 * 上级机构
 */
export function parent(data) {
  return axios({
    url: '/uam-api/hospital/parent',
    method: 'get',
    params: data,
  })
}


/**
 * 新增机构
 */
export function save(data) {
  return axios({
    url: '/uam-api/hospital/save',
    method: 'post',
    data: data,
  })
}


/**
 * 机构详情
 */

export function queryHospitaldetail(data) {
  return axios({
    url: '/uam-api/hospital/detail',
    method: 'get',
    params: data,
  })
}


/**
 * 科室列表
 */
export function getDepartmentListForReq(data) {
  return axios({
    url: '/follow-api/departmentManger/getDepartmentListForReq',
    method: 'post',
    data: data,
  })
}
/**
 * 科室列表 科室选择用
 */
export function getDepartmentListForSelect(departmentName, source) {
  return axios({
    url: '/follow-api/departmentManger/getDepartmentListForReq',
    method: 'post',
    data: {
      departmentName: departmentName,//搜索输入
      source: source,//租户下所有科室：undefined  本登录账号管理科室： 'managerDept'      //需要根据页面业务需求传递
      status: 1,//1开启
      pageNo: 1,
      pageSize: 9999
    },
  })
}
/**
 * 科室列表 科室选择用
 */
export function getMyDepartments(data) {
  return axios({
    url: '/follow-api/departmentManger/getDepartmentListForReq',
    method: 'post',
    data: data,
  })
}
/**
 * 添加科室
 */
export function addDepartmentForReq(data) {
  return axios({
    url: "/follow-api/departmentManger/addDepartmentForReq",
    method: 'post',
    data: data,
  })
}
/**
 * 获取档案列表
 */
export function getFileList(data) {
  return axios({
    url: "/ehr-api/ehr/v1/list",
    method: 'post',
    data: data,
  })
}
/**
 * 获取档案详情
 */
export function getFileDtail(data) {
  return axios({
    url: "/ehr-api/ehr/v1/getRecord",
    method: 'post',
    data: data,
  })
}
/**
 * 获取住院记录
 */
export function getZyRecords(data) {
  return axios({
    url: "/health-api/revisit/getZyRecords",
    method: 'get',
    params: data,
  })
}
/**
 * 获取住院小结
 */
export function getZySummary(data) {
  return axios({
    url: "/health-api/revisit/getZySummary",
    method: 'get',
    params: data,
  })
}

// /**
//  * 获取参数配置
//  */
// export function getSysConfigData(data) {
//   return axios({
//     url: '/info-api/sysConfigData/getConfig/' + data,
//     method: 'get'
//   })
// }

/**
* 修改科室
*/
export function modifyDepartmentForReq(data) {
  return axios({
    url: "/follow-api/departmentManger/modifyDepartmentForReq",
    method: 'post',
    data: data,
  })
}


/**
        * 随访任务列表
 */
export function followList(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/page',
    method: 'post',
    data: data,
  })
}


/**
 * 随访医生列表
 */


export function getUsersByDeptIdsAndRoles(data) {
  return axios({
    url: '/account-api/accountInfo/getUsersByDeptIdsAndRoles',
    method: 'post',
    data: data,
  })
}


/**
 * 随访问卷开关配置
 */
export function getSwitchStatus(data) {
  return axios({
    url: '/info-api/sysConfigData/get/department_management_status',
    method: "get",
    params: data,
  })
}






/**
 * 审核随访任务
 */
export function audit(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/audit',
    method: 'post',
    data: data,
  })
}

/**
 * 转移随访任务
 */

export function transfer(data) {
  return axios({
    url: '/follow-api/tbFollowExecuteRecord/transfer',
    method: 'post',
    data: data,
  })
}


/**
 * 
 * 查询
 */
export function qryMetaConfigureDetailFilter(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/qryMetaConfigureDetailFilter',
    method: 'post',
    data: data,
  })
}


/**
 * 名单分类查询接口
 */

export function qryMetaByPage(data) {
  return axios({
    url: '/follow-api/followMetaConfigureDetail/qryMetaDataByPage',
    method: 'post',
    data: data,
  })
}

/**
 * 医护人员类型[医生,护士,药剂师,医技人员,后勤人员
 */
export function accountDictUserTypes() {
  return axios({
    url: '/account-api/accountDict/userTypes',
    method: 'get',

  })
}

/**
 * 创建医生、个案师和护士用户，根据参数选择性创建账号
 */
export function professionalTitles() {
  return axios({
    url: '/account-api/accountDict/professionalTitles',
    method: 'get',

  })
}

/**
 * 设置医生,个案师和护士用户状态信息
 */
export function setDoctorUserStatus(data) {
  return axios({
    url: '/account-api/accountInfo/setDoctorUserStatus',
    method: 'post',
    data: data,
  })
}

/**
 * 人员管理列表
 */
export function searchDoctorUser(data) {
  return axios({
    url: '/account-api/accountInfo/searchDoctorUser',
    method: 'post',
    data: data,
  })
}
/**
 * 账号管理列表
 */
export function searchDoctorAccount(data) {
  return axios({
    url: '/account-api/accountInfo/searchDoctorAccount',
    method: 'post',
    data: data,
  })
}
/**
 * 查询用户归属科室
 */
export function getBelongDepts(data) {
  return axios({
    url: '/account-api/userInfo/getBelongDepts',
    method: 'get',
    params: data,
  })
}
/**
 * 修改用户归属科室
 */
export function updateBelongDepts(data) {
  return axios({
    url: '/account-api/userInfo/updateBelongDepts',
    method: 'post',
    data: data,
  })
}
/**
 * 创建医生,个案师和护士账号并绑定已有用户
 */
export function createDoctorAccount(data) {
  return axios({
    url: '/account-api/accountInfo/createDoctorAccount',
    method: 'post',
    data: data,
  })
}

/**
 * 设置医生,个案师和护士账号状态信息
 */
export function setDoctorAccountStatus(data) {
  return axios({
    url: '/account-api/accountInfo/setDoctorAccountStatus',
    method: 'post',
    data: data,
  })
}

/**
 * 获取用户详情
 */
export function getDoctorUserDetail(data) {
  return axios({
    url: '/account-api/accountInfo/getDoctorUserDetail',
    method: 'get',
    params: data,
  })
}

/**
 * 获取账号详情
 */
export function getDoctorAccountDetail(data) {
  return axios({
    url: '/account-api/accountInfo/getDoctorAccountDetail',
    method: 'get',
    params: data,
  })
}
/**
 * 修改医生,个案师和护士用户信息
 */
export function updateDoctorUser(data) {
  return axios({
    url: '/account-api/accountInfo/updateDoctorUser',
    method: 'post',
    data: data,
  })
}


/**
 * 查询账号管理科室
 */
export function getManagerDepts(data) {
  return axios({
    url: '/account-api/accountInfo/getManagerDepts',
    method: 'get',
    params: data,
  })
}

/**
 * 修改账号管理科室
 */
export function updateManagerDepts(data) {
  return axios({
    url: '/account-api/accountInfo/updateManagerDepts',
    method: 'post',
    data: data,
  })
}

/**
 * 修改医生,个案师和护士账号信息
 */
export function updateDoctorAccount(data) {
  return axios({
    url: '/account-api/accountInfo/updateDoctorAccount',
    method: 'post',
    data: data,
  })
}


/**
 * 查询未绑定账号医生列表
 */
export function getUnbindAccountDoctorUser(data) {
  return axios({
    url: '/account-api/accountInfo/getUnbindAccountDoctorUser',
    method: 'post',
    data: data,
  })
}

/**
 * 重置密码
 */
export function resetPasswordByAdmin(data) {
  return axios({
    url: '/account-api/accountInfo/resetPasswordByAdmin',
    method: 'post',
    data: data,
  })
}
/**
 * 系统日志
 */
export function getSysAccessLogPageList(data) {
  return axios({
    url: '/account-api/sysAccessLog/getSysAccessLogPageList',
    method: 'post',
    data: data,
  })
}

/**
 * 文章分类列表
 */
export function getArticleCategoryList(data) {
  return axios({
    url: '/health-api/articleCategory/getArticleCategoryList',
    method: 'post',
    data: data,
  })
}
/**
 * 文章分类添加
 */
export function addArticleCategory(data) {
  return axios({
    url: '/health-api/articleCategory/addArticleCategory',
    method: 'post',
    data: data,
  })
}
/**
 * 文章分类删除
 */
export function deleteArticleCategory(id) {
  return axios({
    url: '/health-api/articleCategory/deleteArticleCategory/' + id,
    method: 'post',

  })
}
/**
 * 文章分类修改
 */
export function modifyArticleCategory(data) {
  return axios({
    url: '/health-api/articleCategory/modifyArticleCategory',
    method: 'post',
    data: data,
  })
}
/**
 * 文章列表
 */
export function getArticleList(data) {
  return axios({
    url: '/health-api/article/getArticleList',
    method: 'post',
    data: data,
  })
}

/**
 * 新增文章信息
 *
 */
export function addArticle(parameter) {
  return axios({
    url: '/health-api/article/addArticle',
    method: 'post',
    data: parameter
  })
}
/**
 * 修改文章信息
 *
 */
export function modifyArticle(parameter) {
  return axios({
    url: '/health-api/article/modifyArticle',
    method: 'post',
    data: parameter
  })
}
/**
 * 删除文章信息
 *
 */
export function deleteArticle(id) {
  return axios({
    url: '/health-api/article/deleteArticle/' + id,
    method: 'post',

  })
}
/**
 * 文章信息
 *
 */
export function getArticleByIdNew(id) {
  return axios({
    url: '/health-api/article/getArticleById/' + id,
    method: 'post',

  })
}

/**
 * 获取协议    hospitalCode   categoryId
 *
 */
export function getContract(data) {
  return axios({
    url: '/health-api/article/getContract',
    method: 'post',
    data: data
  })
}

/**
 * 获取协议列表    hospitalCode   categoryId
 *
 */
export function contractTypes(data) {
  return axios({
    url: '/health-api/article/contractTypes',
    method: 'get',
    params: data
  })
}

/**
 * 保存协议    hospitalCode   categoryId   content
 *
 */
export function saveContract(data) {
  return axios({
    url: '/health-api/article/saveContract',
    method: 'post',
    data: data
  })
}

/**
 * 下载协议PDF    hospitalCode   categoryId 
 *
 */
export function downloadPdfContract(data) {
  return axios({
    url: '/health-api/article/downloadPdfContract',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
/**
 * 协议上传监管平台    hospitalCode   categoryId 
 *
 */
export function reportPdfContract(data) {
  return axios({
    url: '/health-api/article/reportPdfContract',
    method: 'post',
    data: data
  })
}


/**
 * 分页查询参数列表
 */
export function sysConfigDatapage(data) {
  return axios({
    url: '/info-api/sysConfigData/page',
    method: 'post',
    data: data,
  })
}


/**
 * 保存参数配置
 */
export function saveSysConfigData(data) {
  return axios({
    url: '/info-api/sysConfigData/save',
    method: 'post',
    data: data,
  })
}

/**
 * 获取参数配置
 */
export function getSysConfigData(data) {
  return axios({
    url: '/info-api/sysConfigData/getConfig/' + data,
    method: 'get'
  })
}

/**
 * 分页查询系统字典类型
 */
export function sysDictTypePage(data) {
  return axios({
    url: '/info-api/sysDictType/page',
    method: 'post',
    data: data,
  })
}

/**
 * 某个字典类型下所有的字典
 */
export function sysDictDataLsit(data) {
  return axios({
    url: '/info-api/sysDictData/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加系统字典类型
 */
export function sysDictTypeAdd(data) {
  return axios({
    url: '/info-api/sysDictType/add',
    method: 'post',
    data: data,
  })
}
/**
 * 编辑系统字典类型
 */
export function sysDictTypeEdit(data) {
  return axios({
    url: '/info-api/sysDictType/edit',
    method: 'post',
    data: data,
  })
}
/**
 * 删除系统字典类型
 */
export function sysDictTypeDelete(data) {
  return axios({
    url: '/info-api/sysDictType/delete',
    method: 'get',
    params: data
  })
}
/**
 * 查看系统字典类型
 */
export function sysDictTypeDetail(data) {
  return axios({
    url: '/info-api/sysDictType/detail',
    method: 'get',
    params: data
  })
}
/**
 * 获取字典类型列表
 */
export function sysDictTypeList(data) {
  return axios({
    url: '/info-api/sysDictType/list',
    method: 'post',
    data: data,
  })
}
/**
 * 字典类型字典
 */
export function sysDictTypeTypes(data) {
  return axios({
    url: '/info-api/sysDictType/types',
    method: 'get',
    params: data
  })
}

/**
 * 添加系统字典值
 */
export function sysDictDataAdd(data) {
  return axios({
    url: '/info-api/sysDictData/add',
    method: 'post',
    data: data,
  })
}
/**
 * 编辑系统字典值
 */
export function sysDictDataEdit(data) {
  return axios({
    url: '/info-api/sysDictData/edit',
    method: 'post',
    data: data,
  })
}
/**
 * 删除系统字典值
 */
export function sysDictDataDelete(data) {
  return axios({
    url: '/info-api/sysDictData/delete',
    method: 'get',
    params: data
  })
}
/**
 * 查看系统字典值
 */
export function sysDictDataDetail(data) {
  return axios({
    url: '/info-api/sysDictData/detail',
    method: 'get',
    params: data
  })
}

/**
 * 添加短信网关
 */
export function addSmsConfigure(data) {
  return axios({
    url: '/follow-api/smsConfigure/addSmsConfigure',
    method: 'post',
    data: data,
  })
}
/**
 * 修改短信网关
 */
export function modifySmsConfigure(data) {
  return axios({
    url: '/follow-api/smsConfigure/modifySmsConfigure',
    method: 'post',
    data: data,
  })
}
/**
 * 删除短信网关
 */
export function deleteSmsConfigure(id) {
  return axios({
    url: '/follow-api/smsConfigure/deleteSmsConfigure/' + id,
    method: 'post',

  })
}
/**
 * 套餐列表接口
 */
export function getPkgList(data) {
  return axios({
    url: '/medical-api/pkg/list',
    method: 'post',
    data: data,
  })
}
/**
 * /pkg/updateStatus 套餐修改状态接口
 */
export function updatePkgStatus(data) {
  return axios({
    url: '/medical-api/pkg/updateStatus',
    method: 'post',
    data: data,
  })
}

/**
 * /pkg/getCommodityClassify 套餐分类接口
 */
export function getCommodityClassify(data) {
  return axios({
    url: '/medical-api/pkg/getCommodityClassify',
    method: 'post',
    data: data,
  })
}

/**
 * /commodityConfig/getCommodityPkgDetailByid 查询套餐规格详情
 */
export function getCommodityPkgDetailByid(data) {
  return axios({
    url: '/medical-api/commodityConfig/getCommodityPkgDetailByid',
    method: 'get',
    params: data,
  })
}

/**
 * /commodityConfig/delCollectionItemByid 删除套餐规格包明细项目
 */
export function delCollectionItemByid(data) {
  return axios({
    url: '/medical-api/commodityConfig/delCollectionItemByid',
    method: 'get',
    params: data,
  })
}

/**
 * /commodityConfig/delCommodityPkgCollectionByid 删除套餐规格包
 */
export function delCommodityPkgCollectionByid(data) {
  return axios({
    url: '/medical-api/commodityConfig/delCommodityPkgCollectionByid',
    method: 'get',
    params: data,
  })
}


/**
 * /pkg/saveOrUpdate 套餐新增、修改接口
 */
export function saveOrUpdate(data) {
  return axios({
    url: '/medical-api/pkg/saveOrUpdate',
    method: 'post',
    data: data,
  })
}

/**
 * 不良事件列表接口
 */
export function qryComplaintByPage(data) {
  return axios({
    url: '/medical-api/ehosp/qryComplaintByPage',
    method: 'post',
    data: data,
  })
}

/**
 * /ehosp/saveComplaint 不良事件登记、审核
 */
export function saveComplaint(data) {
  return axios({
    url: '/medical-api/ehosp/saveComplaint',
    method: 'post',
    data: data,
  })
}

/**
 * /ehosp/qryUploadLogByPage 查询上传日志
 */
export function qryUploadLogByPage(data) {
  return axios({
    url: '/medical-api/ehosp/qryUploadLogByPage',
    method: 'post',
    data: data,
  })
}

/**
 * /ehosp/getPreUploadLogByOrderIdAndType 根据订单、上传类型查询上传日志
 */
export function getPreUploadLogByOrderIdAndType(data) {
  return axios({
    url: '/medical-api/ehosp/getPreUploadLogByOrderIdAndType',
    method: 'get',
    params: data,
  })
}

/**
 * /ehosp/getUploadLogByOrderIdAndType 根据订单、上传类型查询上传日志
 */
export function getUploadLogByOrderIdAndType(data) {
  return axios({
    url: '/medical-api/ehosp/getUploadLogByOrderIdAndType',
    method: 'get',
    params: data,
  })
}

/**
 * /ehosp/getPreUploadLogList 根据订单、上传类型、业务数据id,查询上传日志
 */
export function getPreUploadLogList(data) {
  return axios({
    url: '/medical-api/ehosp/getPreUploadLogList',
    method: 'get',
    params: data,
  })
}

/**
 * /ehosp/reUpload 失败记录重传
 */
export function reUpload(data) {
  return axios({
    url: '/medical-api/ehosp/reUpload',
    method: 'get',
    params: data,
  })
}


/**
 * 健康商城首页 添加 
 */
export function addTdShopmallMainpageMenu(data) {
  return axios({
    url: '/uam-api/tdShopmallMainpageMenu/addTdShopmallMainpageMenu',
    method: 'post',
    data: data,
  })
}

/**
 * 健康商城首页 修改 
 */
export function modifyTdShopmallMainpageMenu(data) {
  return axios({
    url: '/uam-api/tdShopmallMainpageMenu/modifyTdShopmallMainpageMenu',
    method: 'post',
    data: data,
  })
}

/**
 * 健康商城首页 列表 
 */
export function getListTdShopmallMainpageMenu(data) {
  return axios({
    url: '/uam-api/tdShopmallMainpageMenu/getTdShopmallMainpageMenuPageList',
    method: 'post',
    data: data,
  })
}
/**
 * /pkg/detail/{commodityPkgId}  套餐详情接口
 */
export function getPkgDetail(commodityPkgId) {
  return axios({
    url: '/medical-api/pkg/detail/' + commodityPkgId,
    method: 'get',
    // data: data,
  })
}

/**
 * /commodityConfig/saveCommodityPkgCollection 修改套餐规格配置
 */
export function saveCommodityPkgCollection(data) {
  return axios({
    url: '/medical-api/commodityConfig/saveCommodityPkgCollection',
    method: 'post',
    data: data,
  })
}

/**
 * /accountInfo/getTreeUsersByDeptIdsAndRoles 根据科室与角色查询用户树列表
 */
export function getTreeUsersByDeptIdsAndRoles(data) {
  return axios({
    url: '/account-api/accountInfo/getTreeUsersByDeptIdsAndRoles',
    method: 'post',
    data: data,
  })
}

/**
 *  /tdHealthyTeamUserMapping/getHealthyTeamUserRoleGroupBy 获取健康管理团队配置
 * 
 * 参数  teamNameOrAbbr
 */

export function getHealthyTeamUserRoleGroupBy(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/getHealthyTeamUserRoleGroupBy',
    method: 'post',
    data: data,
  })
}

/**
 * /follow/plan/qryFollowPlanByFollowType 随访方案列表查询
 */
export function qryFollowPlanByFollowType(data) {
  return axios({
    url: "/follow-api/follow/plan/qryFollowPlanByFollowType",
    method: 'post',
    data: data,
  })
}

/**
 * 套餐分类 分页查询(健康商城应用)
 */
export function qryCommodityClassifyList(data) {
  return axios({
    url: '/medical-api/commodityConfig/qryCommodityClassifyList',
    method: 'post',
    data: data,
  })
}


/**
 * 修改套餐分类 接口
 */
export function saveCommodityClassify(data) {
  return axios({
    url: '/medical-api/commodityConfig/saveCommodityClassify',
    method: 'post',
    data: data,
  })
}


/**
 * 所属大类接口  
 */
export function getDictDataForCodeBorad(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/CLASSIFY_BROAD_CLASS',
    method: 'get',
    data: data,
  })
}



/**
* 租户类型  
*/
export function getDictDataForCodeTenatType(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/TENANT_TYPE',
    method: 'get',
    params: data,
  })
}


/**
 * 组织类型 
 */
export function getDictDataForCodeorgType(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/ORG_TYPE',
    method: 'get',
    params: data,
  })
}

/**
* 科室类型 
*/
export function getDictDataForCodeDepartType(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/DEPARTMENT_TYPE',
    method: 'get',
    params: data,
  })
}

/**
* 人员类型 
*/
export function getDictDataForCodeUserType(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/USER_TYPE',
    method: 'get',
    params: data,
  })
}


/**
 * 服务商商下拉框列表
 */
export function getServiceFactoryList(data) {
  return axios({
    url: '/uam-api/hospital/getServiceFactoryList',
    method: 'post',
    data: data,
  })
}


/**
 * 服务商列表
 */
export function getHospitalForTenantId(data) {
  return axios({
    url: '/uam-api/hospital/getHospitalForTenantId',
    method: 'get',
    params: data,
  })
}




/**
 * 关联服务商
 */
export function saveServiceFactoryHospitalMapping(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/saveServiceFactoryHospitalMapping',
    method: 'post',
    data: data,
  })
}

/**
 * 获取已勾选的 机构
 */
export function getServiceFactoryForHospitalCode(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/getServiceFactoryForHospitalCode',
    method: 'get',
    params: data,
  })
}


/**
 * 
 * 服务项目列表
 */
export function qryServiceItemList(data) {
  return axios({
    url: '/medical-api/commodityConfig/qryServiceItemList',
    method: 'post',
    data: data,
  })
}


/**
 * 项目类型
 */
export function getDictDataForCode(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/SERVICE_ITEM_TYPE',
    method: 'get',
    params: data,
  })
}


/**
 * 修改、保存 服务项目
 */
export function saveServiceItem(data) {
  return axios({
    url: '/medical-api/commodityConfig/saveServiceItem',
    method: 'post',
    data: data,
  })
}


/**
 * 厂商信息查询
 */
export function qryFactoryList(data) {
  return axios({
    url: '/medical-api/commodityConfig/qryFactoryList',
    method: 'post',
    data: data,
  })
}


/**
 * 健康管理团队分页列表(左侧分页列表)
 */
export function getTdHealthyTeamPageList(data) {
  return axios({
    url: '/uam-api/tdHealthyTeam/getTdHealthyTeamPageList',
    method: 'post',
    data: data,
  })
}


/**
 * 健康团队成员 分页列表(右侧 )
 */
export function getTdHealthyTeamUserPageList(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/getTdHealthyTeamUserPageList',
    method: 'post',
    data: data,
  })
}


/**
 * 健康管理团队成员下拉列表
 */
export function getHealthyTeamUserList(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/getHealthyTeamUserList',
    method: 'get',
    params: data,
  })
}


/**
 * 添加管理团队
 */
export function addTdHealthyTeam(data) {
  return axios({
    url: '/uam-api/tdHealthyTeam/addTdHealthyTeam',
    method: 'post',
    data: data,
  })
}

/**
 * 修改管理团队
 */
export function modifyTdHealthyTeam(data) {
  return axios({
    url: '/uam-api/tdHealthyTeam/modifyTdHealthyTeam',
    method: 'post',
    data: data,
  })
}


/**
* 删除管理团队
*/
export function deleteTdHealthyTeam(data) {
  return axios({
    url: '/uam-api/tdHealthyTeam/deleteTdHealthyTeam/' + data,
    method: 'get',
    // params:data,
  })
}



/**
* 健康管理团队删除人员
*/
export function deleteTdHealthyTeamUser(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/deleteTdHealthyTeamUser/' + data,
    method: 'get',
    // params:data,
  })
}


/**
* 管理团队添加人员 
*/
export function addTdHealthyTeamUser(data) {
  return axios({
    url: '/uam-api/tdHealthyTeamUserMapping/addTdHealthyTeamUser',
    method: 'post',
    data: data,
  })
}


/**
* 角色类型 
*/
export function getDictDataForCodeTeamType(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/TEAMROLE',
    method: 'get',
    params: data,
  })
}


/**
 * 获取字典
 */
export function getDictData(param) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/' + param,
    method: 'get',
  })
}

//医疗学科列表
export function getTdMedicalSubjectPageList(data) {
  return axios({
    url: '/uam-api/tdMedicalSubject/getTdMedicalSubjectPageList',
    method: 'get',
    params: data,
  })
}
//增加医疗学科
export function addTdMedicalSubject(data) {
  return axios({
    url: '/uam-api/tdMedicalSubject/addTdMedicalSubject',
    method: 'post',
    data: data,
  })
}
//修改医疗学科
export function modifyTdMedicalSubject(data) {
  return axios({
    url: '/uam-api/tdMedicalSubject/modifyTdMedicalSubject',
    method: 'post',
    data: data,
  })
}
//删除医疗学科
export function deleteTdMedicalSubject(id) {
  return axios({
    url: '/uam-api/tdMedicalSubject/deleteTdMedicalSubject/' + id,
    method: 'get',
  })
}

/**
 * 获取随访文章统计数据
 */

export function getFollowArticleData(data) {
  return axios({
    url: '/follow-api/followPlanPhone/getFollowArticleData',
    method: 'post',
    data: data,
  })
}
/**
 * 获取随访文章人员数据
 */

export function getFollowArticleUserData(data) {
  return axios({
    url: '/follow-api/followPlanPhone/getFollowArticleUserData',
    method: 'post',
    data: data,
  })
}


//医疗学科列表
export function treeMedicalSubjects(data) {
  return axios({
    url: '/uam-api/tdMedicalSubject/treeMedicalSubjects',
    method: 'get',
    params: data,
  })
}


//问卷管理中的问卷列表接口
export function getQuestionnaireList(data) {
  return axios({
    url: '/follow-api/questionnaireStatistics/getQuestionnaireListForHospital',
    method: 'post',
    data: data,
  })
}


//删除问卷
export function deleteQuestion(data) {
  return axios({
    url: '/follow-api/questionnaireStatistics/deleteQuestion',
    method: 'get',
    params: data,
  })
}


export function updateDeptAndHospCodeForKey(data) {
  return axios({
    url: '/follow-api/questionnaireStatistics/updateDeptAndHospCodeForKey',
    method: 'get',
    params: data,
  })
}





//修改问卷状态
export function updateQuestionStatus(data) {
  return axios({
    url: '/follow-api/questionnaireStatistics/updateQuestionStatus',
    method: 'get',
    params: data,
  })
}


//问卷免登陆 跳转
export function createNoLogin(data) {
  return axios({
    url: '/follow-api/questionnaireStatistics/createQuestionnaireNoLogin',
    method: 'get',
    params: data,
  })
}

//follow/userplan/getFollowUserPlanPcList 用户随访方案列表(管理端)
export function getFollowUserPlanPcList(data) {
  return axios({
    url: '/follow-api/follow/userplan/getFollowUserPlanPcList',
    method: 'post',
    data: data,
  })
}

// follow/userplan/stopFollowUserPlan/{userId}  终止当前用户方案
export function stopFollowUserPlan(data) {
  return axios({
    url: '/follow-api/follow/userplan/stopFollowUserPlan',
    method: 'post',
    data: data,
  })
}

//follow/userplan/stopFollowUserPlanTask/{id}  停止用户当前随访任务
export function stopFollowUserPlanTask(id) {
  return axios({
    url: '/follow-api/follow/userplan/stopFollowUserPlanTask/' + id,
    method: 'post',
    // data: data,
  })
}

//followMetaConfigure/getPatientInfo  档案基本信息查询
export function getPatientInfo(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/getPatientInfo',
    method: 'get',
    params: data,
  })
}

//followMetaConfigure/updatePatientInfo  修改档案基本信息
export function updatePatientInfo(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/updatePatientInfo',
    method: 'post',
    data: data,
  })
}


//订单分组
export function getOrderStatusGroupByData(data) {
  return axios({
    url: '/medical-api/admorder/getOrderStatusGroupByData',
    method: 'post',
    data: data,
  })
}


// 处方发货 tab分组
export function getPreShipStatusGroupByData(data) {
  return axios({
    url: '/medical-api/admorder/getPreShipStatusGroupByData',
    method: 'post',
    data: data,
  })
}



//订单列表
export function orderList(data) {
  return axios({
    url: '/medical-api/admorder/list',
    method: 'post',
    data: data,
  })
}

// 处方发货列表
export function preShipList(data) {
  return axios({
    url: '/medical-api/admorder/preShipList',
    method: 'post',
    data: data
  })
}

//订单列表 数字商品
export function datatreatOrderList(data) {
  return axios({
    url: '/medical-api/datatreat/orderList',
    method: 'post',
    data: data,
  })
}
// 数字商品发货
export function datatreatupdateExpressInfo(data) {
  return axios({
    url: '/medical-api/datatreat/updateExpressInfo',
    method: 'post',
    data: data,
  })
}
//订单详情
export function getOrderDetail(data) {
  return axios({
    url: '/medical-api/admorder/detail',
    method: 'get',
    params: data,
  })
}


//处方订单详情
export function getMedicalChufangDetail(data) {
  return axios({
    url: '/medical-api/medical/getMedicalOrdersDetail/' + data,
    method: 'post',
    // params: data,
  })
}


//处方信息
export function getMedicalOrdersInfo(data) {
  return axios({
    url: '/medical-api/medical/getMedicalOrdersInfo/' + data,
    method: 'post',
    // params: data,
  })
}






//取消订单
export function cancelOrder(data) {
  return axios({
    url: '/medical-api/admorder/cancel',
    method: 'post',
    data: data,
  })
}


//订单可退款明细
export function canRefundItems(data) {
  return axios({
    url: '/medical-api/admorder/canRefundItems',
    method: 'get',
    params: data,
  })
}


//申请退款
export function applyRefund(data) {
  return axios({
    url: '/medical-api/admorder/applyRefund',
    method: 'post',
    data: data,
  })
}


//退款列表表头信息
export function getTab(data) {
  return axios({
    url: '/medical-api/admrefund/tab',
    method: 'post',
    data: data,
  })
}


//管理端-分页查询退款单
export function getPage(data) {
  return axios({
    url: '/medical-api/admrefund/page',
    method: 'post',
    data: data,
  })
}

//管理端-退款单详情
export function refundDetail(data) {
  return axios({
    url: '/medical-api/admrefund/detail',
    method: 'get',
    params: data,
  })
}
//获取配置了客户联系功能的成员列表
export function getOwnConnectCustomerFunUserList(data) {
  return axios({
    url: '/medical-api/tdCompanywxApplication/getOwnConnectCustomerFunUserList/1',
    method: 'get',
    params: data,
  })
}

//管理端-退款审核
export function examine(data) {
  return axios({
    url: '/medical-api/admrefund/audit',
    method: 'post',
    data: data,
  })
}


//交易账单流水-汇总信息
export function tradeBillSummary(data) {
  return axios({
    url: '/order-api/order/bill/tradeBillSummary',
    method: 'post',
    data: data
  })
}


//交易流水 列表
export function tradeBillPage(data) {
  return axios({
    url: '/order-api/order/bill/tradeBillPage',
    method: 'post',
    data: data,
  })
}

//交易账单-按收款方Tab信息
export function tradeBillTab(data) {
  return axios({
    url: '/order-api/order/bill/tradeBillTab',
    method: 'post',
    data: data,
  })
}

//交易账单-对账流水分页 详情
export function tradeRecordPage(data) {
  return axios({
    url: '/order-api/order/bill/tradeRecordPage',
    method: 'post',
    data: data,
  })
}


//交易账单-对账流水分渠道汇总
export function tradeRecordChannelSummary(data) {
  return axios({
    url: '/order-api/order/bill/tradeRecordChannelSummary',
    method: 'post',
    data: data,
  })
}

//交易账单-日对账明细>按天对账流水TAB
export function tradeRecordTab(data) {
  return axios({
    url: '/order-api/order/bill/tradeRecordTab',
    method: 'post',
    data: data,
  })
}



//交易账单-日对账明细>按天对账流水导出
export function tradeRecordExport(data) {
  return axios({
    url: '/order-api/order/bill/tradeRecordExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


//交易账单-总对账>按天汇总导出
export function tradeBillExport(data) {
  return axios({
    url: '/order-api/order/bill/tradeBillExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


//用户标签分类列表
export function getUserTagsTypeList(data) {
  return axios({
    url: '/account-api/tdUserTagsType/getUserTagsTypeList',
    method: 'post',
    data: data,
  })

}


//添加用户标签分类
export function addUserTagsType(data) {
  return axios({
    url: '/account-api/tdUserTagsType/addUserTagsType',
    method: 'post',
    data: data,
  })

}



/**
* 所属大类 字典
*/
export function getDictDataForCodeTagstype(data) {
  return axios({
    url: '/info-api/feign/sysdictdata/getDictDataForCode/tags_type',
    method: 'get',
    params: data,
  })
}




//删除分类
export function deleteUserTagsType(id) {
  return axios({
    url: '/account-api/tdUserTagsType/deleteUserTagsType/' + id,
    method: 'post',
    // data:data,
  })

}



//修改分类
export function modifyUserTagsType(data) {
  return axios({
    url: '/account-api/tdUserTagsType/modifyUserTagsType',
    method: 'post',
    data: data,
  })

}


//用户标签列表
export function getUserTags(data) {
  return axios({
    url: '/account-api/tdUserTags/getUserTags',
    method: 'post',
    data: data,
  })
}


//删除用户标签
export function deleteUserTag(id) {
  return axios({
    url: '/account-api/tdUserTags/deleteUserTags/' + id,
    method: 'post',
    // data:data,
  })
}

//添加用户标签
export function addUserTag(data) {
  return axios({
    url: '/account-api/tdUserTags/addUserTags',
    method: 'post',
    data: data,
  })
}

//修改用户标签
export function modifyUserTag(data) {
  return axios({
    url: '/account-api/tdUserTags/modifyUserTags',
    method: 'post',
    data: data,
  })
}


//随访统计列表
export function qryFollowStatList(data) {
  return axios({
    url: '/follow-api/follow/stat/qryFollowStatList',
    method: 'post',
    data: data,
  })
}

//统计(标题)
export function getFollowStat(data) {
  return axios({
    url: '/follow-api/follow/stat/getFollowStat',
    method: 'post',
    data: data,
  })
}

// 全院统计列表
export function qryFollowStatByGroup(data) {
  return axios({
    url: '/follow-api/follow/stat/qryFollowStatByGroup',
    method: 'post',
    data: data,
  })
}


// 随访分组统计信息导出
export function exportFollowStatByGroup(data) {
  return axios({
    url: '/follow-api/excel/exportFollowStatByGroup',
    method: 'post',
    data: data,
    responseType: 'blob',
  })
}






//导出
export function exportFollowStatListm(data) {
  return axios({
    url: '/follow-api/excel/exportFollowStatList',
    method: 'post',
    data: data,
    responseType: 'blob',
  })
}



//打标识
export function updatePatientSpecFlag(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/updatePatientSpecFlag',
    method: 'post',
    data: data,
  })
}

//患者信息查询  
export function getPatientInfoCon(id) {
  return axios({
    url: '/follow-api/followMetaConfigure/getPatientInfo/' + id,
    method: 'post'
  })
}




//收款方列表  收款方列表
export function getTbMerchantPageList(data) {
  return axios({
    url: '/order-api/tbMerchant/getTbMerchantPageList',
    method: 'post',
    data: data
  })
}
//病种列表  
export function getDiseaseTypePageList(data) {
  return axios({
    url: '/info-api/tdDiseaseType/getDiseaseTypePageList',
    method: 'post',
    data: data,
  })
}


//添加收款方
export function addTbMerchant(data) {
  return axios({
    url: '/order-api/tbMerchant/addTbMerchant',
    method: 'post',
    data: data,
  })
}

//学科列表
export function gettreeMedicalSubjects(data) {
  return axios({
    url: '/uam-api/tdMedicalSubject/treeMedicalSubjects',
    method: 'get',
    params: data,
  })
}


//修改状态
export function modifyStatus(data) {
  return axios({
    url: '/order-api/tbMerchant/modifyStatus',
    method: 'post',
    data: data,
  })
}

//修改收款方信息
export function modifyTbMerchant(data) {
  return axios({
    url: '/order-api/tbMerchant/modifyTbMerchant',
    method: 'post',
    data: data,
  })
}

//收款配置列表接口
export function getTbBizMerchantPageList(data) {
  return axios({
    url: '/order-api/tbBizMerchant/getTbBizMerchantPageList',
    method: 'post',
    data: data,
  })
}
//处方流转配置列表接口
export function getCflzMerchantPageList(data) {
  return axios({
    url: '/uam-api/tdPrescriptionFlowConfig/getTdPrescriptionFlowPageList',
    method: 'post',
    data: data,
  })
}

//处方流转配置
export function prescriptionFlowConfig(data) {
  return axios({
    url: '/uam-api/tdPrescriptionFlowConfig/prescriptionFlowConfig',
    method: 'post',
    data: data,
  })
}

//收款配置
export function tbBizMerchantConfig(data) {
  return axios({
    url: '/order-api/tbBizMerchant/tbBizMerchantConfig',
    method: 'post',
    data: data,
  })
}


//新增病种
export function addDiseaseType(data) {
  return axios({
    url: '/info-api/tdDiseaseType/addDiseaseType',
    method: 'post',
    data: data,
  })
}

//删除病种
export function deleteDiseaseType(id) {
  return axios({
    url: '/info-api/tdDiseaseType/deleteDiseaseType/' + id,
    method: 'get',
    // params: id,
  })
}


//修改病种
export function modifyDiseaseType(data) {
  return axios({
    url: '/info-api/tdDiseaseType/modifyDiseaseType',
    method: 'post',
    data: data,
  })
}

//上传模板
export function importPatientData(data) {
  return axios({
    url: '/follow-api/followMetaConfigure/importPatientData',
    method: 'post',
    data: data,
  })
}


//下载模板
export function downloadModel(data) {
  return axios({
    url: '/follow-api/名单导入模板.xlsx',
    method: 'post',
    // data: data,
  })
}


//查询方案绑定人信息
export function qryPlanUserInfo(data) {
  return axios({
    url: '/follow-api/follow/userplan/qryPlanUserInfo',
    method: 'post',
    data: data,
  })
}



//处方审核tab
export function checkPreTab(data) {
  return axios({
    url: '/medical-api/medOrders/checkPreTab',
    method: 'post',
    data: data,
  })
}


//处方审核列表
export function checkPrePage(data) {
  return axios({
    url: '/medical-api/medOrders/checkPrePage',
    method: 'post',
    data: data,
  })
}

//处方审核
export function checkPre(data) {
  return axios({
    url: '/medical-api/medOrders/checkPre',
    method: 'post',
    data: data,
  })
}


//处方详情
export function preDetail(data) {
  return axios({
    url: '/medical-api/medOrders/preDetail',
    method: 'get',
    params: data,
  })
}

//复诊续方权益Id查看处方列表
export function getPreListByRightsId(data) {
  return axios({
    url: '/medical-api/medOrders/getPreListByRightsId',
    method: 'get',
    params: data,
  })
}

//用户基本信息
export function getUserExternalInfo(userId) {
  return axios({
    url: '/account-api/getUserExternalInfo/' + userId,
    method: 'post',
    // data: data,
  })
}

//用户标签信息
export function getSavedUserTagsInfo(userId) {
  return axios({
    url: '/account-api/getSavedUserTagsInfo/' + userId,
    method: 'post',
    // data: data,
  })
}


// 机构分类列表接口
export function institutionClassify(data) {
  return axios({
    url: '/info-api/medinsInfo/institutionClassify',
    method: 'post',
    data: data,
  })
}
// 药品SKU列表接口
export function medicinePage(data) {
  return axios({
    url: '/info-api/medicine/page',
    method: 'post',
    data: data,
  })
}
// 药品启用/停用
export function updateMedicStatus(data) {
  return axios({
    url: '/info-api/medicine/updateStatus',
    method: 'post',
    data: data,
  })
}
// 药品详情
export function medicineDetail(data) {
  return axios({
    url: '/info-api/medicine/detail',
    method: 'get',
    params: data,
  })
}

// 药品类型下拉列表
export function getMedicineCategoryList(data) {
  return axios({
    url: '/info-api/standardMedicine/getMedicineCategoryList',
    method: 'post',
    data: data,
  })
}

// 药品剂型下拉列表
export function getDosageFormIdList(data) {
  return axios({
    url: '/info-api/standardMedicine/getDosageFormIdList',
    method: 'post',
    data: data,
  })
}

// 药品剂型下拉列表
export function getDosageList(data) {
  return axios({
    url: '/info-api/sysDosageForm/page',
    method: 'post',
    data: data,
  })
}

///datatreat/statFactoryDetail  数字厂商结算统计明细
export function statFactoryDetail(data) {
  return axios({
    url: '/medical-api/datatreat/statFactoryDetail',
    method: 'post',
    data: data,
  })
}
//  /datatreat/statFactoryReport 数字厂商结算统计
export function statFactoryReport(data) {
  return axios({
    url: '/medical-api/datatreat/statFactoryReport',
    method: 'post',
    data: data,
  })
}
//  /excel/exportDataTreatReport 数字厂商结算统计导出
export function exportDataTreatReport(data) {
  return axios({
    url: '/medical-api/excel/exportDataTreatReport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

//设置医生证件信息
export function setCertificateForUserId(data) {
  return axios({
    url: '/account-api/tdUserInfoCaAuth/setCertificateForUserId',
    method: 'post',
    data: data,
  })
}


//获取医生证件信息
export function getCaAuthInfoAdminForUserId(userid) {
  return axios({
    url: '/account-api/tdUserInfoCaAuth/getCaAuthInfoAdminForUserId/' + userid,
    method: 'post',
    // data: data,
  })
}

//获取医生证件信息
export function updateExpressInfo(data) {
  return axios({
    url: '/medical-api/admorder/updateExpressInfo',
    method: 'post',
    data: data,
  })
}

// 科室里面的 监管机构编码列表
export function getTdMedicalSubjectPageListForVer(data) {
  return axios({
    url: '/uam-api/tdMedicalSubject/getTdMedicalSubjectPageListForVer/',
    method: 'get',
    params: data,
  })
}

// ca验证密码
export function checkCaPassword(data) {
  return axios({
    url: '/account-api/tdUserInfoCaAuth/checkCaPassword',
    method: 'get',
    params: data,
  })
}

// 厂商修改状态
export function modifyfactoryStatus(data) {
  return axios({
    url: '/medical-api/factory/status',
    method: 'post',
    data: data,
  })
}

// 厂商信息 详情
export function factoryDetail(data) {
  return axios({
    url: '/medical-api/factory/detail/?id=' + data,
    method: 'get',
    // params: data,
  })
}


// 保存厂商
export function saveFactory(data) {
  return axios({
    url: '/medical-api/factory/save',
    method: 'post',
    data: data,
  })
}
