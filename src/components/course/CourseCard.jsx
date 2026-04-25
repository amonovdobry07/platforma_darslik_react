import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, BookOpen, Clock } from 'lucide-react'
import './CourseCard.css'

function CourseCard({ course, index = 0 }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm"
  }

  const levelLabels = {
    beginner: 'Boshlang\'ich',
    intermediate: 'O\'rta',
    advanced: 'Yuqori'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/courses/${course.id}`} className="course-card">
        {/* Thumbnail */}
        <div className="course-thumbnail">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} />
          ) : (
            <div className="course-thumbnail-placeholder">
              <BookOpen size={48} />
            </div>
          )}
          <div className={`course-level level-${course.level}`}>
            {levelLabels[course.level]}
          </div>
        </div>

        {/* Content */}
        <div className="course-content">
          {course.category && (
            <div className="course-category">{course.category.name}</div>
          )}

          <h3 className="course-title">{course.title}</h3>

          <p className="course-instructor">
            {course.instructor?.username}
          </p>

          {/* Stats */}
          <div className="course-stats">
            <div className="course-stat">
              <Star size={14} fill="currentColor" />
              <span>{course.average_rating || 0}</span>
              <span className="stat-muted">({course.reviews_count || 0})</span>
            </div>
            <div className="course-stat">
              <Users size={14} />
              <span>{course.students_count || 0}</span>
            </div>
            <div className="course-stat">
              <BookOpen size={14} />
              <span>{course.lessons_count || 0} dars</span>
            </div>
          </div>

          {/* Price */}
          <div className="course-footer">
            <div className="course-price">
              {formatPrice(course.price)}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CourseCard