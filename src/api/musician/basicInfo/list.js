/*
 * @Descripttion: 音乐人基本信息列表接口
 * @version:
 * @Author: jwj
 * @Date: 2021-01-07 18:29:47
 * @LastEditors: jwj
 * @LastEditTime: 2021-01-07 18:38:14
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/sys/user/getMusicianList',
    method: 'post',
    data: data
  })
}
// 新增保存
// export function saveAdd(data) {
//   return request({
//     url: '/optional/base/addOptionalBase',
//     method: 'post',
//     data: data
//   })
// }
