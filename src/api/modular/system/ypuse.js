import { axios } from '@/utils/request'

/**
 * 列表
 */
export function list1 (parameter) {
  return axios({
    url: '/info-api/sysInstr/page',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add1 (parameter) {
  return axios({
    url: '/info-api/sysInstr/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update1 (parameter) {
  return axios({
    url: '/info-api/sysInstr/modify',
    method: 'post',
    data: parameter
  })
}

/**
 * 列表
 */
 export function list2 (parameter) {
  return axios({
    url: '/info-api/sysDoseUnit/page',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add2 (parameter) {
  return axios({
    url: '/info-api/sysDoseUnit/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update2 (parameter) {
  return axios({
    url: '/info-api/sysDoseUnit/modify',
    method: 'post',
    data: parameter
  })
}

/**
 * 列表
 */
 export function list3 (parameter) {
  return axios({
    url: '/info-api/sysFreq/page',
    method: 'post',
    data: parameter
  })
}

/**
 * corn
 */
 export function info3 (parameter) {
  return axios({
    url: '/info-api/sysFreq/corn',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add3 (parameter) {
  return axios({
    url: '/info-api/sysFreq/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update3 (parameter) {
  return axios({
    url: '/info-api/sysFreq/modify',
    method: 'post',
    data: parameter
  })
}
