import { axios } from '@/utils/request'

/**
 * 工作量统计
 */
 export function part1 (parameter) {
  return axios({
    url: '/follow-api/follow/stat/getFollowNum',
    method: 'get',
    params: parameter
  })
}

/**
 * 我的待办
 */
 export function part2 (parameter) {
  return axios({
    url: '/follow-api/follow/stat/getTaskNum',
    method: 'get',
    params: parameter
  })
}

/**
 * 问卷回收排名
 */
 export function part3 (parameter) {
  return axios({
    url: '/follow-api/follow/stat/getTopQuest',
    method: 'get',
    params: parameter
  })
}

/**
 * 名单随访率排名
 */
 export function part4 (parameter) {
  return axios({
    url: '/follow-api/follow/stat/getTopFollow',
    method: 'get',
    params: parameter
  })
}

/**
 * 文章阅读排名
 */
 export function part5 (parameter) {
  return axios({
    url: '/follow-api/follow/stat/getTopArticle',
    method: 'get',
    params: parameter
  })
}

/**
 * 质控情况、方案制定
 */
 export function part67 (parameter) {
  return axios({
    url: '/follow-api/follow/stat/getCheckAndOtherNum',
    method: 'get',
    params: parameter
  })
}
