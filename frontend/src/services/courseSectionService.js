// Course & Section admin service — talks to Yousra's course/section
// management API. UC037 View, UC038 Edit course, UC039 Edit section,
// UC040 Delete.
//
// Mounted under /api/admin (see backend/server.js) so /courses and /sections
// here don't collide with the student-facing /api/courses/* routes in
// courseRoutes.js.
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api/admin' : 'http://localhost:5000/api/admin'

// UC037: List courses, optionally filtered by faculty and a search term.
export const getCourses = async ({ facultyID, searchTerm } = {}) => {
    const params = new URLSearchParams()
    if (facultyID) params.append('facultyID', facultyID)
    if (searchTerm) params.append('searchTerm', searchTerm)
    const qs = params.toString()
    const response = await fetch(`${API_BASE_URL}/courses${qs ? `?${qs}` : ''}`)
    if (!response.ok) throw new Error('Failed to fetch courses')
    const data = await response.json()
    return data.data
}

// UC038: Get a single course by its code (returns null if not found).
export const getCourseByCode = async (courseCode) => {
    const response = await fetch(`${API_BASE_URL}/courses/${encodeURIComponent(courseCode)}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch course details')
    const data = await response.json()
    return data.data
}

// UC038: Update a course's editable fields.
export const updateCourse = async (courseCode, updates) => {
    const response = await fetch(`${API_BASE_URL}/courses/${encodeURIComponent(courseCode)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to update course')
    }
    return response.json()
}

// UC040: Delete a course by its code.
export const deleteCourse = async (courseCode) => {
    const response = await fetch(`${API_BASE_URL}/courses/${encodeURIComponent(courseCode)}`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to delete course')
    }
    return response.json()
}

// UC037: List sections, filtered by faculty/semester/intake/year/course.
export const getSections = async ({ facultyID, semesterNumber, intakeMonth, academicYear, courseCode } = {}) => {
    const params = new URLSearchParams()
    if (facultyID) params.append('facultyID', facultyID)
    if (semesterNumber) params.append('semesterNumber', semesterNumber)
    if (intakeMonth) params.append('intakeMonth', intakeMonth)
    if (academicYear) params.append('academicYear', academicYear)
    if (courseCode) params.append('courseCode', courseCode)
    const qs = params.toString()
    const response = await fetch(`${API_BASE_URL}/sections${qs ? `?${qs}` : ''}`)
    if (!response.ok) throw new Error('Failed to fetch sections')
    const data = await response.json()
    return data.data
}

// UC039: Sections for a specific course (semester/intake/year required).
export const getSectionsByCourse = async (courseCode, semesterNumber, intakeMonth, academicYear) => {
    const params = new URLSearchParams({ semesterNumber, intakeMonth, academicYear })
    const response = await fetch(`${API_BASE_URL}/sections/course/${encodeURIComponent(courseCode)}?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to fetch sections for course')
    const data = await response.json()
    return data.data
}

// UC039: Update a section's editable fields.
export const updateSection = async (sectionID, updates) => {
    const response = await fetch(`${API_BASE_URL}/sections/${encodeURIComponent(sectionID)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to update section')
    }
    return response.json()
}

// UC040: Delete a section by its ID.
export const deleteSection = async (sectionID) => {
    const response = await fetch(`${API_BASE_URL}/sections/${encodeURIComponent(sectionID)}`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to delete section')
    }
    return response.json()
}
