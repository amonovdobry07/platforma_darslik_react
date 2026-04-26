import axios from './axios'

export const certificatesAPI = {
  // Foydalanuvchining barcha sertifikatlari
  getMyCertificates: async () => {
    const response = await axios.get('/certificates/')
    return response.data
  },

  // Kurs uchun sertifikat yaratish/olish
  generateForCourse: async (courseId) => {
    const response = await axios.post(`/certificates/generate/${courseId}/`)
    return response.data
  },

  // Sertifikatni PDF qilib yuklab olish
  download: async (certificateId) => {
    const response = await axios.get(`/certificates/${certificateId}/download/`, {
      responseType: 'blob'
    })
    return response.data
  },
}