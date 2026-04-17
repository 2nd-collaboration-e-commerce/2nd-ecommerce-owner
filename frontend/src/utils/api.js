import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const addAddress = (data) => API.put('/auth/address', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getFeaturedProducts = () => API.get('/products/featured');
export const getProduct = (id) => API.get(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/review`, data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);

// Payment
export const createPaymentOrder = (amount) => API.post('/payment/create-order', { amount });
export const verifyPayment = (data) => API.post('/payment/verify', data);

export default API;
