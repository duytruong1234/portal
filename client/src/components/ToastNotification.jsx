import { createContext, useContext, useState, useCallback } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type, duration }

    setToasts(prev => [...prev, toast])

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const showError = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const showWarning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])
  const showInfo = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

const Toast = ({ toast, onClose }) => {
  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: <FaCheckCircle className="text-white text-lg" />
        }
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: <FaExclamationCircle className="text-white text-lg" />
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          icon: <FaExclamationCircle className="text-white text-lg" />
        }
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          icon: <FaInfoCircle className="text-white text-lg" />
        }
    }
  }

  const { bg, icon } = getToastStyles(toast.type)

  return (
    <div className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm w-full flex items-center space-x-3 animate-slide-in-right`}>
      {icon}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  )
}

export default ToastContext