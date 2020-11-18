/*
 * @Date: 2020-11-18 16:17:32
 * @Description: 公共接口
 * @LastEditors: JWJ
 * @LastEditTime: 2020-11-18 16:17:59
 * @FilePath: \vue-music-admin\src\api\common.js
 */
import request from '@/utils/request'

// 上传图片
export function uploadImg(data) {
  return request({
    url: '/company/signup/uploadImg',
    method: 'post',
    data: data
  })
}
