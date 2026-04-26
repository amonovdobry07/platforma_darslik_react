import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  AlertCircle,
  Loader2,
  Award
} from 'lucide-react'
import { quizAPI } from '../../api/quiz'
import './Quiz.css'

function Quiz({ quiz, onComplete, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: answerId }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null) // Test natijasi

  const questions = quiz.questions || []
  const totalQuestions = questions.length
  const currentQ = questions[currentQuestion]

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId })
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    // Hamma savollarga javob berildimi?
    const unanswered = questions.filter(q => !answers[q.id])
    if (unanswered.length > 0) {
      toast.error(`${unanswered.length} ta savolga javob bermadingiz!`)
      return
    }

    setIsSubmitting(true)
    try {
      const data = await quizAPI.submit(quiz.id, answers)
      setResult(data)
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }

  const handleFinish = () => {
    if (result?.is_passed) {
      onComplete && onComplete(result)
    } else {
      onClose && onClose()
    }
  }

  // ============ RESULT VIEW ============
  if (result) {
    const isPassed = result.is_passed
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="quiz-result"
      >
        <div className={`quiz-result-icon ${isPassed ? 'success' : 'failed'}`}>
          {isPassed ? <Trophy size={64} /> : <AlertCircle size={64} />}
        </div>

        <h2>
          {isPassed ? "Tabriklaymiz! 🎉" : "Qaytadan urinib ko'ring"}
        </h2>

        <div className="quiz-result-score">
          <div className="quiz-score-number">
            <span className={isPassed ? 'success' : 'failed'}>
              {result.score}%
            </span>
          </div>
          <div className="quiz-score-detail">
            {result.correct_answers} / {result.total_questions} to'g'ri javob
          </div>
        </div>

        <div className="quiz-result-message">
          {isPassed ? (
            <p>Siz testdan muvaffaqiyatli o'tdingiz! Endi keyingi darsga o'tishingiz mumkin.</p>
          ) : (
            <p>
              O'tish uchun kamida <strong>{result.pass_score}%</strong> kerak. 
              Materialni qaytadan o'rganib, yana urinib ko'ring!
            </p>
          )}
        </div>

        <div className="quiz-result-actions">
          {!isPassed && (
            <button className="btn btn-secondary" onClick={handleRetry}>
              <RotateCcw size={18} />
              Qayta urinish
            </button>
          )}
          
          {isPassed ? (
            <button className="btn btn-primary" onClick={handleFinish}>
              <Award size={18} />
              Keyingi darsga
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={onClose}>
              Yopish
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  // ============ QUIZ VIEW ============
  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-progress-info">
          <span>Savol {currentQuestion + 1} / {totalQuestions}</span>
          <span className="quiz-pass-info">
            O'tish uchun: {quiz.pass_score}%
          </span>
        </div>
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="quiz-question"
        >
          <h3>{currentQ?.text}</h3>

          <div className="quiz-answers">
            {currentQ?.answers?.map((answer, i) => {
              const isSelected = answers[currentQ.id] === answer.id
              
              return (
                <button
                  key={answer.id}
                  className={`quiz-answer ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(currentQ.id, answer.id)}
                >
                  <div className="quiz-answer-letter">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="quiz-answer-text">{answer.text}</div>
                  {isSelected && (
                    <div className="quiz-answer-check">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          Oldingi
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!answers[currentQ?.id] || isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="spinner" size={18} /> Tekshirilmoqda...</>
          ) : currentQuestion === totalQuestions - 1 ? (
            <><CheckCircle2 size={18} /> Yakunlash</>
          ) : (
            <>Keyingi <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  )
}

export default Quiz