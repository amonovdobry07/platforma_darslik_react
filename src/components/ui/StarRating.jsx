import { Star } from 'lucide-react'
import './StarRating.css'

function StarRating({ rating, size = 16, interactive = false, onChange }) {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive
          ? star <= (hoverRating || rating)
          : star <= rating

        return (
          <button
            key={star}
            type="button"
            className={`star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
          >
            <Star size={size} fill={filled ? 'currentColor' : 'none'} />
          </button>
        )
      })}
    </div>
  )
}

// useState kerak
import { useState } from 'react'
export default StarRating