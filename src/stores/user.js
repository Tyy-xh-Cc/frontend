// src/stores/user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register, getUserInfo } from '../api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // 登录
  const loginAction = async (loginForm) => {
    try {
      const res = await login(loginForm)
      if (res.code === 200) {
        token.value = res.data.token
        localStorage.setItem('token', res.data.token)
        return true
      }
      throw new Error(res.message)
    } catch (error) {
      throw error
    }
  }

  // 注册
  const registerAction = async (registerForm) => {
    try {
      const res = await register(registerForm)
      if (res.code === 200) {
        return true
      }
      throw new Error(res.message)
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  const fetchUserInfo = async (userId) => {
    try {
      const res = await getUserInfo(userId)
      if (res.code === 200) {
        userInfo.value = res.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    loginAction,
    registerAction,
    fetchUserInfo,
    logout
  }
})