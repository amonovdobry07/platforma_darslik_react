import axiosInstance from './axios'

export const authAPI = {
  // Ro'yxatdan o'tish
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register/', data)
    return response.data
  },

  // Kirish
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login/', credentials)
    return response.data
  },

  // O'z ma'lumotlarim
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me/')
    return response.data
  },

  // Token yangilash
  refreshToken: async (refresh) => {
    const response = await axiosInstance.post('/auth/refresh/', { refresh })
    return response.data
  },

  // Profilni yangilash
  updateProfile: async (data) => {
    const response = await axiosInstance.patch('/auth/update/', data)
    return response.data
  },

  // Parolni o'zgartirish
  changePassword: async (data) => {
    const response = await axiosInstance.post('/auth/change-password/', data)
    return response.data
  },
}