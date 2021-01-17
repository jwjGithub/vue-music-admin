/*
 * @Descripttion:音乐人作品详情接口
 * @Author: jwj
 * @Date: 2021-01-17 19:51:25
 */
import request from '@/utils/request'

// 分页查询
export function getList(data) {
  return request({
    url: '/work/getMusicianWorkPage',
    method: 'post',
    data: data
  })
}
// 下架删除
export function updateWork(data) {
  return request({
    url: '/work/updateWork',
    method: 'post',
    data: data
  })
}
