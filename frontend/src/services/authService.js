const API_BASE_URL = 'http://localhost:5000/api'

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to sign in')
    return data
}

export const registerUser = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to register')
    return data
}

export const logoutUser = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to log out')
    return data
}

export const requestPasswordReset = async (email) => {
    const response = await fetch(`${API_BASE_URL}/reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to request password reset')
    return data
}

export const verifyResetCode = async (email, code) => {
    const response = await fetch(`${API_BASE_URL}/reset/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Invalid verification code')
    return data
}

export const confirmPasswordReset = async (resetToken, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to reset password')
    return data
}
