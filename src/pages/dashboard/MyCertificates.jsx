import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Award,
  Download,
  ExternalLink,
  Calendar,
  Loader2,
  GraduationCap,
  BookOpen,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { certificatesAPI } from '../../api/certificates'
import { enrollmentsAPI } from '../../api/enrollments'
import EmptyState from '../../components/ui/EmptyState'
import './MyCertificates.css'

function MyCertificates() {
  const [certificates, setCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // 1. Mavjud sertifikatlarni yuklash
      const certsData = await certificatesAPI.getMyCertificates()
      const certs = certsData.results || certsData

      // 2. Tugatilgan kurslarni tekshirish va yetishmagan sertifikatlarni yaratish
      const enrollmentsData = await enrollmentsAPI.getMyCourses()
      const enrollments = enrollmentsData.results || enrollmentsData
      
      // 100% tugatilgan kurslar
      const completedEnrollments = enrollments.filter(e => e.is_completed)
      
      // Sertifikati yo'q tugatilgan kurslar
      const certCourseIds = certs.map(c => c.course)
      const missingCerts = completedEnrollments.filter(
        e => !certCourseIds.includes(e.course?.id)
      )

      // Yetishmagan sertifikatlarni yaratish
      if (missingCerts.length > 0) {
        setIsGenerating(true)
        toast.info(`${missingCerts.length} ta sertifikat yaratilmoqda...`)
        
        for (const enrollment of missingCerts) {
          try {
            await certificatesAPI.generateForCourse(enrollment.course.id)
          } catch (err) {
            console.error("Sertifikat yaratishda xatolik:", err)
          }
        }
        
        // Qaytadan yuklash
        const updatedCertsData = await certificatesAPI.getMyCertificates()
        setCertificates(updatedCertsData.results || updatedCertsData)
        toast.success("Sertifikatlar tayyor! 🎓")
      } else {
        setCertificates(certs)
      }
    } catch (error) {
      console.error(error)
      toast.error("Sertifikatlar yuklanmadi")
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  const handleDownload = async (certificate) => {
    setDownloadingId(certificate.id)
    try {
      const blob = await certificatesAPI.download(certificate.id)
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate_${certificate.course_title}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      
      toast.success("Sertifikat yuklab olindi! 🎓")
    } catch (error) {
      toast.error("Yuklab olishda xatolik")
    } finally {
      setDownloadingId(null)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="mcert-loading">
        <Loader2 className="spinner" size={40} />
        {isGenerating && (
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
            Sertifikatlar yaratilmoqda... ✨
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="my-certificates">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mcert-header"
      >
        <div>
          <h1>
            Mening <span className="gradient-text">sertifikatlarim</span>
          </h1>
          <p>Tugatgan kurslaringiz uchun sertifikatlar</p>
        </div>

        <div className="mcert-stat">
          <Award size={24} />
          <div>
            <strong>{certificates.length}</strong>
            <span>Sertifikat</span>
          </div>
        </div>
      </motion.div>

      {/* Certificates */}
      {certificates.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Hali sertifikatingiz yo'q"
          description="Kurslarni 100% tugating va o'zingizning birinchi sertifikatingizni qo'lga kiriting!"
          actionLabel="Kurslarimga o'tish"
          actionLink="/dashboard/student/courses"
          actionIcon={BookOpen}
        />
      ) : (
        <div className="mcert-grid">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mcert-card"
            >
              <div className="mcert-preview">
                <div className="mcert-preview-bg">
                  <div className="mcert-preview-pattern"></div>
                </div>

                <div className="mcert-preview-content">
                  <div className="mcert-preview-label">SERTIFIKAT</div>
                  <Award size={48} className="mcert-preview-icon" />
                  <div className="mcert-preview-name">
                    {cert.student_name}
                  </div>
                  <div className="mcert-preview-course">
                    {cert.course_title}
                  </div>
                </div>
              </div>

              <div className="mcert-info">
                <h3>{cert.course_title}</h3>
                
                <div className="mcert-meta">
                  <div className="mcert-meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(cert.issued_at)}</span>
                  </div>
                  <div className="mcert-meta-item">
                    <span className="mcert-id">
                      ID: {cert.certificate_id.toString().substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="mcert-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDownload(cert)}
                    disabled={downloadingId === cert.id}
                  >
                    {downloadingId === cert.id ? (
                      <><Loader2 className="spinner" size={16} /> Yuklanmoqda...</>
                    ) : (
                      <><Download size={16} /> PDF yuklash</>
                    )}
                  </button>
                  
                  <Link 
                    to={`/courses/${cert.course}`}
                    className="btn btn-secondary"
                  >
                    <ExternalLink size={16} />
                    Kurs
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCertificates