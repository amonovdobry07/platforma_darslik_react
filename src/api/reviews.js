import axiosInstance from './axios'

export const reviewsAPI = {
  getByCourse: async (courseId) => {
    const response = await axiosInstance.get(`/courses/${courseId}/reviews/`)
    return response.data
  },

  create: async (courseId, data) => {
    const response = await axiosInstance.post(`/courses/${courseId}/reviews/`, data)
    return response.data
  },

  update: async (courseId, reviewId, data) => {
    const response = await axiosInstance.patch(`/courses/${courseId}/reviews/${reviewId}/`, data)
    return response.data
  },

  delete: async (courseId, reviewId) => {
    const response = await axiosInstance.delete(`/courses/${courseId}/reviews/${reviewId}/`)
    return response.data
  },
}