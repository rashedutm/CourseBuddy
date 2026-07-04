import { useAuth } from '../services/authContext'

// Non-redirecting counterpart to ProtectedRoute — shows/hides a piece of UI
// based on role, without navigating away (e.g. an admin-only nav link).
function RoleGuard({ allow, children }) {
    const { role } = useAuth()
    if (!allow?.includes(role)) return null
    return children
}

export default RoleGuard
