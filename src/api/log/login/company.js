import request from '@/utils/request'

// 公司人员登录日志分页查询
export function getDataList(data) {
  return request({
    url: '/company/loginlogCompany',
    method: 'post',
    data: data
  })
}
