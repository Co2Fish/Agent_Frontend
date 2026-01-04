import React, { useState, useRef, useEffect } from 'react'
import '../css/InputArea.css'

function InputArea({ onSendMessage }) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  // 处理文本输入变化
  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  // 处理文件选择
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map(file => ({
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      url: window.URL.createObjectURL(file)
    }))
    setFiles(prev => [...prev, ...selectedFiles])
  }

  // 移除文件
  const removeFile = (index) => {
    setFiles(prev => {
      // 清理要移除的文件的临时URL
      if (prev[index]?.url) {
        window.URL.revokeObjectURL(prev[index].url)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  // 打开文件选择对话框
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  // 文件下载函数，让用户点击文件名时下载文件
  const handleFileDownload = (fileInfo) => {
    try {
      if (fileInfo.url) {
        const a = document.createElement('a')
        a.href = fileInfo.url
        a.download = fileInfo.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('下载文件失败:', error)
    }
  }

  // 发送消息
  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      // 只传递原始文件对象给父组件
      const originalFiles = files.map(fileInfo => fileInfo.file)
      onSendMessage(message.trim(), originalFiles)
      setMessage('')
      setFiles([])
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 处理回车键发送消息
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 组件卸载时清理所有临时URL
  useEffect(() => {
    return () => {
      files.forEach(fileInfo => {
        if (fileInfo?.url) {
          window.URL.revokeObjectURL(fileInfo.url)
        }
      })
    }
  }, [files])

  return (
    <div className="input-area">
      {/* 已选择文件列表 */}
      {files.length > 0 && (
        <div className="selected-files">
          {files.map((fileInfo, index) => (
            <div key={index} className="selected-file-item">
              <span className="file-icon">📄</span>
              <span 
                className="file-name" 
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => handleFileDownload(fileInfo)}
              >
                {fileInfo.name}
              </span>
              <button 
                className="remove-file-button"
                onClick={() => removeFile(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="input-container">
        {/* 文件上传按钮 */}
        <button 
          className="upload-button"
          onClick={handleUploadClick}
          title="上传文件"
        >
          上传附件
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          style={{ display: 'none' }}
        />
        
        {/* 消息输入框 */}
        <textarea
          className="message-input"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="请输入消息..."
          rows={1}
        />
        
        {/* 发送按钮 */}
        <button 
          className="send-button"
          onClick={handleSend}
          disabled={!message.trim() && files.length === 0}
        >
          发送
        </button>
      </div>
    </div>
  )
}

export default InputArea