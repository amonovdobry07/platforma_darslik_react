import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Users,
  Star,
  Loader2,
  ListVideo  // ← YANGI
} from 'lucide-react'
import { coursesAPI } from '../../api/courses'
import useAuthStore from '../../store/authStore'
import './MyCourses.css'

function InstructorCourses() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const data = await coursesAPI.getAll()
      // Faqat shu instructor kurslari
      const myCourses = (data.results || data).filter(
        c => c.instructor?.id === user?.id
      )
      setCourses(myCourses)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    setIsDeleting(true)
    try {
      await coursesAPI.delete(deleteConfirm.id)
      toast.success("Kurs o'chirildi")
      setCourses(courses.filter(c => c.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm"
  }

  if (isLoading) {
    return (
      <div className="mc-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  return (
    <div className="my-courses">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mc-header"
      >
        <div>
          <h1>
            <span className="gradient-text">Kurslarim</span>
          </h1>
          <p>Siz yaratgan barcha kurslar</p>
        </div>

        <Link to="/dashboard/instructor/create" className="btn btn-primary">
          <PlusCircle size={18} />
          Yangi kurs
        </Link>
      </motion.div>

      {/* Courses */}
      {courses.length === 0 ? (
        <div className="mc-empty">
          <BookOpen size={64} />
          <h3>Hali kurs yaratmagansiz</h3>
          <p>Birinchi kursingizni yarating va o'quvchilaringiz bilan baham ko'ring</p>
          <Link to="/dashboard/instructor/create" className="btn btn-primary">
            <PlusCircle size={18} />
            Yangi kurs yaratish
          </Link>
        </div>
      ) : (
        <div className="instructor-courses-list">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="ic-card"
            >
              {/* Thumbnail */}
              <div className="ic-thumbnail">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className="mc-thumb-placeholder">
                    <BookOpen size={32} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="ic-info">
                <div className="ic-category">{course.category?.name}</div>
                <h3>{course.title}</h3>

                <div className="ic-stats">
                  <div className="ic-stat">
                    <Users size={14} />
                    <span>{course.students_count || 0} o'quvchi</span>
                  </div>
                  <div className="ic-stat">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{course.average_rating || 0} ({course.reviews_count || 0})</span>
                  </div>
                  <div className="ic-stat">
                    <BookOpen size={14} />
                    <span>{course.lessons_count || 0} dars</span>
                  </div>
                </div>

                <div className="ic-price">{formatPrice(course.price)}</div>
              </div>

              {/* Actions */}
              <div className="ic-actions">
                <button
                  className="ic-action-btn"
                  title="Darslarni boshqarish"
                  onClick={() => navigate(`/dashboard/instructor/lessons/${course.id}`)}
                >
                  <ListVideo size={18} />
                </button>
                <Link
                  to={`/courses/${course.id}`}
                  className="ic-action-btn"
                  title="Ko'rish"
                >
                  <Eye size={18} />
                </Link>
                <button
                  className="ic-action-btn"
                  title="Tahrirlash"
                  onClick={() => navigate(`/dashboard/instructor/edit/${course.id}`)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="ic-action-btn ic-action-delete"
                  title="O'chirish"
                  onClick={() => setDeleteConfirm(course)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon-danger">
              <Trash2 size={32} />
            </div>
            <h3>Kursni o'chirasizmi?</h3>
            <p>
              <strong>"{deleteConfirm.title}"</strong> kursi va uning barcha darslari,
              o'quvchilari, sharhlari o'chiriladi. Bu amalni qaytarib bo'lmaydi!
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
              >
                Bekor qilish
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <><Loader2 className="spinner" size={18} /> O'chirilmoqda...</>
                ) : (
                  <><Trash2 size={18} /> O'chirish</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default InstructorCourses