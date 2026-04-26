import axios from './axios'

export const progressAPI = {
  // Darsni tugatilgan deb belgilash
  completeLesson: async (lessonId) => {
    const response = await axios.post('/progress/complete-lesson/', {
      lesson_id: lessonId
    })
    return response.data
  },

  // Bir kursning barcha progress'lari
  getByCourse: async (courseId) => {
    const response = await axios.get(`/progress/by-course/${courseId}/`)
    return response.data
  },

  // Foydalanuvchining barcha progress'lari
  getAll: async () => {
    const response = await axios.get('/progress/')
    return response.data
  },
}