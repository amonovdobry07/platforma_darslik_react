import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Users, DollarSign, Star, PlusCircle, TrendingUp } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import './Dashboard.css'

function InstructorDashboard() {
  const { user } = useAuthStore()

  const stats = [
    { icon: BookOpen, value: '2', label: 'Kurslar', color: 'emerald' },
    { icon: Users, value: '156', label: "O'quvchilar", color: 'lime' },
    { icon: DollarSign, value: '2.4M', label: "Daromad (so'm)", color: 'emerald' },
    { icon: Star, value: '4.8', label: "O'rtacha reyting", color: 'lime' },
  ]

  return (
    <div className="dashboard-page">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-welcome"
      >
        <div>
          <h1>
            Salom, <span className="gradient-text">{user?.username}</span>! 🎓
          </h1>
          <p>O'quvchilaringizga yangi bilim bering</p>
        </div>
        <Link to="/dashboard/instructor/create" className="btn btn-primary">
          <PlusCircle size={18} />
          Yangi kurs
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="dash-stat-card"
          >
            <div className={`dash-stat-icon icon-${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="dash-stat-info">
              <div className="dash-stat-value">{stat.value}</div>
              <div className="dash-stat-label">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="section-block"
      >
        <div className="section-block-header">
          <h2>Kurslarim</h2>
          <p>Siz yaratgan kurslar</p>
        </div>

        <div className="empty-state">
          <TrendingUp size={48} className="empty-icon" />
          <h3>Keyingi bosqichda to'liq funksiya</h3>
          <p>Bu yerda siz yaratgan kurslar ro'yxati ko'rinadi</p>
        </div>
      </motion.div>
    </div>
  )
}

export default InstructorDashboard