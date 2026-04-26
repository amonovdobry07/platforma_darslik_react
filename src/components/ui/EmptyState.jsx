import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './EmptyState.css'

function EmptyState({
  icon: Icon,           // Lucide ikonka komponenti
  title,                // Sarlavha
  description,          // Tushuntirish matni
  actionLabel,          // Tugma matni (ixtiyoriy)
  actionLink,           // Tugma linki (ixtiyoriy)
  actionOnClick,        // Tugma click handler (ixtiyoriy)
  actionIcon: ActionIcon, // Tugmadagi ikonka (ixtiyoriy)
  variant = 'default',  // 'default' | 'compact'
  illustration = 'icon' // 'icon' | 'illustration'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`empty-state empty-state-${variant}`}
    >
      {/* ============ IKONKA / ILLUSTRATION ============ */}
      <div className="es-visual">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.6,
            delay: 0.1,
            type: "spring",
            stiffness: 200
          }}
          className="es-icon-wrap"
        >
          {/* Background circles (dekoratsiya) */}
          <div className="es-circle es-circle-1"></div>
          <div className="es-circle es-circle-2"></div>
          
          {/* Asosiy ikonka */}
          <div className="es-icon">
            {Icon && <Icon size={variant === 'compact' ? 36 : 48} strokeWidth={1.5} />}
          </div>
        </motion.div>
      </div>

      {/* ============ KONTENT ============ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="es-content"
      >
        {title && <h3 className="es-title">{title}</h3>}
        {description && <p className="es-description">{description}</p>}
      </motion.div>

      {/* ============ AKSIYA TUGMA ============ */}
      {(actionLabel && (actionLink || actionOnClick)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="es-action"
        >
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary">
              {ActionIcon && <ActionIcon size={18} />}
              {actionLabel}
            </Link>
          ) : (
            <button onClick={actionOnClick} className="btn btn-primary">
              {ActionIcon && <ActionIcon size={18} />}
              {actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState