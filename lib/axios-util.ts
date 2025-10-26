import axios from 'axios'
import { getAuthToken, removeAuthToken } from './auth-utils'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to automatically add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration and errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage and redirect to login
      removeAuthToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// API utility functions
export const api = {
  // GET request
  get: (url: string, config?: any) => apiClient.get(url, config),
  
  // POST request
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  
  // PUT request
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  
  // DELETE request
  delete: (url: string, config?: any) => apiClient.delete(url, config),
  
  // PATCH request
  patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
}

// Specific API methods for common operations
export const authAPI = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  },

  // Register user
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/register', { username, email, password })
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout')
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed' 
      }
    }
  }
}

// Protected API methods (require authentication)
export const protectedAPI = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile')
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch profile' 
      }
    }
  },

  // Update user profile
  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put('/user/profile', data)
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      }
    }
  },

  // Get dashboard data
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('/user/dashboard')
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch dashboard data' 
      }
    }
  },

  // Test protected route
  testProtectedRoute: async () => {
    try {
      const response = await apiClient.get('/auth/test')
      return { success: true, data: response.data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to test protected route' 
      }
    }
  }
}

export default apiClient
