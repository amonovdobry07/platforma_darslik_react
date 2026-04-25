import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuthStore()

  // Login bo'lmagan bo'lsa → Login sahifaga
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Agar rol cheklangan bo'lsa — tekshiramiz
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute