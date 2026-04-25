import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, Send, Globe } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <GraduationCap size={28} />
              <span className="gradient-text">Darslik</span>
            </Link>
            <p className="footer-desc">
              O'zbekistondagi zamonaviy online ta'lim platformasi.
              Bilim olish hech qachon oson bo'lmagan!
            </p>
          </div>

          <div className="footer-col">
            <h4>Platforma</h4>
            <ul>
              <li><Link to="/courses">Kurslar</Link></li>
              <li><Link to="/about">Biz haqimizda</Link></li>
              <li><Link to="/contact">Aloqa</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Hisob</h4>
            <ul>
              <li><Link to="/login">Kirish</Link></li>
              <li><Link to="/register">Ro'yxatdan o'tish</Link></li>
              <li><Link to="/profile">Profil</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Bog'lanish</h4>
            <div className="footer-socials">
              <a href="mailto:info@darslik.uz" className="social-link" title="Email">
                <Mail size={20} />
              </a>
              <a href="tel:+998901234567" className="social-link" title="Telefon">
                <Phone size={20} />
              </a>
              <a href="https://t.me/darslik" className="social-link" title="Telegram">
                <Send size={20} />
              </a>
              <a href="https://darslik.uz" className="social-link" title="Web">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Darslik Platforma. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer