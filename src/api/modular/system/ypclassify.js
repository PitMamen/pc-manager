import { axios } from '@/utils/request'

/**
 * 列表
 */
export function list1 (parameter) {
  return axios({
    url: '/info-api/sysTreatType/page',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add1 (parameter) {
  return axios({
    url: '/info-api/sysTreatType/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update1 (parameter) {
  return axios({
    url: '/info-api/sysTreatType/modify',
    method: 'post',
    data: parameter
  })
}

/**
 * 列表
 */
 export function list2 (parameter) {
  return axios({
    url: '/info-api/sysDosageForm/page',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add2 (parameter) {
  return axios({
    url: '/info-api/sysDosageForm/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update2 (parameter) {
  return axios({
    url: '/info-api/sysDosageForm/modify',
    method: 'post',
    data: parameter
  })
}

/**
 * 列表
 */
 export function list3 (parameter) {
  return axios({
    url: '/info-api/sysPharmacologyType/page',
    method: 'post',
    data: parameter
  })
}

/**
 * 添加
 */
 export function add3 (parameter) {
  return axios({
    url: '/info-api/sysPharmacologyType/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 修改
 */
 export function update3 (parameter) {
  return axios({
    url: '/info-api/sysPharmacologyType/modify',
    method: 'post',
    data: parameter
  })
}
