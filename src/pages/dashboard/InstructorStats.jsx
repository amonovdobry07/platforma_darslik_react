import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Trophy,
  Loader2,
  Calendar,
  Eye,
  ArrowUpRight,
  Activity
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { statsAPI } from '../../api/stats'
import EmptyState from '../../components/ui/EmptyState'
import './InstructorStats.css'

function InstructorStats() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await statsAPI.getInstructorStats()
      setStats(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Pul formatlash
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M so'm`
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K so'm`
    }
    return `${price} so'm`
  }

  // Vaqtni format qilish
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes} daqiqa oldin`
    if (hours < 24) return `${hours} soat oldin`
    if (days < 7) return `${days} kun oldin`
    return date.toLocaleDateString('uz-UZ')
  }

  // Custom tooltip uchun
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <div className="chart-tooltip-label">{label}</div>
          {payload.map((entry, i) => (
            <div key={i} className="chart-tooltip-item">
              <span style={{ color: entry.color }}>●</span>
              <span>{entry.name}:</span>
              <strong>
                {entry.dataKey === 'revenue' 
                  ? formatPrice(entry.value)
                  : entry.value
                }
              </strong>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="stats-loading">
        <Loader2 className="spinner" size={40} />
      </div>
    )
  }

  if (!stats || stats.overview.total_courses === 0) {
    return (
      <div className="instructor-stats">
        <div className="stats-header">
          <h1>
            <span className="gradient-text">Statistika</span>
          </h1>
          <p>Kurslaringiz bo'yicha batafsil ma'lumot</p>
        </div>

        <EmptyState
          icon={Activity}
          title="Hali statistika yo'q"
          description="Birinchi kursingizni yaratib, talabalarni qo'lga kiriting va statistika ko'ring!"
          actionLabel="Yangi kurs yaratish"
          actionLink="/dashboard/instructor/create"
          actionIcon={BookOpen}
        />
      </div>
    )
  }

  const { overview, revenue_chart, top_courses, courses_breakdown, quiz_stats, recent_enrollments } = stats

  // Quiz pie chart uchun
  const quizPieData = [
    { name: "O'tdi", value: quiz_stats.passed, color: '#10b981' },
    { name: "O'tmadi", value: quiz_stats.failed, color: '#ef4444' }
  ]

  return (
    <div className="instructor-stats">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="stats-header"
      >
        <div>
          <h1>
            <span className="gradient-text">Statistika</span>
          </h1>
          <p>Kurslaringiz bo'yicha batafsil ma'lumot</p>
        </div>
        <div className="stats-period">
          <Calendar size={16} />
          <span>Oxirgi 30 kun</span>
        </div>
      </motion.div>

      {/* ============ OVERVIEW CARDS ============ */}
      <div className="stats-overview">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card stat-card-primary"
        >
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Jami daromad</div>
            <div className="stat-value">{formatPrice(overview.total_revenue)}</div>
            <div className="stat-detail">
              <ArrowUpRight size={14} />
              <span>{overview.total_students} ta sotuv</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="stat-card"
        >
          <div className="stat-icon stat-icon-blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Talabalar</div>
            <div className="stat-value">{overview.total_students}</div>
            <div className="stat-detail">
              <CheckCircle2 size={14} />
              <span>{overview.completion_rate}% tugatdi</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="stat-icon stat-icon-purple">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Kurslar</div>
            <div className="stat-value">{overview.total_courses}</div>
            <div className="stat-detail">
              <span>{overview.total_lessons} ta dars</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="stat-card"
        >
          <div className="stat-icon stat-icon-yellow">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Reyting</div>
            <div className="stat-value">{overview.avg_rating || '—'}</div>
            <div className="stat-detail">
              <Star size={14} />
              <span>{overview.total_reviews} ta sharh</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============ CHARTS ROW ============ */}
      <div className="stats-charts">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-card chart-card-large"
        >
          <div className="chart-header">
            <div>
              <h3>
                <TrendingUp size={20} />
                Daromad dinamikasi
              </h3>
              <p>Oxirgi 30 kun mobaynida</p>
            </div>
          </div>

          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenue_chart}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date_formatted" 
                  stroke="#666"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => formatPrice(value).replace(" so'm", '')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Daromad"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quiz Stats */}
        {quiz_stats.total_attempts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="chart-card"
          >
            <div className="chart-header">
              <div>
                <h3>
                  <Trophy size={20} />
                  Test natijalari
                </h3>
                <p>Jami {quiz_stats.total_attempts} urinish</p>
              </div>
            </div>

            <div className="chart-body chart-body-pie">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={quizPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {quizPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="quiz-legend">
                <div className="quiz-legend-item">
                  <div className="quiz-legend-dot" style={{ background: '#10b981' }}></div>
                  <span>O'tgan: <strong>{quiz_stats.passed}</strong></span>
                </div>
                <div className="quiz-legend-item">
                  <div className="quiz-legend-dot" style={{ background: '#ef4444' }}></div>
                  <span>O'tmagan: <strong>{quiz_stats.failed}</strong></span>
                </div>
                <div className="quiz-pass-rate">
                  <span>O'tish foizi:</span>
                  <strong className="gradient-text">
                    {Math.round((quiz_stats.passed / quiz_stats.total_attempts) * 100)}%
                  </strong>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ============ TOP COURSES ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="stats-section"
      >
        <div className="section-header">
          <h2>
            <Award size={20} />
            Eng mashhur kurslar
          </h2>
        </div>

        {top_courses.length > 0 ? (
          <div className="top-courses-list">
            {top_courses.map((course, i) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="top-course-card"
              >
                <div className="top-course-rank">
                  #{i + 1}
                </div>
                <div className="top-course-info">
                  <h4>{course.title}</h4>
                  <div className="top-course-meta">
                    <span><Users size={14} /> {course.students} talaba</span>
                    <span><Star size={14} fill="#f59e0b" color="#f59e0b" /> {course.rating || '—'}</span>
                  </div>
                </div>
                <div className="top-course-revenue">
                  <div className="top-course-revenue-amount">
                    {formatPrice(course.revenue)}
                  </div>
                  <div className="top-course-revenue-label">Daromad</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted">Hali ma'lumot yo'q</p>
        )}
      </motion.div>

      {/* ============ COURSES BREAKDOWN ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="stats-section"
      >
        <div className="section-header">
          <h2>
            <BookOpen size={20} />
            Kurslar tafsiloti
          </h2>
        </div>

        <div className="courses-table">
          <div className="courses-table-header">
            <div>Kurs</div>
            <div>Talabalar</div>
            <div>Tugatildi</div>
            <div>Reyting</div>
            <div>Daromad</div>
          </div>

          {courses_breakdown.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              className="courses-table-row"
            >
              <div className="course-cell">
                <Link to={`/courses/${course.id}`} className="course-link">
                  {course.title}
                </Link>
              </div>
              <div>
                <span className="cell-value">{course.students}</span>
              </div>
              <div>
                <div className="completion-cell">
                  <div className="completion-bar">
                    <div 
                      className="completion-fill"
                      style={{ width: `${course.completion_rate}%` }}
                    ></div>
                  </div>
                  <span className="completion-text">{course.completion_rate}%</span>
                </div>
              </div>
              <div>
                <div className="rating-cell">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{course.rating || '—'}</span>
                  <span className="rating-count">({course.reviews})</span>
                </div>
              </div>
              <div>
                <span className="revenue-cell gradient-text">
                  {formatPrice(course.revenue)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============ RECENT ENROLLMENTS ============ */}
      {recent_enrollments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="stats-section"
        >
          <div className="section-header">
            <h2>
              <Activity size={20} />
              Oxirgi yozilishlar
            </h2>
          </div>

          <div className="recent-list">
            {recent_enrollments.map((item, i) => (
              <div key={i} className="recent-item">
                <div className="recent-avatar">
                  {item.student_name.charAt(0).toUpperCase()}
                </div>
                <div className="recent-info">
                  <div className="recent-text">
                    <strong>{item.student_name}</strong> "{item.course_title}" kursiga yozildi
                  </div>
                  <div className="recent-time">
                    {formatDate(item.enrolled_at)}
                  </div>
                </div>
                <div className="recent-progress">
                  <div className="recent-progress-bar">
                    <div 
                      className="recent-progress-fill"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span>{item.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default InstructorStats