import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add request interceptor to include auth token
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

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  register: (userData) => {
    const formData = new FormData()
    formData.append('name', userData.name)
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    formData.append('confirmPassword', userData.confirmPassword)
    if (userData.avatar) {
      formData.append('avatar', userData.avatar)
    }
    return api.post('/user/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getProfile: () => api.get('/user/profile'),
}

// Books API calls
export const booksAPI = {
  getAllBooks: () => api.get('/books'),
  getMyBooks: () => api.get('/books/my-books'),
  getBookById: (id) => api.get(`/books/${id}`),
  addBook: (bookData) => {
    const formData = new FormData()
    formData.append('title', bookData.title)
    formData.append('author', bookData.author)
    formData.append('condition', bookData.condition)
    if (bookData.image) {
      formData.append('image', bookData.image)
    }
    return api.post('/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
  requestBook: (bookId) => api.post(`/books/${bookId}/request`),
  getMyRequests: () => api.get('/books/my-requests'),
  getReceivedRequests: () => api.get('/books/requests-received'),
  handleRequest: (requestId, action) => api.put(`/books/requests/${requestId}/${action}`),
  cancelRequest: (requestId) => api.delete(`/books/requests/${requestId}`),
}

export default api