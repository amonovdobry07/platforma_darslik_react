import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  Lock,
  CheckCircle2,
  Loader2,
  ShoppingCart,
  Gift
} from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { reviewsAPI } from '../api/reviews'
import { enrollmentsAPI } from '../api/enrollments'
import useAuthStore from '../store/authStore'
import StarRating from '../components/ui/StarRating'
import './CourseDetail.css'

function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const [course, setCourse] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  useEffect(() => {
    loadCourse()
    loadReviews()
    if (isAuthenticated) {
      checkEnrollment()
    }
  }, [id])

  const loadCourse = async () => {
    try {
      const data = await coursesAPI.getOne(id)
      setCourse(data)
    } catch (error) {
      toast.error("Kurs topilmadi")
      navigate('/courses')
    } finally {
      setIsLoading(false)
    }
  }

  const loadReviews = async () => {
    try {
      const data = await reviewsAPI.getByCourse(id)
      setReviews(data.results || data)
    } catch (error) {
      console.error(error)
    }
  }

  const checkEnrollment = async () => {
    try {
      const data = await enrollmentsAPI.getMyCourses()
      const enrollments = data.results || data
      const enrolled = enrollments.some(e => e.course?.id === parseInt(id))
      setIsEnrolled(enrolled)
    } catch (error) {
      console.error(error)
    }
  }

  // ✨ ASOSIY O'ZGARISH — endi Checkout sahifaga yo'naltirib yuboramiz
  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error("Avval tizimga kiring!")
      navigate('/login')
      return
    }

    if (user?.role === 'instructor') {
      toast.error("O'qituvchilar kursga yozila olmaydi!")
      return
    }

    // Bepul yoki pullik bo'lishidan qat'i nazar — Checkout sahifaga yo'naltirish
    // Checkout sahifasi o'zi bepul/pullik holatini boshqaradi
    navigate(`/checkout/${course.id}`)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!reviewComment.trim()) {
      toast.error("Izoh yozing!")
      return
    }

    setIsSubmittingReview(true)
    try {
      await reviewsAPI.create(course.id, {
        rating: reviewRating,
        comment: reviewComment
      })
      toast.success("Sharhingiz qo'shildi! ⭐")
      setShowReviewForm(false)
      setReviewComment('')
      setReviewRating(5)
      loadReviews()
      loadCourse()
    } catch (error) {
      const msg = error.response?.data?.detail || "Xatolik yuz berdi"
      toast.error(msg)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleLessonClick = (e, lesson) => {
    if (!isEnrolled && !lesson.is_free) {
      e.preventDefault()
      toast.error("Bu darsga kirish uchun kursga yozilishingiz kerak!")
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  const levelLabels = {
    beginner: "Boshlang'ich",
    intermediate: "O'rta",
    advanced: "Yuqori"
  }

  // Bepul yoki pullik
  const isFree = parseFloat(course?.price || 0) === 0

  if (isLoading) {
    return (
      <div className="course-detail-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="course-detail">
      {/* ============ HERO ============ */}
      <section className="cd-hero">
        <div className="cd-hero-orb"></div>
        <div className="container">
          <Link to="/courses" className="cd-back">
            <ArrowLeft size={18} />
            Kurslarga qaytish
          </Link>

          <div className="cd-hero-grid">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="cd-hero-info"
            >
              {course.category && (
                <div className="cd-category">{course.category.name}</div>
              )}

              <h1>{course.title}</h1>
              <p className="cd-description">{course.description}</p>

              {/* Meta */}
              <div className="cd-meta">
                <div className="cd-meta-item">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <strong>{course.average_rating || 0}</strong>
                  <span>({course.reviews_count || 0} sharh)</span>
                </div>
                <div className="cd-meta-item">
                  <Users size={16} />
                  <strong>{course.students_count || 0}</strong>
                  <span>o'quvchi</span>
                </div>
                <div className="cd-meta-item">
                  <BookOpen size={16} />
                  <strong>{course.lessons_count || 0}</strong>
                  <span>dars</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="cd-instructor">
                <div className="cd-instructor-avatar">
                  {course.instructor?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="cd-instructor-label">O'qituvchi</div>
                  <div className="cd-instructor-name">{course.instructor?.username}</div>
                </div>
              </div>
            </motion.div>

            {/* ============ SIDE CARD (Enroll) ============ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="cd-enroll-card"
            >
              <div className="cd-enroll-thumbnail">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} />
                ) : (
                  <div className="cd-thumb-placeholder">
                    <BookOpen size={64} />
                  </div>
                )}
                <div className={`cd-level level-${course.level}`}>
                  {levelLabels[course.level]}
                </div>

                {/* Bepul kurs uchun badge */}
                {isFree && (
                  <div className="cd-free-badge">
                    <Gift size={14} />
                    BEPUL
                  </div>
                )}
              </div>

              <div className="cd-enroll-body">
                {/* Narx */}
                {isFree ? (
                  <div className="cd-price cd-price-free">
                    <Gift size={28} />
                    <span>Bepul</span>
                  </div>
                ) : (
                  <div className="cd-price">
                    {formatPrice(course.price)} so'm
                  </div>
                )}

                {/* Tugma */}
                {isEnrolled ? (
                  <Link 
                    to={`/courses/${course.id}/lessons`}
                    className="btn btn-primary btn-lg cd-enroll-btn"
                  >
                    <PlayCircle size={20} />
                    Davom ettirish
                  </Link>
                ) : user?.role === 'instructor' ? (
                  <button className="btn btn-secondary btn-lg cd-enroll-btn" disabled>
                    O'qituvchilar yozila olmaydi
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary btn-lg cd-enroll-btn"
                    onClick={handleEnroll}
                  >
                    {isFree ? (
                      <>
                        <Gift size={20} />
                        Bepul yozilish
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Sotib olish
                      </>
                    )}
                  </button>
                )}

                <div className="cd-features">
                  <div className="cd-feature">
                    <PlayCircle size={16} />
                    {course.lessons_count || 0} ta video dars
                  </div>
                  <div className="cd-feature">
                    <Clock size={16} />
                    Istalgan vaqtda o'rganing
                  </div>
                  <div className="cd-feature">
                    <Award size={16} />
                    Tugatgach sertifikat
                  </div>
                  {!isFree && (
                    <div className="cd-feature">
                      <CheckCircle2 size={16} />
                      Cheksiz kirish
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TABS ============ */}
      <section className="cd-content">
        <div className="container">
          <div className="cd-tabs">
            <button
              className={`cd-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Umumiy ma'lumot
            </button>
            <button
              className={`cd-tab ${activeTab === 'lessons' ? 'active' : ''}`}
              onClick={() => setActiveTab('lessons')}
            >
              Darslar ({course.lessons?.length || 0})
            </button>
            <button
              className={`cd-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Sharhlar ({reviews.length})
            </button>
          </div>

          <div className="cd-tab-content">
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="cd-overview"
              >
                <h2>Kurs haqida</h2>
                <p>{course.description}</p>
              </motion.div>
            )}

            {/* LESSONS */}
            {activeTab === 'lessons' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="cd-lessons"
              >
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, i) => {
                    const isLocked = !isEnrolled && !lesson.is_free
                    
                    return (
                      <Link
                        key={lesson.id}
                        to={isLocked ? '#' : `/courses/${course.id}/lessons/${lesson.id}`}
                        onClick={(e) => handleLessonClick(e, lesson)}
                        className={`lesson-item ${isLocked ? 'lesson-locked' : ''}`}
                      >
                        <div className="lesson-number">{i + 1}</div>
                        <div className="lesson-info">
                          <div className="lesson-title">{lesson.title}</div>
                          <div className="lesson-meta">
                            <Clock size={14} />
                            <span>{lesson.duration_minutes} min</span>
                            {lesson.is_free && <span className="lesson-free">Bepul</span>}
                          </div>
                        </div>
                        <div className="lesson-action">
                          {isLocked ? (
                            <Lock size={20} className="text-muted" />
                          ) : (
                            <PlayCircle size={24} className="text-emerald" />
                          )}
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="cd-empty">
                    <BookOpen size={48} />
                    <p>Hozircha darslar yo'q</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="cd-reviews"
              >
                {/* Review form (only enrolled students) */}
                {isEnrolled && !showReviewForm && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowReviewForm(true)}
                  >
                    <Star size={18} />
                    Sharh qoldirish
                  </button>
                )}

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <h3>Sharh qoldiring</h3>
                    
                    <div className="form-group">
                      <label>Bahoingiz</label>
                      <StarRating 
                        rating={reviewRating} 
                        size={28}
                        interactive 
                        onChange={setReviewRating}
                      />
                    </div>

                    <div className="form-group">
                      <label>Izohingiz</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Kurs haqida fikringizni yozing..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Bekor qilish
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? (
                          <><Loader2 className="spinner" size={18} /> Saqlash...</>
                        ) : (
                          'Yuborish'
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews list */}
                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="review-avatar">
                            {review.student?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div className="review-meta">
                            <div className="review-author">
                              {review.student?.username}
                            </div>
                            <StarRating rating={review.rating} size={14} />
                          </div>
                          <div className="review-date">
                            {new Date(review.created_at).toLocaleDateString('uz-UZ')}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="cd-empty">
                      <Star size={48} />
                      <p>Hali sharhlar yo'q. Birinchi bo'ling!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default CourseDetail