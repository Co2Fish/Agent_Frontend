import React from 'react'
import '../css/ConfirmDialog.css'

function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-content">
          {message}
        </div>
        <div className="confirm-dialog-actions">
          <button className="confirm-dialog-button confirm-dialog-cancel" onClick={onCancel}>
            取消
          </button>
          <button className="confirm-dialog-button confirm-dialog-confirm" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog