import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import './InstallPrompt.css'

function InstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // iOS aniqlash (iOS Safari'da prompt yo'q)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    // Localstorage'da "rad etilgan" bormi
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const daysSince = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      // 7 kundan kam vaqt o'tgan bo'lsa — ko'rsatmaymiz
      if (daysSince < 7) return
    }

    // Allaqachon o'rnatilgan bo'lsa — ko'rsatmaymiz
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // PWA install event'ni tutamiz
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPromptEvent(e)
      
      // 5 soniyadan keyin prompt ko'rsatamiz
      setTimeout(() => setIsVisible(true), 5000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS uchun — 5 soniyadan keyin manual prompt
    if (isIOSDevice) {
      setTimeout(() => setIsVisible(true), 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPromptEvent) return

    installPromptEvent.prompt()
    const { outcome } = await installPromptEvent.userChoice

    if (outcome === 'accepted') {
      console.log('✅ PWA o\'rnatildi')
    }

    setInstallPromptEvent(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25 }}
          className="install-prompt"
        >
          <button className="install-close" onClick={handleDismiss}>
            <X size={18} />
          </button>

          <div className="install-icon">
            <Smartphone size={32} />
          </div>

          <div className="install-content">
            <h3>Ilovani o'rnating! 📱</h3>
            <p>
              {isIOS 
                ? "Safari'da pastdagi 'Ulashish' tugmasini bosing va 'Bosh ekranga qo'shish' ni tanlang."
                : "Tezroq ishlash uchun ilovani telefoningizga o'rnating."
              }
            </p>

            {!isIOS && (
              <button className="install-btn" onClick={handleInstall}>
                <Download size={18} />
                O'rnatish
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InstallPrompt