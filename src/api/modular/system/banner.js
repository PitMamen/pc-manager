import { axios } from '@/utils/request'

/**
 * 获取角色列表
 *
 * @author yubaoshan
 * @date 2020/5/6 11:44
 */
export function getBannerPage (parameter) {
  var start=parameter.pageNo
  var pageSize=parameter.pageSize
  return axios({
    url: '/banner/qryBanner?start=' + start + '&pageSize=' + pageSize,
    method: 'get',
    data: {}
  })
}

export const host = 'http://192.168.1.122:8071'

/**
 * 增加角色
 *
 * @author yubaoshan
 * @date 2020/5/6 11:44
 */
export function bannerAdd (parameter) {
  return axios({
    url: '/banner/saveBanner',
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
export function bannerEdit (parameter) {
  return axios({
    url: '/banner/saveBanner',
    method: 'post',
    data: parameter
  })
}
export function setHidden (parameter) {
  var obj={}
  obj.id=parameter.id
  obj.isVisible=!parameter.isVisible

  return axios({
    url: '/banner/saveBanner',
    method: 'post',
    data: obj
  })
}
export function moveUp (parameter) {
  var obj={}
  obj.id=parameter.id
  obj.sortIndex=parameter.sortIndex+1

  return axios({
    url: '/banner/saveBanner',
    method: 'post',
    data: obj
  })
}
export function moveDown (parameter) {
  var obj={}
  obj.id=parameter.id
  obj.sortIndex=parameter.sortIndex-1

  return axios({
    url: '/banner/saveBanner',
    method: 'post',
    data: obj
  })
}

export function bannerDelete (parameter) {
  return axios({
    url: '/banner/delBanner?id=' + parameter.id,
    method: 'get',
    data: parameter
  })
}

export function batchDelete (parameter) {
  return axios({
    url: '/banner/delBanners',
    method: 'post',
    data: parameter
  })
}



