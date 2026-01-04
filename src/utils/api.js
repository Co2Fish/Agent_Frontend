// API工具函数
import axios from 'axios'

// 基础URL常量
const BASE_URL = 'http://localhost:3001/api'

// 创建axios实例，配置基础通信参数
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json'
  }
})

// 没写拦截器，有需要再说

// 发送消息并上传文件的异步函数
// 参数分别代表：用户输入的文本内容、用户上传的文件列表、当前处于何种场景
export const sendMessageWithFiles = async (content, files, scene) => {
  try {
    //FormData对象用于构建键值对的表单数据，特别适用于文件上传
    const formData = new FormData()
    
    // 添加消息内容
    formData.append('content', content)
    formData.append('scene', scene)
    
    // 添加文件
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
    }
    
    // 发送请求和接收响应，post方法的参数分别是：URL路径、表单数据对象、配置对象
    const response = await api.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('API请求失败:', error)
    throw error
  }
}

// 下载后端发送来的文件异步函数
export const downloadFile = async (fileId) => {
  try {
    const response = await api.get(`/files/${fileId}`, {
      responseType: 'blob',
      headers: {
        'Accept': '*/*'
      }
    })
  
    const blob = response.data
    const url = window.URL.createObjectURL(blob)
    
    // 创建下载链接
    const a = document.createElement('a')
    a.href = url
    a.download = fileId
    document.body.appendChild(a)
    a.click()
    
    // 清理
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载文件失败:', error)
    throw error
  }
}