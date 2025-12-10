import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding loading states or auth tokens
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.request);
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Reservation API endpoints
export const reservationAPI = {
  getAllReservations: () => api.get('/reservations'),
  getReservationById: (id) => api.get(`/reservations/${id}`),
  getReservationsByDate: (date) => api.get(`/reservations/date/${date}`),
  createReservation: (data) => api.post('/reservations', data),
  updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
  deleteReservation: (id) => api.delete(`/reservations/${id}`),
};

// Table API endpoints
export const tableAPI = {
  getAllTables: () => api.get('/tables'),
  getAvailableTables: () => api.get('/tables/available'),
  createTable: (data) => api.post('/tables', data),
  updateTableAvailability: (id, data) => api.put(`/tables/${id}/availability`, data),
};

export default api;