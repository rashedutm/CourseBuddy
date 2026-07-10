// Local fallback for ViewHandbookData when the backend returns no rows.
//
// The handbook data is authoritative in the database (served via
// handbookService.getHandbookData). This module only exists so the View
// page has a graceful client-side fallback instead of crashing when the
// API is unreachable or empty. There is no seeded offline dataset here, so
// getIntakeData returns null (the page then shows its "no data" message).
//
// To ship an offline snapshot later, populate INTAKE_DATA keyed by
// `${year}-${month}` with { intakeName, academicSession, courses: [...] }.

const INTAKE_DATA = {
    // '2024-October': {
    //   intakeName: 'October 2024 Intake',
    //   academicSession: '2024/2025',
    //   courses: [{ courseCode, courseName, creditHours, semesterNumber }, ...]
    // }
}

const keyFor = (year, month) => `${year}-${month}`

// Returns the intake record for a year+month, or null if none is bundled.
export const getIntakeData = (year, month) => {
    return INTAKE_DATA[keyFor(year, month)] || null
}

// Returns courses grouped by semesterNumber for a year+month, or {} if none.
export const getCoursesGroupedBySemester = (year, month) => {
    const intake = getIntakeData(year, month)
    if (!intake || !Array.isArray(intake.courses)) return {}

    return intake.courses.reduce((grouped, course) => {
        const semester = course.semesterNumber
        if (!grouped[semester]) grouped[semester] = []
        grouped[semester].push(course)
        return grouped
    }, {})
}
