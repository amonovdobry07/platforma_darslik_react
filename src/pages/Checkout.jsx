import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  Award,
  PlayCircle,
  Users,
  Star
} from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { paymentsAPI } from '../api/payments'
import useAuthStore from '../store/authStore'
import './Checkout.css'

function Checkout() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('click')
  const [step, setStep] = useState('form') // 'form' | 'processing' | 'success'
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Avval tizimga kiring!")
      navigate('/login')
      return
    }
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      const data = await coursesAPI.getOne(courseId)
      setCourse(data)
      
      // Bepul kurs bo'lsa — to'g'ridan-to'g'ri yozish
      if (data.price === 0 || data.price === '0' || parseFloat(data.price) === 0) {
        await handleFreeEnrollment()
      }
    } catch (error) {
      toast.error("Kurs topilmadi")
      navigate('/courses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFreeEnrollment = async () => {
    try {
      const result = await paymentsAPI.initiate(courseId)
      if (result.status === 'free_enrolled') {
        toast.success(result.message)
        navigate(`/courses/${courseId}/lessons`)
      }
    } catch (error) {
      const errMsg = error.response?.data?.error
      if (errMsg) toast.error(errMsg)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setStep('processing')

    try {
      // 1. To'lov boshlash
      const result = await paymentsAPI.initiate(courseId, paymentMethod)
      
      if (result.status === 'free_enrolled') {
        toast.success(result.message)
        navigate(`/courses/${courseId}/lessons`)
        return
      }

      setPaymentData(result)

      // ⚠️ KELAJAK: Real Click/Payme'da bu yerda redirect bo'ladi
      // window.location.href = result.redirect_url
      
      // Hozircha — Demo: 2 sek kutamiz va tasdiqlaymiz
      setTimeout(async () => {
        try {
          const confirmResult = await paymentsAPI.confirm(result.payment_id)
          
          if (confirmResult.status === 'success') {
            setStep('success')
            toast.success(confirmResult.message)
          }
        } catch (err) {
          toast.error("To'lovni tasdiqlashda xatolik")
          setStep('form')
        } finally {
          setIsProcessing(false)
        }
      }, 2500) // 2.5 sek "ishlash" simulyatsiyasi
      
    } catch (error) {
      const errMsg = error.response?.data?.error || "Xatolik yuz berdi"
      toast.error(errMsg)
      setStep('form')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="checkout-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  if (!course) return null

  // Bepul kurs uchun ko'rinish kerak emas
  if (parseFloat(course.price) === 0) {
    return null
  }

  // ============ SUCCESS STEP ============
  if (step === 'success') {
    return (
      <div className="checkout-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="checkout-success"
        >
          <div className="success-icon">
            <CheckCircle2 size={80} />
          </div>
          <h1>To'lov muvaffaqiyatli! 🎉</h1>
          <p>
            "<strong>{course.title}</strong>" kursiga muvaffaqiyatli yozildingiz!
          </p>
          
          <div className="success-info">
            <div className="info-row">
              <span>Tranzaksiya ID:</span>
              <code>{paymentData?.transaction_id?.slice(0, 8)}...</code>
            </div>
            <div className="info-row">
              <span>Summa:</span>
              <strong>{formatPrice(course.price)} so'm</strong>
            </div>
            <div className="info-row">
              <span>To'lov usuli:</span>
              <strong>{paymentMethod === 'click' ? 'Click' : 'Payme'}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/dashboard/student/courses" className="btn btn-secondary">
              Mening kurslarim
            </Link>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(`/courses/${courseId}/lessons`)}
            >
              <PlayCircle size={20} />
              Kursni boshlash
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============ PROCESSING STEP ============
  if (step === 'processing') {
    return (
      <div className="checkout-page">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="checkout-processing"
        >
          <div className="processing-animation">
            <Loader2 className="spinner" size={64} />
          </div>
          <h2>To'lov amalga oshirilmoqda...</h2>
          <p>Iltimos, sahifani yopmang. Bir necha soniya kutib turing.</p>
          
          <div className="processing-steps">
            <div className="step active">
              <CheckCircle2 size={20} />
              <span>To'lov boshlandi</span>
            </div>
            <div className="step active">
              <Loader2 className="spinner" size={20} />
              <span>To'lov tekshirilmoqda</span>
            </div>
            <div className="step">
              <Clock size={20} />
              <span>Tasdiqlash kutilmoqda</span>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============ MAIN FORM ============
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button className="checkout-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <div className="checkout-grid">
          {/* LEFT: To'lov formasi */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="checkout-form-section"
          >
            <h1>To'lov</h1>
            <p className="checkout-subtitle">
              Xavfsiz va tezkor to'lov tizimi
            </p>

            {/* Demo banner */}
            <div className="demo-banner">
              <AlertCircle size={20} />
              <div>
                <strong>Demo rejim</strong>
                <span>Real to'lov amalga oshmaydi. Test uchun ishlatilmoqda.</span>
              </div>
            </div>

            {/* To'lov usullari */}
            <div className="payment-methods">
              <h3>To'lov usulini tanlang</h3>
              
              <div className="payment-options">
                <button
                  className={`payment-option ${paymentMethod === 'click' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('click')}
                >
                  <div className="payment-option-logo click-logo">
                    Click
                  </div>
                  <div className="payment-option-info">
                    <strong>Click</strong>
                    <span>O'zbekiston</span>
                  </div>
                  {paymentMethod === 'click' && (
                    <CheckCircle2 size={20} className="payment-check" />
                  )}
                </button>

                <button
                  className={`payment-option ${paymentMethod === 'payme' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('payme')}
                >
                  <div className="payment-option-logo payme-logo">
                    Payme
                  </div>
                  <div className="payment-option-info">
                    <strong>Payme</strong>
                    <span>O'zbekiston</span>
                  </div>
                  {paymentMethod === 'payme' && (
                    <CheckCircle2 size={20} className="payment-check" />
                  )}
                </button>

                <button
                  className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-option-logo">
                    <CreditCard size={28} />
                  </div>
                  <div className="payment-option-info">
                    <strong>Plastik karta</strong>
                    <span>Visa, Mastercard, Humo, Uzcard</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <CheckCircle2 size={20} className="payment-check" />
                  )}
                </button>
              </div>
            </div>

            {/* Xavfsizlik */}
            <div className="security-info">
              <div className="security-item">
                <ShieldCheck size={20} />
                <span>SSL shifrlash</span>
              </div>
              <div className="security-item">
                <Lock size={20} />
                <span>PCI DSS sertifikat</span>
              </div>
            </div>

            {/* Pay button */}
            <button
              className="btn btn-primary btn-lg checkout-pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><Loader2 className="spinner" size={20} /> Jarayonda...</>
              ) : (
                <><Lock size={20} /> {formatPrice(course.price)} so'm to'lash</>
              )}
            </button>

            <p className="checkout-terms">
              To'lash orqali siz <Link to="/terms">Foydalanish shartlari</Link> va{' '}
              <Link to="/privacy">Maxfiylik siyosati</Link>ga rozilik bildirasiz.
            </p>
          </motion.div>

          {/* RIGHT: Buyurtma */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="checkout-summary"
          >
            <div className="summary-header">
              <h3>Buyurtma</h3>
            </div>

            <div className="summary-course">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.title} />
              )}
              <div className="summary-course-info">
                <h4>{course.title}</h4>
                <div className="summary-course-meta">
                  <span><Users size={14} /> {course.students_count || 0} talaba</span>
                  <span><PlayCircle size={14} /> {course.lessons_count || 0} dars</span>
                </div>
              </div>
            </div>

            <div className="summary-features">
              <h4>Kursga kirgach:</h4>
              <ul>
                <li><CheckCircle2 size={16} /> Cheksiz kirish</li>
                <li><CheckCircle2 size={16} /> Hamma darslar va testlar</li>
                <li><Award size={16} /> Tugatgach sertifikat</li>
                <li><Clock size={16} /> Istalgan vaqt o'rganing</li>
              </ul>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <div className="summary-row">
                <span>Kurs narxi:</span>
                <span>{formatPrice(course.price)} so'm</span>
              </div>
              <div className="summary-row">
                <span>Chegirma:</span>
                <span className="discount">- 0 so'm</span>
              </div>
              <div className="summary-row total">
                <strong>Jami:</strong>
                <strong className="total-price">{formatPrice(course.price)} so'm</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout