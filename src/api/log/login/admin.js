import request from '@/utils/request'

// 管理员登录日志分页查询
export function getDataList(data) {
  return request({
    url: '/sys/loginlogAdmin',
    method: 'post',
    data: data
  })
}
