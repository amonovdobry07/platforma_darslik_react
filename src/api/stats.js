import axios from './axios'

export const statsAPI = {
  getInstructorStats: async () => {
    const response = await axios.get('/instructor/stats/')
    return response.data
  },
}