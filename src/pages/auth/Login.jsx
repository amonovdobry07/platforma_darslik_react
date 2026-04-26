import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { 
  GraduationCap, 
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { authAPI } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import './auth.css'

function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Login qilish va token olish
      const { access, refresh } = await authAPI.login(formData)
      
      // 2. Tokenlarni localStorage ga saqlash
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // 3. Foydalanuvchi ma'lumotlarini olish
      const userData = await authAPI.getMe()
      setUser(userData)

      toast.success(`Xush kelibsiz, ${userData.username}!`)

      // 4. Role'ga qarab yo'naltirish
      if (userData.role === 'instructor') {
        navigate('/dashboard/instructor')
      } else {
        navigate('/dashboard/student')
      }
    } catch (error) {
      toast.error("Login yoki parol noto'g'ri!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
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
            <h1>Xush kelibsiz!</h1>
            <p>Hisobingizga kiring</p>
          </div>

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
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Parol"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Kirish...
                </>
              ) : (
                <>
                  Kirish
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="auth-link">Ro'yxatdan o'ting</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login