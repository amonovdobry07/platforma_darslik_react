import { Loader2 } from 'lucide-react'
import './Loading.css'

function Loading({ fullScreen = false, size = 40 }) {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loading-spinner">
        <Loader2 className="spinner" size={size} />
      </div>
    </div>
  )
}

export default Loading