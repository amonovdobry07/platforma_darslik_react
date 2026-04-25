import axiosInstance from './axios'

export const lessonsAPI = {
  getByCourse: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}/lessons/`)
    return response.data
  },

  getOne: async (courseId, lessonId) => {
    const response = await axiosInstance.get(`/courses/${courseId}/lessons/${lessonId}/`)
    return response.data
  },

  create: async (courseId, data) => {
    const response = await axiosInstance.post(`/courses/${courseId}/lessons/`, data)
    return response.data
  },

  update: async (courseId, lessonId, data) => {
    const response = await axiosInstance.patch(`/courses/${courseId}/lessons/${lessonId}/`, data)
    return response.data
  },

  delete: async (courseId, lessonId) => {
    const response = await axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}/`)
    return response.data
  },
}