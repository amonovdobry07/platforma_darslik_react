import axios from './axios'

export const notificationsAPI = {
  // Barcha bildirishnomalar
  getAll: async () => {
    const response = await axios.get('/notifications/')
    return response.data
  },

  // O'qilmagan soni
  getUnreadCount: async () => {
    const response = await axios.get('/notifications/unread-count/')
    return response.data
  },

  // Bittani o'qilgan deb belgilash
  markAsRead: async (id) => {
    const response = await axios.post(`/notifications/${id}/mark-read/`)
    return response.data
  },

  // Hammasini o'qilgan deb belgilash
  markAllAsRead: async () => {
    const response = await axios.post('/notifications/mark-all-read/')
    return response.data
  },

  // Hammasini o'chirish
  clearAll: async () => {
    const response = await axios.delete('/notifications/clear-all/')
    return response.data
  },
}