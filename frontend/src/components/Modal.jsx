import React from 'react';

export default function Modal({
  isOpen,
  title,
  message,
  type = 'info', // info, success, error, confirm
  onClose,
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'confirm': return '?';
      default: return 'i';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">{getIcon()}</div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-msg">{message}</p>
        
        <div className="modal-actions">
          {type === 'confirm' && (
            <button className="secondary-btn" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm || onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
