import request from '@/utils/request'

// 音乐人登录日志分页查询
export function getDataList(data) {
  return request({
    url: '/musician/loginlogMusician',
    method: 'post',
    data: data
  })
}
