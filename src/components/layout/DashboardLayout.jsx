import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Award,
  TrendingUp
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import './DashboardLayout.css'

function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Rolga qarab menu
  const menuItems = user?.role === 'instructor'
    ? [
        { path: '/dashboard/instructor', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/dashboard/instructor/courses', icon: BookOpen, label: 'Kurslarim' },
        { path: '/dashboard/instructor/create', icon: PlusCircle, label: 'Yangi kurs' },
        { path: '/dashboard/instructor/stats', icon: TrendingUp, label: 'Statistika' },
      ]
    : [
        { path: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/dashboard/student/courses', icon: BookOpen, label: 'Mening kurslarim' },
        { path: '/dashboard/student/certificates', icon: Award, label: 'Sertifikatlar' },
      ]

  return (
    <div className="dashboard-layout">
      {/* ============ SIDEBAR ============ */}
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <GraduationCap size={24} />
            <span className="gradient-text">Darslik</span>
          </Link>
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">
              {user?.role === 'instructor' ? "👨‍🏫 O'qituvchi" : "🎓 O'quvchi"}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className="sidebar-link"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/profile" className="sidebar-link">
            <User size={20} />
            <span>Profil</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-link sidebar-logout">
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* ============ OVERLAY (mobile) ============ */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div className="dashboard-main">
        {/* Mobile header */}
        <header className="dashboard-mobile-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="mobile-logo">
            <GraduationCap size={22} />
            <span className="gradient-text">Darslik</span>
          </Link>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout