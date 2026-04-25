import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { 
  GraduationCap, 
  User, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import './Navbar.css'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  // Menu ochiq bo'lsa — scroll ni bloklash
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <GraduationCap size={28} />
            <span className="gradient-text">Darslik</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="navbar-links">
            <li><NavLink to="/" end>Bosh sahifa</NavLink></li>
            <li><NavLink to="/courses">Kurslar</NavLink></li>
            <li><NavLink to="/about">Biz haqimizda</NavLink></li>
          </ul>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'instructor' ? '/dashboard/instructor' : '/dashboard/student'}
                  className="btn-icon"
                  title="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
                <Link to="/profile" className="btn-icon" title="Profil">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="btn-icon" title="Chiqish">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Kirish</Link>
                <Link to="/register" className="btn btn-primary">Ro'yxatdan o'tish</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="navbar-hamburger" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ============ MOBILE MENU ============ */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-menu-links">
            <li><NavLink to="/" end onClick={closeMenu}>Bosh sahifa</NavLink></li>
            <li><NavLink to="/courses" onClick={closeMenu}>Kurslar</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu}>Biz haqimizda</NavLink></li>
          </ul>

          <div className="mobile-menu-divider"></div>

          <div className="mobile-menu-actions">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'instructor' ? '/dashboard/instructor' : '/dashboard/student'}
                  className="mobile-menu-item"
                  onClick={closeMenu}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="mobile-menu-item" onClick={closeMenu}>
                  <User size={20} />
                  <span>Profil</span>
                </Link>
                <button onClick={handleLogout} className="mobile-menu-item mobile-menu-logout">
                  <LogOut size={20} />
                  <span>Chiqish</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-lg mobile-btn" onClick={closeMenu}>
                  Kirish
                </Link>
                <Link to="/register" className="btn btn-primary btn-lg mobile-btn" onClick={closeMenu}>
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar