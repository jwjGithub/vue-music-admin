import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/user/getAdminList',
    method: 'post',
    data: data
  })
}
// 新增
export function saveAdd(data) {
  return request({
    url: '/sys/user/addAdminUser',
    method: 'post',
    data: data
  })
}
// 编辑
export function saveEdit(data) {
  return request({
    url: '/sys/user/updateAdmin',
    method: 'post',
    data: data
  })
}
