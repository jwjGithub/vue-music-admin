import axios from 'axios'
// import router from '@/router'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '',
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(
  config => {
    console.log(config, 'config---')
    if (getToken()) {
      config.headers['token'] = config.token // 让每个请求携带自定义token 请根据实际情况自行修改
      return config
    } else {
      return config
    }
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
  return res.data
},
error => {
  // console.log(error.response)
  Message({
    message: error.response.status === 404 ? '网络异常 404' : error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
