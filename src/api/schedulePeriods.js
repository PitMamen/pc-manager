import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getSchedulePeriods(data, start, pageSize) {
  return request({
    url: 'http://192.168.1.122:8072/schedule/qrySchedulePeriods?start=' + start + '&pageSize=' + pageSize,
    method: 'post',
    headers: { 'token': 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYzNDgxOTAwNn0.KWhy_n7fOivDtBgtJc8HFjRz34T0GLklB5lZpE0VMiCPhZlqxDjIwiCJ0jcyja79DSfofWvBvw7SNtsNB_ylC61UkfHzddwUUEMZ3kWQejjnQXej6BXQHT4Di2BLvilNqSZixavHTdOLur-fwNoeucUqhtkW9fd6ipy2Xw5F4a_oCf7hQKdF1YMUJ3-oPnkGbEGW3_G1n47IMMX6mDjjFA0aV9x7ZYPMA5DEBQjB38mE_W26KFeeU3ol-hNLxundwif4yblm4SxpysAyeefpfcfNuV0Vo1fxapLNUe6Wa-keNPechL_j9E9890ynVZ_OvBI-iDIToihV4J5Pu6rQ5Q' },
    data
  })
}

export function confirmEntity(data) {
  return request({
    url: 'http://192.168.1.122:8072/schedule/saveSchedulePeriods',
    method: 'post',
    headers: { 'token': 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYzNDgxOTAwNn0.KWhy_n7fOivDtBgtJc8HFjRz34T0GLklB5lZpE0VMiCPhZlqxDjIwiCJ0jcyja79DSfofWvBvw7SNtsNB_ylC61UkfHzddwUUEMZ3kWQejjnQXej6BXQHT4Di2BLvilNqSZixavHTdOLur-fwNoeucUqhtkW9fd6ipy2Xw5F4a_oCf7hQKdF1YMUJ3-oPnkGbEGW3_G1n47IMMX6mDjjFA0aV9x7ZYPMA5DEBQjB38mE_W26KFeeU3ol-hNLxundwif4yblm4SxpysAyeefpfcfNuV0Vo1fxapLNUe6Wa-keNPechL_j9E9890ynVZ_OvBI-iDIToihV4J5Pu6rQ5Q' },
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteEntity(id) {
  var data = {}
  return request({
    url: 'http://192.168.1.122:8072/schedule/delSchedulePeriods?id=' + id,
    method: 'post',
    headers: { 'token': 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYzNDgxOTAwNn0.KWhy_n7fOivDtBgtJc8HFjRz34T0GLklB5lZpE0VMiCPhZlqxDjIwiCJ0jcyja79DSfofWvBvw7SNtsNB_ylC61UkfHzddwUUEMZ3kWQejjnQXej6BXQHT4Di2BLvilNqSZixavHTdOLur-fwNoeucUqhtkW9fd6ipy2Xw5F4a_oCf7hQKdF1YMUJ3-oPnkGbEGW3_G1n47IMMX6mDjjFA0aV9x7ZYPMA5DEBQjB38mE_W26KFeeU3ol-hNLxundwif4yblm4SxpysAyeefpfcfNuV0Vo1fxapLNUe6Wa-keNPechL_j9E9890ynVZ_OvBI-iDIToihV4J5Pu6rQ5Q' },
    data
  })
}
