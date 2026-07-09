import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../services/authContext'

// Route guard: no session -> redirect to Login.
// Wrong role for this branch -> redirect to Access Denied, which performs
// the actual logout on mount (kept there so the user sees the message
// before their session is cleared, per the "Access Denied, then automatic
// logout" requirement).
function ProtectedRoute({ allowedRoles }) {
    const { token, role } = useAuth()
    const location = useLocation()

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (allowedRoles?.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/access-denied" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
