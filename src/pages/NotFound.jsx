import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  ArrowLeft,
  Search,
  BookOpen,
  Info,
  AlertCircle
} from 'lucide-react'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  // Mashhur sahifalar (foydalanuvchi shu yerga adashganda yo'naltirish)
  const popularPages = [
    {
      icon: <BookOpen size={20} />,
      title: 'Barcha kurslar',
      description: "Bizning kurslar to'plamini ko'ring",
      link: '/courses'
    },
    {
      icon: <Home size={20} />,
      title: 'Bosh sahifa',
      description: "Asosiy sahifaga qayting",
      link: '/'
    },
    {
      icon: <Info size={20} />,
      title: 'Biz haqimizda',
      description: "Loyiha haqida ma'lumot",
      link: '/about'
    }
  ]

  return (
    <div className="not-found">
      {/* Background dekoratsiya */}
      <div className="nf-bg">
        <div className="nf-orb nf-orb-1"></div>
        <div className="nf-orb nf-orb-2"></div>
        <div className="nf-grid"></div>
      </div>

      <div className="nf-container">
        {/* ============ KATTA 404 ============ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="nf-number"
        >
          <span className="nf-digit">4</span>
          <motion.span 
            className="nf-zero"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <AlertCircle size={140} strokeWidth={1} />
          </motion.span>
          <span className="nf-digit">4</span>
        </motion.div>

        {/* ============ SARLAVHA ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="nf-content"
        >
          <h1>
            Sahifa <span className="gradient-text">topilmadi</span>
          </h1>
          <p>
            Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin. 
            Manzilni qaytadan tekshirib ko'ring yoki bosh sahifaga qayting.
          </p>
        </motion.div>

        {/* ============ TUGMALAR ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="nf-actions"
        >
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Bosh sahifa
          </Link>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Orqaga qaytish
          </button>
        </motion.div>

        {/* ============ MASHHUR SAHIFALAR ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="nf-popular"
        >
          <div className="nf-popular-title">
            <Search size={16} />
            <span>Mashhur sahifalar</span>
          </div>

          <div className="nf-popular-grid">
            {popularPages.map((page, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              >
                <Link to={page.link} className="nf-popular-card">
                  <div className="nf-popular-icon">
                    {page.icon}
                  </div>
                  <div className="nf-popular-info">
                    <strong>{page.title}</strong>
                    <span>{page.description}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound