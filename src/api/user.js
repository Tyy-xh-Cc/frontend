import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 登录
export const login = (data) => {
  return request.post('/user/login', data)
}

// 注册
export const register = (data) => {
  return request.post('/user/register', data)
}

// 获取用户信息
export const getUserInfo = (userId) => {
  return request.get('/user/info', { params: { userId } })
}