import React, { createContext, useContext, useState, useCallback } from 'react'
import { logoutUser } from './authService'

// Thin reactive wrapper around the existing localStorage session keys.
// It does NOT replace them — teammate pages (AvailableCourses.jsx,
// SelectCourses.jsx, SelectIntakeSemester.jsx) read studentID/programmeID/etc
// directly from localStorage with no abstraction layer, so those keys must
// keep being written exactly as Login.jsx already does.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [role, setRole] = useState(() => localStorage.getItem('role'))

    const login = useCallback((loginResult) => {
        setToken(loginResult.token)
        setRole(loginResult.role)
    }, [])

    const logout = useCallback(async () => {
        try {
            await logoutUser()
        } catch (err) {
            // Best-effort — still clear the local session even if the
            // backend call fails (e.g. token already expired).
        }
        localStorage.clear()
        setToken(null)
        setRole(null)
    }, [])

    const value = { token, role, login, logout, isAuthenticated: !!token }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
