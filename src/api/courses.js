import axios from './axios'

export const coursesAPI = {
  getAll: async (params = {}) => {
    // Filter va search parametrlari
    const queryParams = new URLSearchParams()
    
    if (params.search) queryParams.append('search', params.search)
    if (params.category && params.category !== 'all') queryParams.append('category', params.category)
    if (params.level && params.level !== 'all') queryParams.append('level', params.level)
    if (params.price_type) queryParams.append('price_type', params.price_type)
    if (params.min_price) queryParams.append('min_price', params.min_price)
    if (params.max_price) queryParams.append('max_price', params.max_price)
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.my_courses) queryParams.append('my_courses', 'true')
    
    const queryString = queryParams.toString()
    const url = queryString ? `/courses/?${queryString}` : '/courses/'
    
    const response = await axios.get(url)
    return response.data
  },

  getOne: async (id) => {
    const response = await axios.get(`/courses/${id}/`)
    return response.data
  },

  create: async (formData) => {
    const response = await axios.post('/courses/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  update: async (id, formData) => {
    const response = await axios.patch(`/courses/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`/courses/${id}/`)
    return response.data
  },

  getCategories: async () => {
    const response = await axios.get('/categories/')
    return response.data
  },
}

// ✨ ESKI KOD UCHUN — categoriesAPI ham eksport qilamiz (CreateCourse.jsx va boshqalar uchun)
export const categoriesAPI = {
  getAll: async () => {
    const response = await axios.get('/categories/')
    return response.data
  },

  getOne: async (id) => {
    const response = await axios.get(`/categories/${id}/`)
    return response.data
  },
}