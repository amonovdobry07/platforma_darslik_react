import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  User as UserIcon,
  Mail,
  FileText,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ArrowLeft
} from 'lucide-react'
import { authAPI } from '../api/auth'
import useAuthStore from '../store/authStore'
import './Profile.css'

function Profile() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')

  // Profile form
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: null
  })
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password form
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: ''
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Rasm hajmi 2MB dan oshmasin!")
      return
    }

    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)

    setProfileData({ ...profileData, avatar: file })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSavingProfile(true)

    try {
      const data = new FormData()
      data.append('email', profileData.email)
      data.append('bio', profileData.bio)
      if (profileData.avatar) {
        data.append('avatar', profileData.avatar)
      }

      const updated = await authAPI.updateProfile(data)
      setUser({ ...user, ...updated })
      toast.success("Profil yangilandi! ✓")
    } catch (error) {
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.new_password2) {
      toast.error("Yangi parollar mos kelmadi!")
      return
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Parol kamida 8 ta belgi bo'lishi kerak!")
      return
    }

    setIsChangingPassword(true)
    try {
      await authAPI.changePassword(passwordData)
      toast.success("Parol o'zgartirildi! 🔐")
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password2: ''
      })
    } catch (error) {
      const msg = error.response?.data?.old_password || "Xatolik yuz berdi"
      toast.error(msg)
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header-wrapper"
        >
          <button 
            type="button"
            className="profile-back" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Orqaga
          </button>

          <div className="profile-header">
            <h1>
              Mening <span className="gradient-text">profilim</span>
            </h1>
            <p>Shaxsiy ma'lumotlaringizni boshqaring</p>
          </div>
        </motion.div>

        <div className="profile-layout">
          {/* ============ SIDEBAR ============ */}
          <div className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={user?.username} />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <h2>{user?.username}</h2>
              <div className="profile-role-badge">
                {user?.role === 'instructor' ? "👨‍🏫 O'qituvchi" : "🎓 O'quvchi"}
              </div>
            </div>

            <div className="profile-tabs">
              <button
                className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <UserIcon size={18} />
                <span>Asosiy ma'lumotlar</span>
              </button>
              <button
                className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={18} />
                <span>Xavfsizlik</span>
              </button>
            </div>
          </div>

          {/* ============ CONTENT ============ */}
          <div className="profile-content">
            {/* INFO TAB */}
            {activeTab === 'info' && (
              <motion.form
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleProfileSubmit}
                className="profile-form"
              >
                <div className="form-section">
                  <h3>Avatar</h3>
                  <p className="form-hint">Profil rasmingizni yuklang (max 2MB)</p>

                  <label className="avatar-upload">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" />
                    ) : (
                      <div className="avatar-upload-placeholder">
                        <Camera size={24} />
                      </div>
                    )}
                    <div className="avatar-upload-overlay">
                      <Camera size={24} />
                      <span>O'zgartirish</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                  </label>
                </div>

                <div className="form-section">
                  <h3>Asosiy ma'lumotlar</h3>

                  <div className="form-group">
                    <label>
                      <UserIcon size={14} />
                      Foydalanuvchi nomi
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="input-disabled"
                    />
                    <p className="form-hint">Username o'zgartirib bo'lmaydi</p>
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={14} />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <FileText size={14} />
                      O'zingiz haqingizda
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Bir necha so'z bilan o'zingizni tanishtiring..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? (
                      <><Loader2 className="spinner" size={18} /> Saqlanmoqda...</>
                    ) : (
                      <><Save size={18} /> Saqlash</>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.form
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handlePasswordSubmit}
                className="profile-form"
              >
                <div className="form-section">
                  <h3>Parolni o'zgartirish</h3>
                  <p className="form-hint">
                    Xavfsiz parol tanlang — kamida 8 ta belgi, raqam va harflar bilan
                  </p>

                  <div className="form-group">
                    <label>
                      <Lock size={14} />
                      Eski parol
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Lock size={14} />
                      Yangi parol
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      minLength={8}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Lock size={14} />
                      Yangi parolni takrorlang
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={passwordData.new_password2}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password2: e.target.value })}
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPasswords ? "Parollarni yashirish" : "Parollarni ko'rsatish"}
                  </button>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <><Loader2 className="spinner" size={18} /> O'zgartirilmoqda...</>
                    ) : (
                      <><Lock size={18} /> Parolni o'zgartirish</>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile