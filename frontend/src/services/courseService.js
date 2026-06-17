const API_BASE_URL = 'http://localhost:5000/api'

export const getIntakes = async () => {
    const response = await fetch(`${API_BASE_URL}/intakes`)
    if (!response.ok) {
        throw new Error('Failed to fetch intakes')
    }
    return response.json()
}

export const getSemesters = async (intakeID) => {
    const response = await fetch(`${API_BASE_URL}/semesters?intakeID=${intakeID}`)
    if (!response.ok) {
        throw new Error('Failed to fetch semesters')
    }
    return response.json()
}

export const checkHandbook = async (intakeID, semesterID) => {
    const response = await fetch(`${API_BASE_URL}/handbook?intakeID=${intakeID}&semesterID=${semesterID}`)
    if (response.status === 404) {
        const data = await response.json()
        return { found: false, message: data.message }
    }
    if (!response.ok) {
        throw new Error('Failed to check handbook')
    }
    const data = await response.json()
    return { found: true, handbook: data }
}