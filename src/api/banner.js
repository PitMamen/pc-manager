import request from '@/utils/request'

var token = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYzNDkwMzM2Mn0.YdXVYLAC7B9jGK5Vg9PtfM_XgRHW10r5fiGaZ-uFWdMaa2bOynmrrRI71Zy_Zi7MKZYgEqLWiPpgDQuOk4APmFopFxzg9oZEudSglxDqqlW3BZ2jutMEHL6swhwFTDm0BQPvLmzUCSEpGEQjCgLikV_4QEgM8SVDtBOO-FmsNORH4vE8GwSf3zesvTktS4rAGdes18Ukht5VJQ-trEJist2ASOXaWFsjs_ZBUT9dhUQhpihrgObGMmf0ptyzjHqvh1E4gI7zOC-5Kpzag5303b0LddnjOL_hnCfGs3B7IU5Kye-TUuyLK43wBAoR0OebN8sHWMbPawNr8vieLL9HoA'
var preUrl = 'http://192.168.1.122:8072'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getSchedulePeriods(data, start, pageSize) {
  return request({
    url: preUrl + '/schedule/qrySchedulePeriods?start=' + start + '&pageSize=' + pageSize,
    method: 'post',
    headers: { 'token': token },
    data
  })
}

export function confirmEntity(data) {
  return request({
    url: preUrl + '/schedule/saveSchedulePeriods',
    method: 'post',
    headers: { 'token': token },
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
    url: preUrl + '/schedule/delSchedulePeriods?id=' + id,
    method: 'post',
    headers: { 'token': token },
    data
  })
}
