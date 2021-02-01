/*
 * @Date: 2020-09-10 17:16:46
 * @Description:
 * @LastEditors: JWJ
 * @LastEditTime: 2021-02-01 14:01:54
 * @FilePath: \vue-music-admin\src\api\user.js
 */
import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取路由数据
export function getRouterList() {
  return request({
    url: '/sys/managemenu/getMenuRoute',
    method: 'POST'
  })
}

export function getInfo(data) {
  return request({
    url: '/sys/user/getUserDetailInfo',
    method: 'post',
    data: data
  })
}

// 登出
export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}
