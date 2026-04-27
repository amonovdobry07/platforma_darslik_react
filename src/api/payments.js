import axios from './axios'

export const paymentsAPI = {
  // To'lov boshlash
  initiate: async (courseId, paymentMethod = 'demo') => {
    const response = await axios.post('/payments/initiate/', {
      course_id: courseId,
      payment_method: paymentMethod
    })
    return response.data
  },

  // To'lovni tasdiqlash (demo rejim)
  confirm: async (paymentId) => {
    const response = await axios.post(`/payments/${paymentId}/confirm/`)
    return response.data
  },

  // To'lovni bekor qilish
  cancel: async (paymentId) => {
    const response = await axios.post(`/payments/${paymentId}/cancel/`)
    return response.data
  },

  // To'lov tarixi
  getMyHistory: async () => {
    const response = await axios.get('/payments/my-history/')
    return response.data
  },

  // Bitta to'lovni olish
  getOne: async (paymentId) => {
    const response = await axios.get(`/payments/${paymentId}/`)
    return response.data
  },
}