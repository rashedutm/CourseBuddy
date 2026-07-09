const API_BASE_URL = 'http://localhost:5000/api'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const getAllProgrammes = async () => {
    const response = await fetch(`${API_BASE_URL}/profile/programmes`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch programmes')
    return data
}

export const getProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/profile`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile')
    return data
}

export const submitInitialSetup = async (programmeID, intakeID) => {
    const response = await fetch(`${API_BASE_URL}/profile/initial-setup`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ programmeID, intakeID })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to complete academic setup')
    return data
}

export const updateFullName = async (fullName) => {
    const response = await fetch(`${API_BASE_URL}/profile/name`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ fullName })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to update name')
    return data
}

export const updateAcademicInfo = async (programmeID, intakeID) => {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ programmeID, intakeID })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to update profile')
    return data
}
