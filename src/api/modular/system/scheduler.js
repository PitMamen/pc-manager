import { axios } from '@/utils/request'
var preUrl = 'http://192.168.1.122:8072'

/**
 * 获取角色列表
 *
 * @author yubaoshan
 * @date 2020/5/6 11:44
 */
export function getSchedulerPeriodPage (parameter) {
  var start=parameter.pageNo
  var pageSize=parameter.pageSize
  return axios({
    url: preUrl + '/schedule/qrySchedulePeriods?start=' + start + '&pageSize=' + pageSize,
    method: 'post',
    // headers:{'token':token},
    data: {}
  })
}

/**
 * 增加角色
 *
 * @author yubaoshan
 * @date 2020/5/6 11:44
 */
export function schedulerAdd (parameter) {
  delete parameter['startTime']
  delete parameter['endTime']
  return axios({
    url: preUrl + '/schedule/saveSchedulePeriods',
    method: 'post',
    data:parameter
  })
}

/**
 * 编辑角色
 *
 * @author yubaoshan
 * @date 2020/5/6 11:44
 */
export function schedulerEdit (parameter) {
  delete parameter['startTime']
  delete parameter['endTime']
  return axios({
    url: preUrl + '/schedule/saveSchedulePeriods',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除角色
 *
 * @author yubaoshan
 * @date 2020/5/6 17:51
 */
export function schedulerDelete (parameter) {
  return axios({
    url: preUrl + '/schedule/delSchedulePeriods?id=' + parameter.id,
    method: 'get',
    data: parameter
  })
}
