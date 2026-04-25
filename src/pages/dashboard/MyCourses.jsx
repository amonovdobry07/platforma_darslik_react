import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Play,
  Loader2,
  Search
} from 'lucide-react'
import { enrollmentsAPI } from '../../api/enrollments'
import './MyCourses.css'

function MyCourses() {
  const [enrollments, setEnrollments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, completed
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadEnrollments()
  }, [])

  const loadEnrollments = async () => {
    try {
      const data = await enrollmentsAPI.getMyCourses()
      setEnrollments(data.results || data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter qilish
  const filteredEnrollments = enrollments.filter(e => {
    // Search
    if (search && !e.course?.title.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    // Filter
    if (filter === 'active') return !e.is_completed
    if (filter === 'completed') return e.is_completed
    return true
  })

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
            Mening <span className="gradient-text">kurslarim</span>
          </h1>
          <p>Barcha sotib olingan kurslaringiz</p>
        </div>

        <div className="mc-stats">
          <div className="mc-stat-item">
            <strong>{enrollments.length}</strong>
            <span>Jami</span>
          </div>
          <div className="mc-stat-item">
            <strong>{enrollments.filter(e => e.is_completed).length}</strong>
            <span>Tugallangan</span>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="mc-toolbar">
        <div className="mc-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Kurs nomini qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mc-filters">
          <button 
            className={`mc-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Barchasi ({enrollments.length})
          </button>
          <button 
            className={`mc-filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Faol ({enrollments.filter(e => !e.is_completed).length})
          </button>
          <button 
            className={`mc-filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Tugallangan ({enrollments.filter(e => e.is_completed).length})
          </button>
        </div>
      </div>

      {/* Courses */}
      {filteredEnrollments.length === 0 ? (
        <div className="mc-empty">
          <BookOpen size={64} />
          <h3>
            {enrollments.length === 0 
              ? "Hali kurs sotib olmadingiz" 
              : "Hech narsa topilmadi"}
          </h3>
          <p>
            {enrollments.length === 0 
              ? "Kurslarni ko'rib chiqing va o'zingizga mos kelganini tanlang" 
              : "Boshqa so'z bilan qidirib ko'ring"}
          </p>
          {enrollments.length === 0 && (
            <Link to="/courses" className="btn btn-primary">
              Kurslarni ko'rish
            </Link>
          )}
        </div>
      ) : (
        <div className="mc-grid">
          {filteredEnrollments.map((enrollment, i) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="mc-card"
            >
              <Link to={`/courses/${enrollment.course?.id}`} className="mc-card-link">
                <div className="mc-thumbnail">
                  {enrollment.course?.thumbnail ? (
                    <img src={enrollment.course.thumbnail} alt={enrollment.course.title} />
                  ) : (
                    <div className="mc-thumb-placeholder">
                      <BookOpen size={32} />
                    </div>
                  )}
                  {enrollment.is_completed && (
                    <div className="mc-badge-completed">
                      <CheckCircle2 size={14} />
                      Tugallangan
                    </div>
                  )}
                </div>

                <div className="mc-card-body">
                  <h3>{enrollment.course?.title}</h3>
                  <p className="mc-instructor">
                    {enrollment.course?.instructor?.username}
                  </p>

                  {/* Progress */}
                  <div className="mc-progress-wrapper">
                    <div className="mc-progress-header">
                      <span>Progress</span>
                      <strong>{enrollment.progress || 0}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="btn btn-primary mc-continue">
                    <Play size={16} />
                    {enrollment.progress > 0 ? 'Davom ettirish' : 'Boshlash'}
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCourses