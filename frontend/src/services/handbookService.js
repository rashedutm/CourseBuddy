// Handbook admin service — talks to Yousra's handbook management API.
// UC031 Upload, UC032 View, UC033 Delete.
//
// The admin routes are mounted under /api/admin (see backend/server.js) to
// avoid colliding with the student-facing /api/handbook route used by
// courseService.checkHandbook.
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api/admin' : 'http://localhost:5000/api/admin'

// UC031: Upload a handbook Excel file. `formData` is a FormData instance
// carrying the file plus programmeID / intakeID / semesterNumber / uploadedBy.
export const uploadHandbook = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/handbook/upload`, {
        method: 'POST',
        body: formData
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to upload handbook')
    }
    return response.json()
}

// UC032: List of intake years available for the year dropdown.
export const getAvailableYears = async () => {
    const response = await fetch(`${API_BASE_URL}/handbook/years`)
    if (!response.ok) throw new Error('Failed to fetch available years')
    const data = await response.json()
    return data.data
}

// UC032: Months available for a given year.
export const getAvailableMonths = async (year) => {
    const response = await fetch(`${API_BASE_URL}/handbook/months?year=${encodeURIComponent(year)}`)
    if (!response.ok) throw new Error('Failed to fetch available months')
    const data = await response.json()
    return data.data
}

// UC032: Handbook rows for a specific intake (year + month).
export const getHandbookData = async (year, month) => {
    const response = await fetch(`${API_BASE_URL}/handbook?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`)
    if (response.status === 404) return []
    if (!response.ok) throw new Error('Failed to fetch handbook data')
    const data = await response.json()
    return data.data
}

// UC033: Delete all handbook data for an intake.
export const deleteHandbook = async (year, month) => {
    const response = await fetch(`${API_BASE_URL}/handbook/delete?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to delete handbook')
    }
    return response.json()
}
