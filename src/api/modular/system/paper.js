import { axios } from '@/utils/request'

/**
 * 获取问卷列表
 */
export function list1 (parameter) {
  return axios({
    url: '/follow-api/questionnaireStatistics/getQuestionnaireList',
    method: 'post',
    data: parameter
  })
}

/**
 * 统计问卷每一项的填写情况
 */
 export function list2 (parameter) {
  return axios({
    url: '/follow-api/questionnaireStatistics/statisticsRadioAndCheckboxAndInput',
    method: 'post',
    data: parameter
  })
}

/**
 * 分页获取input类型的问卷数据
 */
 export function list3 (parameter) {
  return axios({
    url: '/follow-api/questionnaireStatistics/statisticsInputRecordInfo',
    method: 'post',
    data: parameter
  })
}

/**
 * 问卷总览情况统计
 */
 export function overview (parameter) {
  return axios({
    url: '/follow-api/questionnaireStatistics/followOverviewStatistics',
    method: 'post',
    data: parameter
  })
}

/**
 * 随访方式分布
 */
 export function pie (parameter) {
  return axios({
    url: '/follow-api/questionnaireStatistics/followMessageTypeStatistics',
    method: 'post',
    data: parameter
  })
}

/**
 * 失败原因top5
 */
 export function bar (parameter) {
  return axios({
    url: '/follow-api/questionnaireStatistics/followFailReasonStatistics',
    method: 'post',
    data: parameter
  })
}
