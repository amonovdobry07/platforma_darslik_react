import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Clock,
  Loader2,
  BookOpen,
  Trophy,
  Award
} from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { lessonsAPI } from '../api/lessons'
import { enrollmentsAPI } from '../api/enrollments'
import { progressAPI } from '../api/progress'
import { certificatesAPI } from '../api/certificates'
import { quizAPI } from '../api/quiz'
import Quiz from '../components/quiz/Quiz'
import useAuthStore from '../store/authStore'
import './LessonViewer.css'

function LessonViewer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  
  // QUIZ states
  const [quiz, setQuiz] = useState(null)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    loadData()
  }, [courseId, lessonId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // 1. Kurs ma'lumotlari
      const courseData = await coursesAPI.getOne(courseId)
      setCourse(courseData)

      // 2. Darslar bormi tekshirish
      if (!courseData.lessons || courseData.lessons.length === 0) {
        toast.error("Bu kursda hali darslar qo'shilmagan!")
        navigate(`/courses/${courseId}`)
        return
      }

      // 3. Yozilganmi tekshirish
      const enrollmentsData = await enrollmentsAPI.getMyCourses()
      const enrollments = enrollmentsData.results || enrollmentsData
      const myEnrollment = enrollments.find(
        (e) => e.course?.id === parseInt(courseId)
      )

      if (!myEnrollment) {
        toast.error("Siz bu kursga yozilmagansiz!")
        navigate(`/courses/${courseId}`)
        return
      }
      setEnrollment(myEnrollment)

      // 4. Progress'ni yuklash
      const progressData = await progressAPI.getByCourse(courseId)
      const completedIds = progressData
        .filter((p) => p.is_completed)
        .map((p) => p.lesson)
      setCompletedLessons(completedIds)

      // 5. Hozirgi dars
      if (lessonId) {
        const lessonData = await lessonsAPI.getOne(courseId, lessonId)
        setCurrentLesson(lessonData)

        // 6. QUIZ tekshirish
        try {
          const quizData = await quizAPI.getByLesson(lessonId)
          setQuiz(quizData)
          setHasQuiz(true)
        } catch (err) {
          setQuiz(null)
          setHasQuiz(false)
        }
      } else {
        // URL'da lessonId yo'q — birinchi tugatilmagan darsga o'tish
        const firstUncompleted = courseData.lessons.find(
          (l) => !completedIds.includes(l.id)
        )
        const targetLesson = firstUncompleted || courseData.lessons[0]
        navigate(`/courses/${courseId}/lessons/${targetLesson.id}`, {
          replace: true,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Ma'lumotlar yuklanmadi")
      navigate(`/courses/${courseId}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Asosiy "Darsni tugatdim" tugmasi bosilganda
  const handleCompleteLesson = async () => {
    if (!currentLesson || isCompleting) return

    // Agar quiz bor bo'lsa va hali tugatilmagan bo'lsa — avval testni o'tish kerak
    if (hasQuiz && !isCurrentCompleted) {
      setShowQuiz(true)
      return
    }

    // Quiz yo'q yoki allaqachon tugatilgan — to'g'ridan-to'g'ri tugatish
    await completeLesson()
  }

  // Asl darsni tugatish funksiyasi (quiz tugagandan keyin yoki quiz yo'q bo'lsa)
  const completeLesson = async () => {
    setIsCompleting(true)
    try {
      const result = await progressAPI.completeLesson(currentLesson.id)

      setCompletedLessons([...completedLessons, currentLesson.id])

      setEnrollment({
        ...enrollment,
        progress: result.progress,
        is_completed: result.is_course_completed,
      })

      if (result.is_course_completed) {
        // Avtomatik sertifikat yaratish
        try {
          await certificatesAPI.generateForCourse(courseId)
          toast.success("Sertifikatingiz tayyor! 🎓")
        } catch (err) {
          console.error("Sertifikat yaratishda xatolik:", err)
        }

        setShowCompletionModal(true)
      } else {
        toast.success(result.message)

        const currentIndex = course.lessons.findIndex(
          (l) => l.id === currentLesson.id
        )
        const nextLesson = course.lessons[currentIndex + 1]
        if (nextLesson) {
          setTimeout(() => {
            navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
          }, 1000)
        }
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsCompleting(false)
    }
  }

  // Quiz muvaffaqiyatli tugaganda
  const handleQuizComplete = async () => {
    setShowQuiz(false)
    await completeLesson()
  }

  const navigateToLesson = (lesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.id}`)
  }

  // YouTube/Vimeo URL'ni embed formatga o'tkazish
  const getEmbedUrl = (url) => {
    if (!url) return null

    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    )
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId)
  }

  if (isLoading) {
    return (
      <div className="lv-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  if (!course || !currentLesson) return null

  const currentIndex =
    course.lessons?.findIndex((l) => l.id === currentLesson.id) || 0
  const prevLesson = course.lessons?.[currentIndex - 1]
  const nextLesson = course.lessons?.[currentIndex + 1]
  const isCurrentCompleted = isLessonCompleted(currentLesson.id)
  const completedCount = completedLessons.length
  const totalCount = course.lessons?.length || 0

  return (
    <div className="lesson-viewer">
      {/* SIDEBAR */}
      <aside className="lv-sidebar">
        <div className="lv-sidebar-header">
          <Link to={`/courses/${courseId}`} className="lv-back">
            <ArrowLeft size={18} />
            Kursga qaytish
          </Link>

          <div className="lv-course-title">
            <BookOpen size={16} />
            <span>{course.title}</span>
          </div>

          {/* Progress bar */}
          <div className="lv-progress">
            <div className="lv-progress-header">
              <span>Taraqqiyot</span>
              <strong>{enrollment?.progress || 0}%</strong>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${enrollment?.progress || 0}%` }}
              ></div>
            </div>
            <div className="lv-progress-text">
              {completedCount} / {totalCount} dars tugatildi
            </div>
          </div>
        </div>

        <div className="lv-lessons-list">
          {course.lessons?.map((lesson, i) => {
            const isCompleted = isLessonCompleted(lesson.id)
            const isCurrent = lesson.id === currentLesson.id

            return (
              <button
                key={lesson.id}
                onClick={() => navigateToLesson(lesson)}
                className={`lv-lesson-item ${isCurrent ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              >
                <div className="lv-lesson-status">
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-emerald" />
                  ) : (
                    <Circle size={20} className="text-muted" />
                  )}
                </div>
                <div className="lv-lesson-info">
                  <div className="lv-lesson-num">Dars {i + 1}</div>
                  <div className="lv-lesson-title">{lesson.title}</div>
                  <div className="lv-lesson-time">
                    <Clock size={12} />
                    {lesson.duration_minutes} min
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lv-main">
        <motion.div
          key={currentLesson.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Video */}
          {currentLesson.video_url ? (
            <div className="lv-video-wrapper">
              <iframe
                src={getEmbedUrl(currentLesson.video_url)}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="lv-video-placeholder">
              <PlayCircle size={64} />
              <p>Bu darsda video yo'q</p>
            </div>
          )}

          {/* Lesson info */}
          <div className="lv-content">
            <div className="lv-meta">
              <div className="lv-meta-item">
                <Clock size={16} />
                {currentLesson.duration_minutes} daqiqa
              </div>
              <div className="lv-meta-item">
                Dars {currentIndex + 1} / {totalCount}
              </div>
              {hasQuiz && (
                <div className="lv-meta-item" style={{ color: 'var(--color-emerald)' }}>
                  <Trophy size={16} />
                  Test bor
                </div>
              )}
            </div>

            <h1>{currentLesson.title}</h1>

            <div className="lv-description">
              {currentLesson.content?.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* COMPLETE BUTTON */}
            <div className="lv-complete-section">
              {isCurrentCompleted ? (
                <div className="lv-completed-badge">
                  <CheckCircle2 size={24} />
                  <div>
                    <strong>Dars tugatilgan ✓</strong>
                    <span>Ajoyib! Davom eting.</span>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-lg lv-complete-btn"
                  onClick={handleCompleteLesson}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="spinner" size={20} /> Saqlanmoqda...
                    </>
                  ) : hasQuiz ? (
                    <>
                      <Trophy size={20} />
                      Testni boshlash
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Darsni tugatdim
                    </>
                  )}
                </button>
              )}
            </div>

            {/* NAVIGATION */}
            <div className="lv-navigation">
              <button
                className="btn btn-secondary"
                onClick={() => prevLesson && navigateToLesson(prevLesson)}
                disabled={!prevLesson}
              >
                <ChevronLeft size={18} />
                Oldingi
              </button>

              <button
                className="btn btn-primary"
                onClick={() => nextLesson && navigateToLesson(nextLesson)}
                disabled={!nextLesson}
              >
                Keyingi
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* COURSE COMPLETION MODAL */}
      {showCompletionModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-card lv-completion-modal"
          >
            <div className="lv-trophy">
              <Trophy size={64} />
            </div>
            <h2>Tabriklaymiz! 🎉</h2>
            <p>
              Siz <strong>"{course.title}"</strong> kursini muvaffaqiyatli
              yakunladingiz! Sizning bilim va ko'nikmalaringiz oshdi.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowCompletionModal(false)
                  navigate("/dashboard/student/courses")
                }}
              >
                Mening kurslarim
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowCompletionModal(false)
                  navigate("/dashboard/student/certificates")
                }}
              >
                <Award size={18} />
                Sertifikatga o'tish
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {showQuiz && quiz && (
        <div className="modal-overlay" onClick={() => setShowQuiz(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '100%', padding: '20px' }}>
            <Quiz
              quiz={quiz}
              onComplete={handleQuizComplete}
              onClose={() => setShowQuiz(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default LessonViewer