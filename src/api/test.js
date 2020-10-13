import request from '@/utils/requestTest'

// 登录
export function test(url, token, method, json) {
  let data = null
  let params = null
  if (method === 'post') {
    data = json
  }
  if (method === 'get') {
    params = json
  }
  return request({
    token: token,
    url: url,
    method: method,
    data,
    params
  })
}
