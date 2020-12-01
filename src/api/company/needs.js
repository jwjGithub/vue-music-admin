/*
 * @Descripttion:公司需求管理
 * @version:
 * @Author: jwj
 * @Date: 2020-12-01 14:46:57
 * @LastEditors: JWJ
 * @LastEditTime: 2020-12-01 21:29:47
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/company/needs/queryOptionAndMusicPage',
    method: 'post',
    data: data
  })
}
// 获取公司list
export function getCompanyList(data) {
  return request({
    url: '/sys/companymenu/getNormalCompany',
    method: 'post',
    data: data
  })
}
// 获取需求库作品list
export function getMusicPageInOptional(data) {
  return request({
    url: '/optional/base/getMusicPageInOptional',
    method: 'post',
    data: data
  })
}
// // 新增
// export function saveAdd(data) {
//   return request({
//     url: '/sys/companymenu/addCompanyMenu',
//     method: 'post',
//     data: data
//   })
// }
// 编辑
// export function saveEdit(data) {
//   return request({
//     url: '/sys/companymenu/updateCompanyMenu',
//     method: 'post',
//     data: data
//   })
// }
// 删除需求库
// export function deleteManageMenu(menuIds) {
//   return request({
//     url: `/sys/companymenu/deleteCompanyMenu/${menuIds}`,
//     method: 'post'
//   })
// }
// 删除需求库下的作品
export function deleteWorks(data) {
  return request({
    url: '/company/needs/delWorksInOptional',
    method: 'post',
    data: data
  })
}
// 更新需求状态
export function updateOption(data) {
  return request({
    url: '/company/needs/updateOption',
    method: 'post',
    data: data
  })
}

// 停用后台菜单
// export function stopManageMenu(menuIds) {
//   return request({
//     url: `/sys/companymenu/stopCompanyMenu/${menuIds}`,
//     method: 'post'
//   })
// }
// 启用后台菜单
// export function normalManageMenu(menuIds) {
//   return request({
//     url: `/sys/companymenu/normalCompanyMenu/${menuIds}`,
//     method: 'post'
//   })
// }
