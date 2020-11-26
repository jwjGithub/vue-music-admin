/*
 * @Descripttion: 说明页接口
 * @version:
 * @Author: jwj
 * @Date: 2020-11-26 11:10:35
 * @LastEditors: jwj
 * @LastEditTime: 2020-11-26 16:35:36
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/introduction/getList',
    method: 'post',
    data: data
  })
}
// 新增
export function saveAdd(data) {
  return request({
    url: '/sys/introduction/addIntroductionInfo',
    method: 'post',
    data: data
  })
}
// 编辑
export function saveEdit(data) {
  return request({
    url: '/sys/introduction/updateIntroductionInfo',
    method: 'post',
    data: data
  })
}
// // 获取单个数据信息
// export function getInfoById(id) {
//   return request({
//     url: `/sys/managemenu/info/${id}`,
//     method: 'post'
//   })
// }
// 删除 type:1 单个 type:2 批量
export function deleteManageMenu(ids) {
  return request({
    url: `/sys/introduction/deleteIntroductionInfo/${ids}`,
    method: 'post'
  })
}

// 停用说明页
export function stopManageMenu(ids) {
  return request({
    url: `/sys/introduction/disableIntroductionInfo/${ids}`,
    method: 'post'
  })
}
// // 批量停用后台菜单
// export function stopBatchManageMenu(data) {
//   return request({
//     url: '/sys/managemenu/stopBatchManageMenu',
//     method: 'post',
//     data: data
//   })
// }
// 启用后台菜单
export function normalManageMenu(ids) {
  return request({
    url: `/sys/introduction/enableIntroductionInfo/${ids}`,
    method: 'post'
  })
}
// // 批量启用后台菜单
// export function normalBatchManageMenu(data) {
//   return request({
//     url: '/sys/managemenu/normalBatchManageMenu',
//     method: 'post',
//     data: data
//   })
// }
// 根据id查询说明页详情
export function explainInfo(ids) {
  return request({
    url: `/sys/introduction/getIntroductionInfo/${ids}`,
    method: 'post'
  })
}
