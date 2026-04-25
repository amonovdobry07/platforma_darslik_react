import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  Menu,
  X
} from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { lessonsAPI } from '../api/lessons'
import { enrollmentsAPI } from '../api/enrollments'
import useAuthStore from '../store/authStore'
import './LessonViewer.css'

function LessonViewer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [courseId, lessonId])

  const loadData = async () => {
    try {
      setIsLoading(true)

      // Kurs va darslar
      const courseData = await coursesAPI.getOne(courseId)
      setCourse(courseData)

      const lessonsData = await lessonsAPI.getByCourse(courseId)
      const lessonsList = lessonsData.results || lessonsData
      setLessons(lessonsList)

      // Hozirgi dars
      let lesson
      if (lessonId) {
        lesson = await lessonsAPI.getOne(courseId, lessonId)
      } else if (lessonsList.length > 0) {
        // Birinchi darsga avtomatik o'tish
        lesson = lessonsList[0]
        navigate(`/courses/${courseId}/lessons/${lesson.id}`, { replace: true })
        return
      }
      setCurrentLesson(lesson)

      // Enrollment tekshirish
      if (isAuthenticated && user?.role !== 'instructor') {
        const enrollments = await enrollmentsAPI.getMyCourses()
        const enrollmentsList = enrollments.results || enrollments
        const enrolled = enrollmentsList.some(e => e.course?.id === parseInt(courseId))
        setIsEnrolled(enrolled)

        // Agar bepul bo'lmagan darsga yozilmagan user kirsa
        if (lesson && !lesson.is_free && !enrolled) {
          toast.error("Bu darsga kirish uchun kursga yozilishingiz kerak!")
          navigate(`/courses/${courseId}`)
          return
        }
      } else if (user?.role === 'instructor' && courseData.instructor?.id === user.id) {
        // Instructor o'z kursini ko'ra oladi
        setIsEnrolled(true)
      }
    } catch (error) {
      toast.error("Dars yuklanmadi")
      navigate(`/courses/${courseId}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLessonClick = (lesson) => {
    if (!lesson.is_free && !isEnrolled) {
      toast.error("Bu dars yopiq! Kursga yozilish kerak.")
      return
    }
    navigate(`/courses/${courseId}/lessons/${lesson.id}`)
    setIsSidebarOpen(false)
  }

  const goToPrevLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id)
    if (currentIndex > 0) {
      handleLessonClick(lessons[currentIndex - 1])
    }
  }

  const goToNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id)
    if (currentIndex < lessons.length - 1) {
      handleLessonClick(lessons[currentIndex + 1])
    }
  }

  // YouTube video URL'ni embed formatga o'tkazish
  const getEmbedUrl = (url) => {
    if (!url) return null
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }

  if (isLoading) {
    return (
      <div className="lv-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="lv-empty">
        <BookOpen size={64} />
        <h2>Darslar yo'q</h2>
        <p>Bu kursda hali darslar mavjud emas</p>
        <Link to={`/courses/${courseId}`} className="btn btn-primary">
          Kursga qaytish
        </Link>
      </div>
    )
  }

  const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < lessons.length - 1
  const embedUrl = getEmbedUrl(currentLesson.video_url)

  return (
    <div className="lesson-viewer">
      {/* ============ TOP BAR ============ */}
      <div className="lv-topbar">
        <Link to={`/courses/${courseId}`} className="lv-back">
          <ArrowLeft size={18} />
          <span className="lv-back-text">Kursga qaytish</span>
        </Link>

        <div className="lv-course-title">
          {course?.title}
        </div>

        <button 
          className="lv-sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="lv-layout">
        {/* ============ SIDEBAR (lessons list) ============ */}
        <aside className={`lv-sidebar ${isSidebarOpen ? 'active' : ''}`}>
          <div className="lv-sidebar-header">
            <h3>Darslar ro'yxati</h3>
            <p>{lessons.length} ta dars</p>
          </div>

          <div className="lv-lessons-list">
            {lessons.map((lesson, i) => {
              const isActive = lesson.id === currentLesson.id
              const isLocked = !lesson.is_free && !isEnrolled

              return (
                <button
                  key={lesson.id}
                  className={`lv-lesson-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => handleLessonClick(lesson)}
                  disabled={isLocked}
                >
                  <div className="lv-lesson-number">
                    {isActive ? (
                      <PlayCircle size={20} />
                    ) : isLocked ? (
                      <Lock size={16} />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <div className="lv-lesson-info">
                    <div className="lv-lesson-title">{lesson.title}</div>
                    <div className="lv-lesson-meta">
                      <Clock size={12} />
                      <span>{lesson.duration_minutes} min</span>
                      {lesson.is_free && <span className="lv-free-badge">Bepul</span>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* ============ MAIN CONTENT ============ */}
        <main className="lv-main">
          <motion.div
            key={currentLesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Video */}
            <div className="lv-video-wrapper">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={currentLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="lv-video-placeholder">
                  <PlayCircle size={64} />
                  <p>Video mavjud emas</p>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="lv-content">
              <div className="lv-lesson-header">
                <div className="lv-lesson-number-badge">
                  Dars {currentIndex + 1}
                </div>
                <h1>{currentLesson.title}</h1>
                <div className="lv-lesson-stats">
                  <div className="lv-stat">
                    <Clock size={14} />
                    <span>{currentLesson.duration_minutes} daqiqa</span>
                  </div>
                  {currentLesson.is_free && (
                    <div className="lv-stat lv-stat-free">
                      <CheckCircle2 size={14} />
                      <span>Bepul</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="lv-lesson-content">
                <h2>Dars haqida</h2>
                <p>{currentLesson.content}</p>
              </div>

              {/* Navigation */}
              <div className="lv-navigation">
                <button
                  className="btn btn-secondary"
                  onClick={goToPrevLesson}
                  disabled={!hasPrev}
                >
                  <ChevronLeft size={18} />
                  Oldingi dars
                </button>

                <div className="lv-progress-text">
                  {currentIndex + 1} / {lessons.length}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={goToNextLesson}
                  disabled={!hasNext}
                >
                  Keyingi dars
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="lv-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default LessonViewer