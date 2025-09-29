import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data)
    if (error.response?.status === 401) {
      console.log('401 error detected, clearing token')
      localStorage.removeItem('token')
      // Dispatch custom event để AuthContext có thể handle
      window.dispatchEvent(new Event('unauthorized'))
    }
    return Promise.reject(error)
  }
)

// Plants API
export const plantsApi = {
  // Lấy tất cả thực vật
  getAll: () => api.get('/plants'),
  
  // Tìm kiếm thực vật
  search: (query) => api.get(`/plants/search?q=${encodeURIComponent(query)}`),
  
  // Tìm kiếm nâng cao
  advancedSearch: (filters) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return api.get(`/plants/advanced?${params.toString()}`)
  },
  
  // Lấy chi tiết thực vật
  getById: (id) => api.get(`/plants/${id}`),
  
  // Tạo thực vật mới (admin)
  create: (plantData) => api.post('/plants', plantData),
  
  // Cập nhật thực vật (admin)
  update: (id, plantData) => api.put(`/plants/${id}`, plantData),
  
  // Xóa thực vật (admin)
  delete: (id) => api.delete(`/plants/${id}`),
  
  // Đánh giá thực vật
  rate: (id, rating) => api.post(`/plants/${id}/rate`, { rating }),
  
  // Bình luận
  comment: (id, comment) => api.post(`/plants/${id}/comment`, { comment }),
  
  // Xóa bình luận
  deleteComment: (plantId, commentId) => api.delete(`/plants/${plantId}/comment/${commentId}`),
}

// Bookmarks API
export const bookmarksApi = {
  // Thêm bookmark
  add: (plantId) => api.post('/bookmarks', { plantId }),
  
  // Xóa bookmark
  remove: (plantId) => api.delete(`/bookmarks/${plantId}`),
  
  // Lấy danh sách bookmarks
  getAll: () => api.get('/bookmarks'),
  
  // Kiểm tra bookmark
  check: (plantId) => api.get(`/bookmarks/check/${plantId}`),
}

// Auth API
export const authApi = {
  // Đăng ký
  register: (userData) => api.post('/auth/register', userData),
  
  // Đăng nhập
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Xác thực token
  verify: () => api.post('/auth/verify'),
}

export default api