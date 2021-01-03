/*
 * @Descripttion: banner配置接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:30:42
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-31 17:03:11
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/banner/query',
    method: 'post',
    data: data
  })
}
// 新增、修改banner配置
export function saveEditAndAdd(data) {
  return request({
    url: '/sys/banner/addUpdate',
    method: 'post',
    data: data
  })
}
// 删除banner配置
export function saveDelete(data) {
  return request({
    url: '/sys/banner/delete',
    method: 'post',
    data: data
  })
}
