/*
 * @Descripttion: banner配置接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:30:42
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-30 20:57:12
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
// 修改作品状态
export function saveDelete(data) {
  return request({
    url: '/work/updateWork',
    method: 'post',
    data: data
  })
}
