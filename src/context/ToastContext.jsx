import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, isExiting: false };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        // Trigger exit animation
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
        );
        setTimeout(() => {
          removeToast(id);
        }, 300);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]);
  const error = useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]);
  const info = useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, removeToast }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: '400px',
          width: 'calc(100% - 2.5rem)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          const bgColor = isError ? '#FEF2F2' : isSuccess ? '#F0FDF4' : '#F0F9FF';
          const borderColor = isError ? '#FECACA' : isSuccess ? '#BBF7D0' : '#BAE6FD';
          const textColor = isError ? '#991B1B' : isSuccess ? '#166534' : '#075985';
          const Icon = isError ? AlertCircle : isSuccess ? CheckCircle2 : Info;
          const iconColor = isError ? '#DC2626' : isSuccess ? '#16A34A' : '#0284C7';

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: 'var(--radius-md, 8px)',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                color: textColor,
                fontSize: '0.88rem',
                fontWeight: 500,
                lineHeight: 1.4,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: toast.isExiting ? 0 : 1,
                transform: toast.isExiting ? 'translateX(20px) scale(0.95)' : 'translateX(0) scale(1)',
                animation: toast.isExiting ? 'none' : 'toastEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Icon size={18} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1, wordBreak: 'break-word' }}>{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: textColor,
                  opacity: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '0.25rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastEnter {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
