const API_BASE_URL = 'http://localhost:5000/api'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const getPlanner = async () => {
    const response = await fetch(`${API_BASE_URL}/planner`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch academic planner')
    return data
}

export const updateCourseStatus = async (courseCode, status) => {
    const response = await fetch(`${API_BASE_URL}/planner/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ courseCode, status })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to update course status')
    return data
}

export const updateCurrentSemester = async (currentSemester) => {
    const response = await fetch(`${API_BASE_URL}/planner/current-semester`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ currentSemester })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to update current semester')
    return data
}
