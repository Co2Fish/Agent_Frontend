import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MessageList from '../components/MessageList'
import InputArea from '../components/InputArea'
import ConfirmDialog from '../components/ConfirmDialog'
import { sendMessageWithFiles, downloadFile } from '../utils/api'
import './ChatPage.css'

function ChatPage() {
  const { scene } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // 组件挂载时添加AI欢迎消息
  useEffect(() => {
    // 根据不同场景设置不同的欢迎消息
    const welcomeMessages = {
      'project-handover': {
        content: '您好~我是您的项目交接小助手\n请上传相关文档，我会自动帮您生成相关的总结文件~有其它项目相关的问题也可以问我喔OvO',
        sender: 'ai',
        id: Date.now(),
        timestamp: new Date().toISOString()
      }
    }
    
    // 获取当前场景的欢迎消息，如果没有则使用默认消息
    const welcomeMessage = welcomeMessages[scene] || {
      content: '你好，我是AI助手，有什么可以帮助您的吗？',
      sender: 'ai',
      id: Date.now(),
      timestamp: new Date().toISOString()
    }
    
    // 将欢迎消息添加到messages中
    setMessages([welcomeMessage])
  }, [scene])
  
  // 组件卸载时清理临时URL
  useEffect(() => {
    return () => {
      // 遍历所有消息中的文件，释放临时URL
      messages.forEach(message => {
        if (message.files && message.files.length > 0) {
          message.files.forEach(file => {
            if (file.url && file.url.startsWith('blob:')) {
              window.URL.revokeObjectURL(file.url)
            }
          })
        }
      })
    }
  }, [messages])

  // 根据场景ID获取场景名称
  const getSceneName = () => {
    const sceneMap = {
      'project-handover': '项目交接'
    }
    return sceneMap[scene] || '未知场景'
  }

  // 发送消息
  const sendMessage = async (content, files) => {
    // 先添加用户消息到界面
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content,
      files: files ? files.map(file => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        url: window.URL.createObjectURL(file) // 为用户上传的文件生成临时URL
      })) : [],
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 调用后端API发送消息和文件
      const response = await sendMessageWithFiles(content, files, scene)
      
      // 添加AI回复到界面
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        content: response.content || 'AI未返回内容',
        files: response.files || [],
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, aiReply])
    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 添加错误消息
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'system',
        content: '发送消息失败，请重试',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 下载文件
  const handleFileDownload = async (file) => {
    try {
      // 如果文件有临时URL（用户上传的文件），直接使用该URL下载
      if (file.url) {
        const a = document.createElement('a')
        a.href = file.url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        // 否则调用API下载（AI返回的文件）
        await downloadFile(file.id)
      }
    } catch (error) {
      console.error('下载文件失败:', error)
    }
  }

  // 返回主页
  const handleBack = () => {
    setShowConfirmDialog(true)
  }

  // 确认退出
  const handleConfirmExit = () => {
    setShowConfirmDialog(false)
    window.close() // 关闭当前标签页
  }

  // 取消退出
  const handleCancelExit = () => {
    setShowConfirmDialog(false)
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="back-button" onClick={handleBack}>
          ← 退出
        </button>
        <h1>{getSceneName()}</h1>
      </header>
      
      <main className="chat-main">
        <MessageList 
          messages={messages} 
          onFileDownload={handleFileDownload}
        />
        {isLoading && <div className="loading-indicator">AI正在回复...</div>}
      </main>
      
      <footer className="chat-footer">
        <InputArea onSendMessage={sendMessage} />
      </footer>
      
      {/* 确认退出对话框 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        message="如果退出，将关闭此标签页，所有聊天记录及相关的文件都不会保留，是否确认退出？"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  )
}

export default ChatPage