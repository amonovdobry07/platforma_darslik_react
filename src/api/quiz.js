import axios from './axios'

export const quizAPI = {
  // ============ STUDENT API ============
  
  // Dars uchun testni olish (student)
  getByLesson: async (lessonId) => {
    const response = await axios.get(`/quizzes/by-lesson/${lessonId}/`)
    return response.data
  },

  // Test javoblarini yuborish
  submit: async (quizId, answers) => {
    const response = await axios.post(`/quizzes/${quizId}/submit/`, {
      answers: answers
    })
    return response.data
  },

  // Mening urinishlarim
  getMyAttempts: async () => {
    const response = await axios.get('/quiz-attempts/')
    return response.data
  },

  // ============ INSTRUCTOR API ============

  // Test yaratish
  create: async (data) => {
    const response = await axios.post('/quizzes/', data)
    return response.data
  },

  // Bitta testni olish
  getOne: async (quizId) => {
    const response = await axios.get(`/quizzes/${quizId}/`)
    return response.data
  },

  // Test tahrirlash
  update: async (quizId, data) => {
    const response = await axios.put(`/quizzes/${quizId}/`, data)
    return response.data
  },

  // Test o'chirish
  delete: async (quizId) => {
    const response = await axios.delete(`/quizzes/${quizId}/`)
    return response.data
  },

  // Savol qo'shish
  addQuestion: async (quizId, questionData) => {
    const response = await axios.post(`/questions/`, {
      quiz: quizId,
      ...questionData
    })
    return response.data
  },

  // Savol tahrirlash
  updateQuestion: async (questionId, data) => {
    const response = await axios.put(`/questions/${questionId}/`, data)
    return response.data
  },

  // Savol o'chirish
  deleteQuestion: async (questionId) => {
    const response = await axios.delete(`/questions/${questionId}/`)
    return response.data
  },

  // Javob qo'shish
  addAnswer: async (questionId, answerData) => {
    const response = await axios.post(`/answers/`, {
      question: questionId,
      ...answerData
    })
    return response.data
  },

  // Javob tahrirlash
  updateAnswer: async (answerId, data) => {
    const response = await axios.put(`/answers/${answerId}/`, data)
    return response.data
  },

  // Javob o'chirish
  deleteAnswer: async (answerId) => {
    const response = await axios.delete(`/answers/${answerId}/`)
    return response.data
  },
}