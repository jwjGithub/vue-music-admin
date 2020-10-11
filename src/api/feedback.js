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
// 查询一个问题的回复
export function queryReply(id) {
  return request({
    url: `/sys/feedback/queryReply/${id}`,
    method: 'post'
  })
}
// 回复一个问题
export function addReply(data) {
  return request({
    url: `/sys/feedback/addReply`,
    method: 'post',
    data: data
  })
}
