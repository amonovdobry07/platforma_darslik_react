import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User as UserIcon,
  Eye,
  EyeOff,
  BookOpen,
  Presentation,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { authAPI } from '../../api/auth'
import './auth.css'

function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    bio: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validatsiya
    if (formData.password !== formData.password2) {
      toast.error("Parollar mos kelmadi!")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Parol kamida 8 ta belgi bo'lishi kerak!")
      return
    }

    setIsLoading(true)
    try {
      await authAPI.register(formData)
      toast.success("Ro'yxatdan o'tdingiz! Endi kiring.")
      navigate('/login')
    } catch (error) {
      const errors = error.response?.data
      if (errors) {
        const firstError = Object.values(errors)[0]
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
      } else {
        toast.error("Xatolik yuz berdi")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Background effects */}
      <div className="auth-orb auth-orb-1"></div>
      <div className="auth-orb auth-orb-2"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="auth-container"
      >
        <Link to="/" className="auth-logo">
          <GraduationCap size={32} />
          <span className="gradient-text">Darslik</span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <h1>Ro'yxatdan o'tish</h1>
            <p>Bilim olishni bugun boshlang</p>
          </div>

          {/* ROLE TANLASH */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-card ${formData.role === 'student' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              <BookOpen size={28} />
              <span className="role-title">O'quvchi</span>
              <span className="role-desc">Kurs sotib olish va o'rganish</span>
            </button>

            <button
              type="button"
              className={`role-card ${formData.role === 'instructor' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('instructor')}
            >
              <Presentation size={28} />
              <span className="role-title">O'qituvchi</span>
              <span className="role-desc">Kurs yaratish va o'rgatish</span>
            </button>
          </div>

          {/* FORMA */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <UserIcon className="input-icon" size={18} />
              <input
                type="text"
                name="username"
                placeholder="Foydalanuvchi nomi"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email manzil"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Parol (kamida 8 ta belgi)"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password2"
                placeholder="Parolni takrorlang"
                value={formData.password2}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Kuting...
                </>
              ) : (
                <>
                  Ro'yxatdan o'tish
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="auth-link">Kirish</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register