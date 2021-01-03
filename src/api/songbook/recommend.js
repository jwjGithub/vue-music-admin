/*
 * @Descripttion: 精品推荐
 * @version:
 * @Author: jwj
 * @Date: 2020-12-31 17:37:18
 * @LastEditors: jwj
 * @LastEditTime: 2021-01-03 19:41:20
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/company/fineworkRecommend/queryApplyPage',
    method: 'post',
    data: data
  })
}
// 审核精品
export function saveExamine(data) {
  return request({
    url: '/company/fineworkRecommend/update',
    method: 'post',
    data: data
  })
}
