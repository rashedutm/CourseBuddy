// Timetable admin service — talks to Yousra's timetable management API.
// UC034 Upload, UC035 View, UC036 Delete.
//
// Mounted under /api/admin (see backend/server.js).
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api/admin' : 'http://localhost:5000/api/admin'

// UC034: Upload a timetable Excel file. `formData` carries the file plus
// semesterNumber / intakeMonth / academicYear / facultyID / uploadedBy.
export const uploadTimetable = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/timetable/upload`, {
        method: 'POST',
        body: formData
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to upload timetable')
    }
    return response.json()
}

// UC035: Timetable rows for a specific semester/intake/year/faculty.
export const getTimetableData = async (semesterNumber, intakeMonth, academicYear, facultyID) => {
    const params = new URLSearchParams({ semesterNumber, intakeMonth, academicYear, facultyID })
    const response = await fetch(`${API_BASE_URL}/timetable?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to fetch timetable data')
    const data = await response.json()
    return data.data
}

// UC035: Semesters that have timetable data for a faculty (dropdown).
export const getAvailableSemesters = async (facultyID) => {
    const response = await fetch(`${API_BASE_URL}/timetable/semesters?facultyID=${encodeURIComponent(facultyID)}`)
    if (!response.ok) throw new Error('Failed to fetch available semesters')
    const data = await response.json()
    return data.data
}

// UC036: Delete timetable data for a specific semester.
export const deleteTimetable = async (semesterNumber, intakeMonth, academicYear, facultyID) => {
    const params = new URLSearchParams({ semesterNumber, intakeMonth, academicYear, facultyID })
    const response = await fetch(`${API_BASE_URL}/timetable/delete?${params.toString()}`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to delete timetable')
    }
    return response.json()
}
