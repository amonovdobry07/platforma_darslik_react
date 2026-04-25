import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Play,
  Loader2,
  Sparkles
} from 'lucide-react'
import { enrollmentsAPI } from '../../api/enrollments'
import useAuthStore from '../../store/authStore'
import './Dashboard.css'

function StudentDashboard() {
  const { user } = useAuthStore()
  const [enrollments, setEnrollments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  // Statistika hisoblash
  const activeCourses = enrollments.filter(e => !e.is_completed).length
  const completedCourses = enrollments.filter(e => e.is_completed).length
  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0

  // Davom ettirish uchun — eng oxirgi yozilgan va tugatilmagan kurs
  const continueLearning = enrollments
    .filter(e => !e.is_completed)
    .sort((a, b) => new Date(b.enrolled_at) - new Date(a.enrolled_at))[0]

  const stats = [
    { icon: BookOpen, value: activeCourses, label: 'Faol kurslar', color: 'emerald' },
    { icon: Award, value: completedCourses, label: 'Tugatilgan', color: 'lime' },
    { icon: TrendingUp, value: `${totalProgress}%`, label: "O'rtacha progress", color: 'emerald' },
    { icon: BookOpen, value: enrollments.length, label: 'Jami kurslar', color: 'lime' },
  ]

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-welcome"
      >
        <div>
          <h1>
            Xush kelibsiz, <span className="gradient-text">{user?.username}</span>! 👋
          </h1>
          <p>
            {enrollments.length > 0 
              ? "Bugun nimani o'rganmoqchisiz?" 
              : "Birinchi kursingizni tanlang va o'rganishni boshlang!"}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="dash-stat-card"
          >
            <div className={`dash-stat-icon icon-${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="dash-stat-info">
              <div className="dash-stat-value">{stat.value}</div>
              <div className="dash-stat-label">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue learning */}
      {continueLearning ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="section-block"
        >
          <div className="section-block-header">
            <h2>Davom ettirish</h2>
            <p>Eng oxirgi kursingizni davom ettiring</p>
          </div>

          <div className="continue-grid">
            <div className="continue-card">
              <div className="continue-thumbnail">
                {continueLearning.course?.thumbnail ? (
                  <img 
                    src={continueLearning.course.thumbnail} 
                    alt={continueLearning.course.title} 
                  />
                ) : (
                  <BookOpen size={32} />
                )}
              </div>
              <div className="continue-content">
                <h3>{continueLearning.course?.title}</h3>
                <p>
                  {continueLearning.course?.instructor?.username} • {continueLearning.course?.lessons_count || 0} ta dars
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${continueLearning.progress || 0}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {continueLearning.progress || 0}% tugatilgan
                </div>
              </div>
              <Link 
                to={`/courses/${continueLearning.course?.id}/lessons`}
                className="btn btn-primary continue-btn"
              >
                <Play size={16} />
                Davom ettirish
              </Link>
            </div>
          </div>
        </motion.div>
      ) : enrollments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="section-block"
        >
          <div className="dashboard-empty">
            <Sparkles size={48} className="empty-icon" />
            <h3>Hali kurs sotib olmadingiz</h3>
            <p>Eng yaxshi kurslarni ko'rib chiqing va o'rganishni boshlang</p>
            <Link to="/courses" className="btn btn-primary">
              <BookOpen size={18} />
              Kurslarni ko'rish
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="section-block"
        >
          <div className="dashboard-empty">
            <Award size={48} className="empty-icon" />
            <h3>Barcha kurslarni tugatdingiz! 🎉</h3>
            <p>Yangi kurslarni o'rganib, bilimlaringizni kengaytiring</p>
            <Link to="/courses" className="btn btn-primary">
              <BookOpen size={18} />
              Yangi kurslar
            </Link>
          </div>
        </motion.div>
      )}

      {/* My Courses Quick Link */}
      {enrollments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="section-block"
        >
          <div className="section-block-header">
            <div>
              <h2>Mening kurslarim</h2>
              <p>Barcha sotib olgan kurslaringiz</p>
            </div>
            <Link 
              to="/dashboard/student/courses" 
              className="btn btn-secondary"
            >
              Hammasini ko'rish
            </Link>
          </div>

          <div className="recent-courses-grid">
            {enrollments.slice(0, 3).map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/courses/${enrollment.course?.id}/lessons`}
                className="recent-course-card"
              >
                <div className="recent-course-thumbnail">
                  {enrollment.course?.thumbnail ? (
                    <img 
                      src={enrollment.course.thumbnail} 
                      alt={enrollment.course.title} 
                    />
                  ) : (
                    <BookOpen size={32} />
                  )}
                </div>
                <div className="recent-course-info">
                  <h4>{enrollment.course?.title}</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${enrollment.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {enrollment.progress || 0}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default StudentDashboard