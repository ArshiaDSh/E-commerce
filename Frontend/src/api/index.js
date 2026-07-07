
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')
                const response = await axios.post(`${API_URL}auth/refresh/`, {
                    refresh: refreshToken
                })

                localStorage.setItem('access_token', response.data.access)
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`
                return api(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

// ========== PRODUCTS ==========
export const getProducts = (params) => api.get('/products/', { params })
export const getProduct = (id) => api.get(`/products/${id}/`)

// ========== CART ==========
export const getCart = (cartId) => api.get(`/carts/${cartId}/`)
export const createCart = () => api.post('/carts/')
export const addCartItem = (cartId, data) => api.post(`/carts/${cartId}/items/`, data)
export const updateCartItem = (cartId, itemId, data) =>
    api.patch(`/carts/${cartId}/items/${itemId}/`, data)
export const deleteCartItem = (cartId, itemId) =>
    api.delete(`/carts/${cartId}/items/${itemId}/`)

// ========== CATEGORY ==========
export const getCategory = (id) => api.get(`/categories/${id}/`)

// ========== ORDERS ==========
export const getOrders = () => api.get('/orders/')
export const getOrder = (id) => api.get(`/orders/${id}/`)  // ✅ Add this
export const createOrder = (cartId) => api.post('/orders/', { cart_id: cartId })
export const confirmOrder = (orderId, cartId) => 
  api.post(`/orders/${orderId}/confirm/`, { cart_id: cartId })

// ========== AUTH ==========
export const login = (credentials) => api.post('/auth/login/', credentials)
export const register = (userData) => api.post('/auth/register/', userData)
export const refreshToken = (refresh) => api.post('/auth/refresh/', { refresh })


export default api