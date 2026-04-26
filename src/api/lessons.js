import axios from './axios'

export const lessonsAPI = {
  getByCourse: async (courseId) => {
    const response = await axios.get(`/courses/${courseId}/lessons/`)
    return response.data
  },

  getOne: async (courseId, lessonId) => {
    const response = await axios.get(`/courses/${courseId}/lessons/${lessonId}/`)
    return response.data
  },

  create: async (courseId, data) => {
    const response = await axios.post(`/courses/${courseId}/lessons/`, data)
    return response.data
  },

  update: async (courseId, lessonId, data) => {
    const response = await axios.put(`/courses/${courseId}/lessons/${lessonId}/`, data)
    return response.data
  },

  delete: async (courseId, lessonId) => {
    const response = await axios.delete(`/courses/${courseId}/lessons/${lessonId}/`)
    return response.data
  },
}