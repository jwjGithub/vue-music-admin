import request from '@/utils/request'

// 分页查询
export function getDataList(data) {
  return request({
    url: '/sys/feedback/queryQuestion',
    method: 'post',
    data: data
  })
}
// 问题删除
export function saveDelete(id) {
  return request({
    url: `/sys/feedback/deleteQuestion/${id}`,
    method: 'post'
  })
}
