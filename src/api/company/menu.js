/*
 * @Date: 2020-11-06 16:03:27
 * @Description: 公司菜单管理
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-06 16:08:26
 * @FilePath: \vue-music-admin\src\api\company\menu.js
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/companymenu/getMenuList',
    method: 'post',
    data: data
  })
}
// 新增
export function saveAdd(data) {
  return request({
    url: '/sys/companymenu/addCompanyMenu',
    method: 'post',
    data: data
  })
}
// 编辑
export function saveEdit(data) {
  return request({
    url: '/sys/companymenu/updateCompanyMenu',
    method: 'post',
    data: data
  })
}
// 获取菜单选择树
export function getManageMenuSelectTree(data) {
  return request({
    url: '/sys/companymenu/getSelectTree',
    method: 'post',
    data: data
  })
}
// 获取单个数据信息
export function getInfoById(id) {
  return request({
    url: `/sys/managemenu/info/${id}`,
    method: 'post'
  })
}
// 删除
export function deleteManageMenu(menuIds) {
  return request({
    url: `/sys/companymenu/deleteCompanyMenu/${menuIds}`,
    method: 'post'
  })
}

// 停用后台菜单
export function stopManageMenu(menuIds) {
  return request({
    url: `/sys/companymenu/stopCompanyMenu/${menuIds}`,
    method: 'post'
  })
}
// 启用后台菜单
export function normalManageMenu(menuIds) {
  return request({
    url: `/sys/companymenu/normalCompanyMenu/${menuIds}`,
    method: 'post'
  })
}
