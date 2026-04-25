import axiosInstance from './axios'

export const coursesAPI = {
  // Barcha kurslar (filter bilan)
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/courses/', { params })
    return response.data
  },

  // Bitta kurs
  getOne: async (id) => {
    const response = await axiosInstance.get(`/courses/${id}/`)
    return response.data
  },

  // Kurs yaratish (instructor)
  create: async (data) => {
    const response = await axiosInstance.post('/courses/', data)
    return response.data
  },

  // Kursni yangilash
  update: async (id, data) => {
    const response = await axiosInstance.patch(`/courses/${id}/`, data)
    return response.data
  },

  // Kursni o'chirish
  delete: async (id) => {
    const response = await axiosInstance.delete(`/courses/${id}/`)
    return response.data
  },
}

export const categoriesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get('/categories/')
    return response.data
  },
}

