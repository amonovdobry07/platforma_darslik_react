import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
  Save,
  X
} from 'lucide-react'
import { coursesAPI, categoriesAPI } from '../../api/courses'
import './CreateCourse.css'

function CreateCourse() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'beginner',
    category_id: '',
    thumbnail: null
  })

  // Kategoriyalarni yuklash
  useEffect(() => {
    categoriesAPI.getAll()
      .then(data => setCategories(data.results || data))
      .catch(err => console.error(err))
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Hajmi 5MB dan oshmasin
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5MB dan oshmasin!")
      return
    }

    // Preview yaratish
    const reader = new FileReader()
    reader.onload = () => setThumbnailPreview(reader.result)
    reader.readAsDataURL(file)

    setFormData({ ...formData, thumbnail: file })
  }

  const removeThumbnail = () => {
    setThumbnailPreview(null)
    setFormData({ ...formData, thumbnail: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.price || !formData.category_id) {
      toast.error("Barcha maydonlarni to'ldiring!")
      return
    }

    setIsLoading(true)
    try {
      // FormData — rasm yuklash uchun
      const data = new FormData()
      data.append('title', formData.title)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('level', formData.level)
      data.append('category_id', formData.category_id)
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail)
      }

      const course = await coursesAPI.create(data)
      toast.success("Kurs muvaffaqiyatli yaratildi! 🎉")
      navigate(`/courses/${course.id}`)
    } catch (error) {
      const errors = error.response?.data
      if (errors) {
        const firstError = Object.values(errors)[0]
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
      } else {
        toast.error("Xatolik yuz berdi")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-course">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          type="button"
          className="cc-back" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <div className="cc-header">
          <h1>
            Yangi <span className="gradient-text">kurs</span> yarating
          </h1>
          <p>O'quvchilaringizga yangi bilim bering</p>
        </div>

        <form onSubmit={handleSubmit} className="cc-form">
          {/* ============ THUMBNAIL ============ */}
          <div className="cc-section">
            <label className="cc-label">Kurs rasmi (thumbnail)</label>
            
            {thumbnailPreview ? (
              <div className="cc-thumbnail-preview">
                <img src={thumbnailPreview} alt="Preview" />
                <button
                  type="button"
                  className="cc-thumbnail-remove"
                  onClick={removeThumbnail}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="cc-thumbnail-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  hidden
                />
                <Upload size={32} />
                <div>
                  <strong>Rasm yuklash</strong>
                  <p>PNG, JPG (max 5MB)</p>
                </div>
              </label>
            )}
          </div>

          {/* ============ TITLE ============ */}
          <div className="cc-section">
            <label className="cc-label" htmlFor="title">
              Kurs nomi *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masalan: Python dasturlash asoslari"
              required
              maxLength={200}
            />
          </div>

          {/* ============ DESCRIPTION ============ */}
          <div className="cc-section">
            <label className="cc-label" htmlFor="description">
              Kurs haqida *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Kursda nima o'rgatiladi, kimlar uchun va nima foyda oladi..."
              rows={6}
              required
            />
          </div>

          {/* ============ GRID: CATEGORY + LEVEL + PRICE ============ */}
          <div className="cc-grid">
            <div className="cc-section">
              <label className="cc-label" htmlFor="category_id">
                Kategoriya *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Tanlang...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="cc-section">
              <label className="cc-label" htmlFor="level">
                Daraja *
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="beginner">Boshlang'ich</option>
                <option value="intermediate">O'rta</option>
                <option value="advanced">Yuqori</option>
              </select>
            </div>

            <div className="cc-section">
              <label className="cc-label" htmlFor="price">
                Narx (so'm) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="299000"
                required
                min="0"
              />
            </div>
          </div>

          {/* ============ SUBMIT ============ */}
          <div className="cc-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="spinner" size={18} /> Saqlanmoqda...</>
              ) : (
                <><Save size={18} /> Kursni yaratish</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateCourse