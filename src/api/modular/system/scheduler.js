import { axios } from '@/utils/request'

var token='eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYzNTM1NDkxMH0.A_uJs8X9ld408lXXO-27HMtgeypL2JFli1VLFVxHcWWCDyrjKp_fnhN9_JOOUDiE0NHazNNSYIfco2PrlpwYu2Fr9AnNR6rSmNHAtSJr8RP8neCuv-5RQttEEOQXbICM6oyorx_QhfuFStyV28RuoGJuS_qsNo5fiEVrSGLg0k-K_FF2Rs-U-OR5PLWoi3V1UdAOY7kNw7yf3nORdKSNaD_exKFNbiBwC6_b40ls8AUuGImzAOxmYF5D-sY_iAI21DpBRVE7c6YHJZzUhoFUNUywvkcDH_WmRiOXy2o04EPd02sCJZrZZRMUJoP44KKw_UMSRDmX0UCyhf3hrqEe6g'
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
    headers:{'token':token},
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
  return axios({
    url: preUrl + '/schedule/saveSchedulePeriods',
    headers: { 'token': token },
    parameter
  })
}

/**
 * 编辑角色
 *
 * @author yubaoshan
 * @date 2020/5/6 11:44
 */
export function sysRoleEdit (parameter) {
  return axios({
    url: '/sysRole/edit',
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
export function sysRoleDelete (parameter) {
  return axios({
    url: '/sysRole/delete',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除角色
 *
 * @author yubaoshan
 * @date 2020/5/7 11:28
 */
export function sysRoleDeteil (parameter) {
  return axios({
    url: '/sysRole/detail',
    method: 'get',
    params: parameter
  })
}

/**
 * 获取授权角色列表
 *
 * @author yubaoshan
 * @date 2020/5/26 23:59
 */
export function sysRoleDropDown (parameter) {
  return axios({
    url: '/sysRole/dropDown',
    method: 'get',
    params: parameter
  })
}

/**
 * 拥有菜单
 *
 * @author yubaoshan
 * @date 2020/6/02 19:02
 */
export function sysRoleOwnMenu (parameter) {
  return axios({
    url: '/sysRole/ownMenu',
    method: 'get',
    params: parameter
  })
}

/**
 * 授权菜单
 *
 * @author yubaoshan
 * @date 2020/6/2 21:10
 */
export function sysRoleGrantMenu (parameter) {
  return axios({
    url: '/sysRole/grantMenu',
    method: 'post',
    data: parameter
  })
}

/**
 * 拥有数据
 *
 * @author yubaoshan
 * @date 2020/6/02 21:40
 */
export function sysRoleOwnData (parameter) {
  return axios({
    url: '/sysRole/ownData',
    method: 'get',
    params: parameter
  })
}

/**
 * 授权数据
 *
 * @author yubaoshan
 * @date 2020/6/2 21:50
 */
export function sysRoleGrantData (parameter) {
  return axios({
    url: '/sysRole/grantData',
    method: 'post',
    data: parameter
  })
}