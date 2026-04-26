import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  GraduationCap,
  Star,
  Award,
  BookOpen,
  Trophy,
  AlertCircle,
  Info
} from 'lucide-react'
import { notificationsAPI } from '../../api/notifications'
import './NotificationDropdown.css'

function NotificationDropdown() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Tashqariga bossa yopish
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // O'qilmagan sonini har 30 soniyada yangilash
  useEffect(() => {
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 30000) // 30 sek
    return () => clearInterval(interval)
  }, [])

  const loadUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount()
      setUnreadCount(data.count)
    } catch (error) {
      console.error(error)
    }
  }

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await notificationsAPI.getAll()
      setNotifications(data.results || data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      loadNotifications()
    }
    setIsOpen(!isOpen)
  }

  const handleNotificationClick = async (notification) => {
    // O'qilgan deb belgilash
    if (!notification.is_read) {
      try {
        await notificationsAPI.markAsRead(notification.id)
        loadUnreadCount()
      } catch (error) {
        console.error(error)
      }
    }

    // Linkga o'tish
    if (notification.link) {
      navigate(notification.link)
      setIsOpen(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      toast.success("Hammasi belgilandi ✓")
      setUnreadCount(0)
      loadNotifications()
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    }
  }

  const handleClearAll = async () => {
    if (!confirm("Barcha bildirishnomalarni o'chirmoqchimisiz?")) return

    try {
      await notificationsAPI.clearAll()
      toast.success("Hammasi o'chirildi")
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    }
  }

  // Bildirishnoma turiga qarab ikonka
  const getIcon = (type) => {
    const icons = {
      enrollment: <GraduationCap size={20} />,
      review: <Star size={20} />,
      certificate: <Award size={20} />,
      new_lesson: <BookOpen size={20} />,
      new_course: <BookOpen size={20} />,
      quiz_passed: <Trophy size={20} />,
      quiz_failed: <AlertCircle size={20} />,
      course_completed: <Trophy size={20} />,
      system: <Info size={20} />,
    }
    return icons[type] || <Bell size={20} />
  }

  // Vaqtni chiroyli formatda ko'rsatish
  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return "Hozirgina"
    if (minutes < 60) return `${minutes} daqiqa oldin`
    if (hours < 24) return `${hours} soat oldin`
    if (days < 7) return `${days} kun oldin`
    return date.toLocaleDateString('uz-UZ')
  }

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      {/* Bell icon */}
      <button
        className={`notif-toggle ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        title="Bildirishnomalar"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="notif-panel"
          >
            {/* Header */}
            <div className="notif-header">
              <h3>
                <Bell size={18} />
                Bildirishnomalar
                {unreadCount > 0 && (
                  <span className="notif-count-badge">{unreadCount}</span>
                )}
              </h3>
              <button
                className="notif-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="notif-actions">
                <button
                  className="notif-action-btn"
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={14} />
                  Hammasini o'qildim
                </button>
                <button
                  className="notif-action-btn notif-action-clear"
                  onClick={handleClearAll}
                >
                  <Trash2 size={14} />
                  Hammasini o'chirish
                </button>
              </div>
            )}

            {/* Body */}
            <div className="notif-body">
              {isLoading ? (
                <div className="notif-loading">
                  <div className="notif-spinner"></div>
                  <p>Yuklanmoqda...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty">
                  <Bell size={48} />
                  <p>Hech qanday bildirishnoma yo'q</p>
                </div>
              ) : (
                <div className="notif-list">
                  {notifications.map((notif, i) => (
                    <motion.button
                      key={notif.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleNotificationClick(notif)}
                      className={`notif-item ${!notif.is_read ? 'unread' : ''}`}
                    >
                      <div className={`notif-icon notif-icon-${notif.notification_type}`}>
                        {getIcon(notif.notification_type)}
                      </div>
                      
                      <div className="notif-content">
                        <div className="notif-title">{notif.title}</div>
                        <div className="notif-message">{notif.message}</div>
                        <div className="notif-time">{getTimeAgo(notif.created_at)}</div>
                      </div>

                      {!notif.is_read && (
                        <div className="notif-dot"></div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationDropdown