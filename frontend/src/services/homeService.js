const API_BASE_URL = 'http://localhost:5000/api'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const getStudentDashboard = async () => {
    const response = await fetch(`${API_BASE_URL}/home/dashboard`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch dashboard')
    return data
}

export const getAdminDashboard = async () => {
    const response = await fetch(`${API_BASE_URL}/home/admin-dashboard`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch dashboard')
    return data
}

export const getAlerts = async () => {
    const response = await fetch(`${API_BASE_URL}/home/alerts`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch alerts')
    return data
}
