import request from '@/utils/request'

// 分页查询
export function getSysMessageListPage(data) {
  return request({
    url: 'message/sysmessage/getSysMessageListPage',
    method: 'post',
    data: data
  })
}

// 新增通知公告
export function addSysMessage(data) {
  return request({
    url: 'message/sysmessage/addSysMessage',
    method: 'post',
    data: data
  })
}

// 用户查询接口
export function getQueryUserPageList(data) {
  return request({
    url: 'sys/user/queryUserPageList',
    method: 'post',
    data: data
  })
}
