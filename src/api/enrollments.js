import axiosInstance from './axios'

export const enrollmentsAPI = {
  getMyCourses: async () => {
    const response = await axiosInstance.get('/enrollments/')
    return response.data
  },

  enroll: async (courseId) => {
    const response = await axiosInstance.post('/enrollments/', {
      course_id: courseId
    })
    return response.data
  },

  unenroll: async (enrollmentId) => {
    const response = await axiosInstance.delete(`/enrollments/${enrollmentId}/`)
    return response.data
  },
}