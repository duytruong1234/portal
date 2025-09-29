import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Kiểm tra token khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }

    // Listen cho unauthorized events từ API interceptor
    const handleUnauthorized = () => {
      console.log('Unauthorized event received, logging out')
      setUser(null)
    }

    window.addEventListener('unauthorized', handleUnauthorized)
    return () => window.removeEventListener('unauthorized', handleUnauthorized)
  }, [])

  const verifyToken = async () => {
    const token = localStorage.getItem('token')
    console.log('Verifying token:', token ? 'exists' : 'not found')
    try {
      const response = await authApi.verify()
      console.log('Verify response:', response.data)
      if (response.data.success) {
        const userData = response.data.user
        console.log('Setting user:', userData)
        setUser(userData)
      }
    } catch (error) {
      console.log('Token verification error:', error.response?.data)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials)
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setUser(user)
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      if (response.data.success) {
        const { token, user } = response.data
        localStorage.setItem('token', token)
        setUser(user)
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isAdmin = () => {
    return user && user.role === 'admin'
  }

  const isAuthenticated = () => {
    const result = !!user
    console.log('isAuthenticated called, user:', user, 'result:', result)
    return result
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext