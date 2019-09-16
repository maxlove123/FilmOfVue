import axios from 'axios'
// import NProgress from 'muse-ui-progress'
import Toast from 'muse-ui-toast'
const instance = axios.create({
  baseURL: '/', // /api
  timeout: 20000,
  method: 'get',
  responseType: 'json', // default=json
  withCredentials: true, // 是否允许带cookie这些
  validateStatus: (status) => {
    return status >= 200 && status < 300 // default status >= 200 && status < 300
  }
})
// const Loading = ''
// 拦截请求
instance.interceptors.request.use(config => {
  // config.url = config.url[config.AXIOSTYPE]
  // NProgress.start()
  return config
}, error => {
  // NProgress.done()
  return Promise.reject(error)
})

// 拦截响应
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data && response.data.is_error === 'true') {
        // NProgress.done()
        let errMsg = response.data.msg || 'The request failed.'
        Toast.error(errMsg)
        return Promise.reject(response.data)
      } else {
        // NProgress.done()
        return Promise.resolve(response.data)
      }
    } else {
      // TODO 其他状态处理
      // NProgress.done()
      let errMsg = 'networkError'
      Toast.error(errMsg)
      return Promise.resolve(errMsg)
    }
  },
  error => {
    // NProgress.done()
    let errMsg = error.message
    Toast.error(errMsg)
    return Promise.resolve(error)
  }
)

export default instance
