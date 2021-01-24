import request from '@/utils/request'

// 分页查询
export function getMessageTemplateList(data) {
  return request({
    url: 'message/template/getMessageTemplateList',
    method: 'post',
    data: data
  })
}

// 获取业务类型
export function getBusinessTypeList(data) {
  return request({
    url: '/message/sysmessage/getBusinessTypeList',
    method: 'post',
    data: data
  })
}

// 新增
export function addMessageTemplate(data) {
  return request({
    url: '/message/template/addMessageTemplate',
    method: 'post',
    data: data
  })
}
// 编辑
export function updateMessageTemplate(data) {
  return request({
    url: '/message/template/updateMessageTemplate',
    method: 'post',
    data: data
  })
}
// 获取单个数据信息
export function getInfoById(id) {
  return request({
    url: `/message/template/getMessageTemplate/${id}`,
    method: 'post'
  })
}
// 删除模版
export function deleteMsgTemplate(data) {
  return request({
    url: '/message/template/deleteMessageTemplateBatch',
    method: 'post',
    data: data
  })
}

// 获取模版操作列表
export function getMsgTemplateOptionList(optionId) {
  return request({
    url: `/message/templateoption/getMessageTemplateOptionList/${optionId}`,
    method: 'post'
  })
}
// 添加模版操作
export function addTemplateOption(data) {
  return request({
    url: '/message/templateoption/addMessageTemplateOption',
    method: 'post',
    data: data
  })
}
// 修改模版操作
export function updateTemplateOption(data) {
  return request({
    url: '/message/templateoption/updateMessageTemplateOption',
    method: 'post',
    data: data
  })
}
// 删除模版操作
export function deleteMsgTemplateOption(data) {
  return request({
    url: '/message/templateoption/deleteMessageTemplateOptionByBatch',
    method: 'post',
    data: data
  })
}
