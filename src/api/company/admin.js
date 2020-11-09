/*
 * @Date: 2020-11-09 10:18:41
 * @Description: 公司管理员管理
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-09 10:30:58
 * @FilePath: \vue-music-admin\src\api\company\admin.js
 */
import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/companymenu/getNormalCompany',
    method: 'post',
    data: data
  })
}
// 获取公司菜单
export function getCompanyTree(comId) {
  return request({
    url: `/sys/companymenu/getCompanySelectTree/${comId}`,
    method: 'post'
  })
}
// 添加菜单
export function addRelCompanyMenu(data) {
  return request({
    url: '/sys/companymenu/addRelCompanyMenu',
    method: 'post',
    data: data
  })
}
// 删除菜单
export function deleteRelCompanyMenu(data) {
  return request({
    url: '/sys/companymenu/deleteRelCompanyMenu',
    method: 'post',
    data: data
  })
}
