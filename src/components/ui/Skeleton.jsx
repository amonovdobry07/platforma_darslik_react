import './Skeleton.css'

// Asosiy Skeleton komponenti
function Skeleton({ width, height, borderRadius, className = '', style = {} }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  )
}

// CourseCard uchun skeleton
export function CourseCardSkeleton() {
  return (
    <div className="skeleton-course-card">
      <Skeleton width="100%" height="180px" borderRadius="12px" />
      <div className="skeleton-course-body">
        <div className="skeleton-meta">
          <Skeleton width="80px" height="20px" borderRadius="20px" />
          <Skeleton width="60px" height="20px" borderRadius="20px" />
        </div>
        <Skeleton width="90%" height="22px" borderRadius="6px" />
        <Skeleton width="70%" height="22px" borderRadius="6px" />
        <Skeleton width="100%" height="16px" borderRadius="6px" />
        <Skeleton width="80%" height="16px" borderRadius="6px" />
        <div className="skeleton-footer">
          <Skeleton width="60px" height="16px" borderRadius="6px" />
          <Skeleton width="80px" height="20px" borderRadius="6px" />
        </div>
        <Skeleton width="100%" height="44px" borderRadius="10px" />
      </div>
    </div>
  )
}

// LessonCard uchun skeleton
export function LessonCardSkeleton() {
  return (
    <div className="skeleton-lesson-card">
      <Skeleton width="48px" height="48px" borderRadius="12px" />
      <div className="skeleton-lesson-info">
        <Skeleton width="70%" height="18px" borderRadius="6px" />
        <Skeleton width="40%" height="14px" borderRadius="6px" />
      </div>
      <Skeleton width="80px" height="32px" borderRadius="8px" />
    </div>
  )
}

// Profile uchun skeleton
export function ProfileSkeleton() {
  return (
    <div className="skeleton-profile">
      <Skeleton width="120px" height="120px" borderRadius="50%" />
      <div className="skeleton-profile-info">
        <Skeleton width="200px" height="28px" borderRadius="6px" />
        <Skeleton width="150px" height="20px" borderRadius="6px" />
      </div>
    </div>
  )
}

// Stat card uchun skeleton
export function StatCardSkeleton() {
  return (
    <div className="skeleton-stat-card">
      <Skeleton width="40px" height="40px" borderRadius="10px" />
      <Skeleton width="60%" height="32px" borderRadius="6px" />
      <Skeleton width="80%" height="14px" borderRadius="6px" />
    </div>
  )
}

// Review uchun skeleton
export function ReviewSkeleton() {
  return (
    <div className="skeleton-review">
      <div className="skeleton-review-header">
        <Skeleton width="48px" height="48px" borderRadius="50%" />
        <div className="skeleton-review-meta">
          <Skeleton width="120px" height="16px" borderRadius="6px" />
          <Skeleton width="80px" height="14px" borderRadius="6px" />
        </div>
      </div>
      <Skeleton width="100%" height="60px" borderRadius="6px" />
    </div>
  )
}

export default Skeleton