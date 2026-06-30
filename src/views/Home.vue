<template>
  <div class="home-container">
    <div class="header">
      <h1>欢迎回来</h1>
      <el-button type="danger" @click="handleLogout">退出登录</el-button>
    </div>
    
    <div class="content">
      <el-card class="info-card" v-if="userStore.userInfo">
        <h3>用户信息</h3>
        <p><strong>用户名：</strong>{{ userStore.userInfo.username }}</p>
        <p><strong>邮箱：</strong>{{ userStore.userInfo.email || '未设置' }}</p>
        <p><strong>手机号：</strong>{{ userStore.userInfo.phone || '未设置' }}</p>
        <p><strong>注册时间：</strong>{{ userStore.userInfo.createTime }}</p>
      </el-card>
      
      <el-card class="info-card" v-else>
        <p>加载中...</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 🔥 解析 JWT token 获取 userId
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    // JWT 由三部分组成：header.payload.signature
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    const payload = JSON.parse(jsonPayload)
    console.log('Token 解析结果:', payload)
    return payload.userId  // 🔥 获取 userId
  } catch (error) {
    console.error('Token 解析失败:', error)
    return null
  }
}

onMounted(() => {
  // 🔥 从 token 中解析 userId
  const userId = getUserIdFromToken()
  
  if (userId) {
    console.log('获取到 userId:', userId)
    userStore.fetchUserInfo(userId)
  } else {
    console.error('未获取到 userId，请重新登录')
    ElMessage.error('登录信息已过期，请重新登录')
    router.push('/login')
  }
})

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.content {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.info-card {
  padding: 20px;
}

.info-card p {
  margin: 15px 0;
  color: #666;
}
</style>