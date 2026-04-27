import { useState } from 'react'
import './LazyImage.css'

function LazyImage({ src, alt, className = '', placeholder = null, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`lazy-image-wrapper ${className}`}>
      {!isLoaded && !hasError && (
        <div className="lazy-image-placeholder">
          {placeholder || <div className="lazy-image-skeleton"></div>}
        </div>
      )}
      
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          {...props}
        />
      )}
      
      {hasError && (
        <div className="lazy-image-error">
          <span>Rasm yuklanmadi</span>
        </div>
      )}
    </div>
  )
}

export default LazyImage