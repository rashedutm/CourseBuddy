const API_BASE_URL = 'http://localhost:5000/api'

// UC001 - Step 1: Get all academic sessions
export const getAcademicSessions = async () => {
    const response = await fetch(`${API_BASE_URL}/sessions`)
    if (!response.ok) throw new Error('Failed to fetch academic sessions')
    return response.json()
}

// UC001 - Step 2: Get intakes for a session
export const getIntakesBySession = async (academicSession) => {
    const response = await fetch(`${API_BASE_URL}/intakes?academicSession=${encodeURIComponent(academicSession)}`)
    if (!response.ok) throw new Error('Failed to fetch intakes')
    return response.json()
}

// UC001 - Step 3: Get semesters for an intake
export const getSemestersByIntake = async (intakeID) => {
    const response = await fetch(`${API_BASE_URL}/semesters?intakeID=${intakeID}`)
    if (!response.ok) throw new Error('Failed to fetch semesters')
    return response.json()
}

// UC001 - Step 4: Check handbook exists
export const checkHandbook = async (programmeID, intakeID, semesterNumber) => {
    const response = await fetch(`${API_BASE_URL}/handbook?programmeID=${programmeID}&intakeID=${intakeID}&semesterNumber=${semesterNumber}`)
    if (response.status === 404) {
        const data = await response.json()
        return { found: false, message: data.message }
    }
    if (!response.ok) throw new Error('Failed to check handbook')
    const data = await response.json()
    return { found: true, handbook: data }
}

// UC002 - Get available courses
export const getAvailableCourses = async (programmeID, intakeID, semesterNumber, academicYear) => {
    const response = await fetch(`${API_BASE_URL}/courses/available?programmeID=${programmeID}&intakeID=${intakeID}&semesterNumber=${semesterNumber}&academicYear=${encodeURIComponent(academicYear)}`)
    if (!response.ok) throw new Error('Failed to fetch available courses')
    return response.json()
}

// UC002 - Get free electives
export const getAvailableFreeElectives = async (programmeID, intakeID, semesterNumber, academicYear, studentID) => {
    const response = await fetch(`${API_BASE_URL}/courses/free-electives?programmeID=${programmeID}&intakeID=${intakeID}&semesterNumber=${semesterNumber}&academicYear=${encodeURIComponent(academicYear)}&studentID=${studentID}`)
    if (!response.ok) throw new Error('Failed to fetch free electives')
    return response.json()
}

// UC003 - Get prerequisite info
export const getPrerequisiteInfo = async (courseCode) => {
    const response = await fetch(`${API_BASE_URL}/courses/prerequisites?courseCode=${courseCode}`)
    if (!response.ok) throw new Error('Failed to fetch prerequisite info')
    return response.json()
}

// UC004 - Save selected courses
export const saveSelectedCourses = async (studentID, courseCodes, semesterID) => {
    const response = await fetch(`${API_BASE_URL}/courses/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentID, courseCodes, semesterID })
    })
    if (!response.ok) throw new Error('Failed to save selected courses')
    return response.json()
}

// UC005 - Generate clash free patterns
export const generatePatterns = async (studentID, semesterID, academicYear) => {
    const response = await fetch(`${API_BASE_URL}/patterns/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentID, semesterID, academicYear })
    })
    if (!response.ok) throw new Error('Failed to generate patterns')
    return response.json()
}

// UC007 - Save selected pattern
export const saveSelectedPattern = async (studentID, semesterID, sections) => {
    const response = await fetch(`${API_BASE_URL}/patterns/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentID, semesterID, sections })
    })
    if (!response.ok) throw new Error('Failed to save selected pattern')
    return response.json()
}

// UC009 - Get lecturers for courses
export const getLecturersForCourses = async (courseCodes, semesterNumber, intakeMonth, academicYear) => {
    const params = new URLSearchParams({
        courseCodes: courseCodes.join(','),
        semesterNumber,
        intakeMonth,
        academicYear
    })
    const response = await fetch(`${API_BASE_URL}/lecturers?${params}`)
    if (!response.ok) throw new Error('Failed to fetch lecturers')
    return response.json()
}

// UC012 - Reset lecturer preferences
export const resetLecturerPreferences = async (studentID) => {
    const response = await fetch(`${API_BASE_URL}/preferences/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentID })
    })
    if (!response.ok) throw new Error('Failed to reset preferences')
    return response.json()
}

// Get current running academic year from DB
export const getCurrentAcademicYear = async () => {
    const response = await fetch(`${API_BASE_URL}/current-academic-year`)
    if (!response.ok) throw new Error('Failed to fetch current academic year')
    return response.json()
}