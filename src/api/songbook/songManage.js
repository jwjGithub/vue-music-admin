/*
 * @Descripttion: 歌曲管理接口
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:30:42
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-26 16:57:48
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/work/getWorksPage',
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
