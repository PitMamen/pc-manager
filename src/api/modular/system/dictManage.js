import { axios } from '@/utils/request'


/**
 * 分页查询系统字典类型
 *
 * @author yubaoshan
 * @date 2020/5/17 01:46
 */
export function sysDictTypePage (parameter) {
  return axios({
    url: '/info-api/sysDictType/page',
    method: 'get',
    params: parameter
  })
}

/**
 * 添加系统字典类型
 *
 * @author yubaoshan
 * @date 2020/5/17 01:46
 */
export function sysDictTypeAdd (parameter) {
  return axios({
    url: '/info-api/sysDictType/add',
    method: 'post',
    data: parameter
  })
}

/**
 * 编辑系统字典类型
 *
 * @author yubaoshan
 * @date 2020/5/17 01:50
 */
export function sysDictTypeEdit (parameter) {
  return axios({
    url: '/info-api/sysDictType/edit',
    method: 'post',
    data: parameter
  })
}

/**
 * 删除系统字典类型
 *
 * @author yubaoshan
 * @date 2020/5/17 01:50
 */
export function sysDictTypeDelete (parameter) {
  return axios({
    url: '/info-api/sysDictType/delete',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取字典类型下所有字典，举例，返回格式为：[{code:"M",value:"男"},{code:"F",value:"女"}]
 *
 * @author yubaoshan
 * @date 2020/6/10 00:10
 */
export function sysDictTypeDropDown (parameter) {
  return axios({
    url: '/info-api/sysDictType/dropDown',
    method: 'get',
    params: parameter
  })
}

