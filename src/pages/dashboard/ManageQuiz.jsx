import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Circle,
  Edit3,
  X,
  Trophy,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import { lessonsAPI } from '../../api/lessons'
import { coursesAPI } from '../../api/courses'
import { quizAPI } from '../../api/quiz'
import useAuthStore from '../../store/authStore'
import EmptyState from '../../components/ui/EmptyState'
import './ManageQuiz.css'

function ManageQuiz() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Quiz settings form
  const [quizTitle, setQuizTitle] = useState("Dars testi")
  const [quizDescription, setQuizDescription] = useState("")
  const [passScore, setPassScore] = useState(60)
  
  // Questions and Answers
  const [questions, setQuestions] = useState([])
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // New question form
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newAnswers, setNewAnswers] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false }
  ])

  useEffect(() => {
    loadData()
  }, [courseId, lessonId])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // 1. Kurs ma'lumotlari
      const courseData = await coursesAPI.getOne(courseId)
      
      // Egasini tekshirish
      if (courseData.instructor?.id !== user?.id) {
        toast.error("Siz bu kursni boshqara olmaysiz!")
        navigate('/dashboard/instructor/courses')
        return
      }
      setCourse(courseData)

      // 2. Dars ma'lumotlari
      const lessonData = await lessonsAPI.getOne(courseId, lessonId)
      setLesson(lessonData)

      // 3. Test bormi tekshirish
      try {
        const quizData = await quizAPI.getByLesson(lessonId)
        setQuiz(quizData)
        setQuizTitle(quizData.title)
        setQuizDescription(quizData.description || "")
        setPassScore(quizData.pass_score)
        setQuestions(quizData.questions || [])
      } catch (err) {
        // Quiz yo'q — yangi yaratish kerak
        setQuiz(null)
      }
    } catch (error) {
      console.error(error)
      toast.error("Ma'lumotlar yuklanmadi")
      navigate(`/dashboard/instructor/lessons/${courseId}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Test yaratish
  const handleCreateQuiz = async () => {
    setIsCreating(true)
    try {
      const data = await quizAPI.create({
        lesson: parseInt(lessonId),
        title: quizTitle,
        description: quizDescription,
        pass_score: parseInt(passScore)
      })
      setQuiz(data)
      setQuestions([])
      toast.success("Test yaratildi! 🎉")
    } catch (error) {
      const errors = error.response?.data
      if (errors) {
        const firstError = Object.values(errors)[0]
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
      } else {
        toast.error("Xatolik yuz berdi")
      }
    } finally {
      setIsCreating(false)
    }
  }

  // Test sozlamalarini yangilash
  const handleUpdateQuiz = async () => {
    setIsSaving(true)
    try {
      await quizAPI.update(quiz.id, {
        lesson: parseInt(lessonId),
        title: quizTitle,
        description: quizDescription,
        pass_score: parseInt(passScore)
      })
      toast.success("Sozlamalar saqlandi ✓")
      await loadData()
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  // Yangi savol qo'shish formasi
  const openAddQuestion = () => {
    setNewQuestionText("")
    setNewAnswers([
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false }
    ])
    setShowAddQuestion(true)
  }

  const handleNewAnswerChange = (index, value) => {
    const updated = [...newAnswers]
    updated[index].text = value
    setNewAnswers(updated)
  }

  const handleNewCorrectChange = (index) => {
    const updated = newAnswers.map((a, i) => ({
      ...a,
      is_correct: i === index
    }))
    setNewAnswers(updated)
  }

  // Savol va javoblarni saqlash
  const handleSaveQuestion = async () => {
    if (!newQuestionText.trim()) {
      toast.error("Savol matnini yozing!")
      return
    }

    const filledAnswers = newAnswers.filter(a => a.text.trim())
    if (filledAnswers.length < 2) {
      toast.error("Kamida 2 ta javob varianti yozing!")
      return
    }

    if (!filledAnswers.some(a => a.is_correct)) {
      toast.error("Kamida bitta to'g'ri javobni belgilang!")
      return
    }

    setIsSaving(true)
    try {
      // 1. Savol yaratish
      const newOrder = questions.length + 1
      const question = await quizAPI.addQuestion(quiz.id, {
        text: newQuestionText,
        order: newOrder
      })

      // 2. Javoblarni qo'shish
      for (let i = 0; i < filledAnswers.length; i++) {
        await quizAPI.addAnswer(question.id, {
          text: filledAnswers[i].text,
          is_correct: filledAnswers[i].is_correct,
          order: i + 1
        })
      }

      toast.success("Savol qo'shildi! 🎉")
      setShowAddQuestion(false)
      await loadData()
    } catch (error) {
      console.error(error)
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSaving(false)
    }
  }

  // Savolni o'chirish
  const handleDeleteQuestion = async () => {
    if (!deleteConfirm) return

    setIsDeleting(true)
    try {
      await quizAPI.deleteQuestion(deleteConfirm.id)
      toast.success("Savol o'chirildi")
      setQuestions(questions.filter(q => q.id !== deleteConfirm.id))
      setDeleteConfirm(null)
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsDeleting(false)
    }
  }

  // Test o'chirish
  const handleDeleteQuiz = async () => {
    if (!confirm("Butun testni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!")) return

    try {
      await quizAPI.delete(quiz.id)
      toast.success("Test o'chirildi")
      setQuiz(null)
      setQuestions([])
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    }
  }

  if (isLoading) {
    return (
      <div className="mq-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  return (
    <div className="manage-quiz">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          className="mq-back"
          onClick={() => navigate(`/dashboard/instructor/lessons/${courseId}`)}
        >
          <ArrowLeft size={18} />
          Darslarga qaytish
        </button>

        <div className="mq-header">
          <div>
            <div className="mq-lesson-name">
              <BookOpen size={16} />
              <span>{course?.title} — {lesson?.title}</span>
            </div>
            <h1>
              <span className="gradient-text">Test</span> boshqaruvi
            </h1>
            <p>Dars uchun test va savollarni qo'shing</p>
          </div>

          {quiz && (
            <button
              className="btn btn-danger-outline"
              onClick={handleDeleteQuiz}
            >
              <Trash2 size={18} />
              Testni o'chirish
            </button>
          )}
        </div>
      </motion.div>

      {/* AGAR QUIZ YO'Q BO'LSA — YARATISH */}
      {!quiz ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mq-create-section"
        >
          <div className="mq-empty-icon">
            <Trophy size={64} />
          </div>
          <h2>Hali test yaratilmagan</h2>
          <p>Bu dars uchun test yarating va talabalar bilimini sinab ko'ring</p>

          <div className="mq-create-form">
            <div className="form-group">
              <label>Test sarlavhasi *</label>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Masalan: Dars 1 testi"
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Tavsif</label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Test haqida qisqacha ma'lumot..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>O'tish uchun minimal foiz *</label>
              <input
                type="number"
                value={passScore}
                onChange={(e) => setPassScore(e.target.value)}
                min="1"
                max="100"
              />
              <span className="form-label-hint">
                Talaba shu foizdan kam olsa — qaytadan urinishi kerak
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleCreateQuiz}
              disabled={isCreating}
            >
              {isCreating ? (
                <><Loader2 className="spinner" size={20} /> Yaratilmoqda...</>
              ) : (
                <><Trophy size={20} /> Testni yaratish</>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* QUIZ SETTINGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mq-settings"
          >
            <h2>
              <Edit3 size={20} />
              Test sozlamalari
            </h2>

            <div className="mq-settings-grid">
              <div className="form-group">
                <label>Sarlavha</label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>O'tish foizi</label>
                <input
                  type="number"
                  value={passScore}
                  onChange={(e) => setPassScore(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tavsif</label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                rows={2}
              />
            </div>

            <button
              className="btn btn-secondary"
              onClick={handleUpdateQuiz}
              disabled={isSaving}
            >
              {isSaving ? (
                <><Loader2 className="spinner" size={18} /> Saqlanmoqda...</>
              ) : (
                <><Save size={18} /> Sozlamalarni saqlash</>
              )}
            </button>
          </motion.div>

          {/* QUESTIONS LIST */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mq-questions-section"
          >
            <div className="mq-questions-header">
              <div>
                <h2>
                  <HelpCircle size={20} />
                  Savollar ({questions.length})
                </h2>
                <p>Test uchun savollar va javoblar</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={openAddQuestion}
              >
                <Plus size={18} />
                Yangi savol
              </button>
            </div>

            {questions.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="Hali savol yo'q"
                description="Birinchi savolingizni qo'shing va testni jonli qiling"
                actionLabel="Birinchi savolni qo'shish"
                actionIcon={Plus}
                actionOnClick={openAddQuestion}
                variant="compact"
              />
            ) : (
              <div className="mq-questions-list">
                {questions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.05 }}
                    className="mq-question-card"
                  >
                    <div className="mq-question-header">
                      <div className="mq-question-number">
                        Savol {qIndex + 1}
                      </div>
                      <button
                        className="mq-action-delete"
                        onClick={() => setDeleteConfirm(question)}
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 className="mq-question-text">{question.text}</h3>

                    <div className="mq-answers-list">
                      {question.answers?.map((answer, aIndex) => (
                        <div
                          key={answer.id}
                          className={`mq-answer-item ${answer.is_correct ? 'correct' : ''}`}
                        >
                          <div className="mq-answer-letter">
                            {String.fromCharCode(65 + aIndex)}
                          </div>
                          <div className="mq-answer-text">{answer.text}</div>
                          {answer.is_correct && (
                            <div className="mq-answer-badge">
                              <CheckCircle2 size={16} />
                              <span>To'g'ri javob</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* ============ ADD QUESTION MODAL ============ */}
      {showAddQuestion && (
        <div className="modal-overlay" onClick={() => setShowAddQuestion(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-card mq-question-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mq-modal-header">
              <h2>Yangi savol qo'shish</h2>
              <button className="modal-close" onClick={() => setShowAddQuestion(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mq-modal-body">
              <div className="form-group">
                <label>Savol matni *</label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Masalan: Python qaysi tilning yangiroq versiyasi?"
                  rows={3}
                />
              </div>

              <div className="mq-answers-form">
                <label className="mq-answers-label">
                  Javob variantlari * 
                  <span className="form-label-hint">(To'g'ri javobni belgilang)</span>
                </label>

                {newAnswers.map((answer, index) => (
                  <div key={index} className={`mq-answer-input ${answer.is_correct ? 'correct' : ''}`}>
                    <button
                      type="button"
                      className="mq-correct-btn"
                      onClick={() => handleNewCorrectChange(index)}
                      title={answer.is_correct ? "To'g'ri javob" : "To'g'ri javob deb belgilash"}
                    >
                      {answer.is_correct ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="mq-answer-letter-input">
                      {String.fromCharCode(65 + index)}
                    </div>

                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => handleNewAnswerChange(index, e.target.value)}
                      placeholder={`Javob ${index + 1}`}
                      maxLength={500}
                    />
                  </div>
                ))}

                <div className="mq-answers-hint">
                  <AlertCircle size={14} />
                  <span>To'g'ri javob bo'sh emas bo'lishi kerak</span>
                </div>
              </div>
            </div>

            <div className="mq-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddQuestion(false)}
                disabled={isSaving}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveQuestion}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 className="spinner" size={18} /> Saqlanmoqda...</>
                ) : (
                  <><Save size={18} /> Savolni qo'shish</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ============ DELETE CONFIRM ============ */}
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
            <h3>Savolni o'chirasizmi?</h3>
            <p>
              Bu savol va uning barcha javoblari o'chiriladi. 
              Bu amalni qaytarib bo'lmaydi!
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
                onClick={handleDeleteQuestion}
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

export default ManageQuiz