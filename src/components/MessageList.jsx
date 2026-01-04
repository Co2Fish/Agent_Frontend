import React, { useEffect, useRef } from 'react'
import '../css/MessageList.css'

function MessageList({ messages, onFileDownload }) {
  const messagesEndRef = useRef(null)

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`message ${message.sender}`}
        >
          <div className="message-content">
            <div className="message-text">{message.content}</div>
            
            {message.files && message.files.length > 0 && (
              <div className="message-files">
                {message.files.map((file) => (
                  <div key={file.id} className="message-file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file.name}</span>
                    <button 
                      className="download-button"
                      onClick={() => onFileDownload(file)}
                    >
                      下载
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="message-time">{formatTime(message.timestamp)}</div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList