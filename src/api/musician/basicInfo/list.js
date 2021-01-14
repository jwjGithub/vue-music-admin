/*
 * @Descripttion: 音乐人基本信息列表接口
 * @version:
 * @Author: jwj
 * @Date: 2021-01-07 18:29:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-14 22:11:34
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/musician/message/getMusicianList',
    method: 'post',
    data: data
  })
}
// 音乐人详情
export function getMusicianDetail(data) {
  return request({
    url: '/musician/message/getMusicianDetail',
    method: 'post',
    data: data
  })
}
// 工种
export function getProfessionSelect(data) {
  return request({
    url: '/musician/message/getProfessionSelect',
    method: 'post',
    data: data
  })
}
