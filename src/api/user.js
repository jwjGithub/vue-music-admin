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
    url: '/sys/managemenu/getMenuTree',
    method: 'POST'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
