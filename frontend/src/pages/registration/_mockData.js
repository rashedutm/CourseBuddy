// ============================================================
// TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
// ------------------------------------------------------------
// Shared mock data for the Student Registration subsystem (Zimly).
// It mimics the data structures produced by Rashed's pattern
// generation subsystem so these pages can be developed and tested
// in isolation, with no backend running.
//
//   MOCK_REGISTRATION_STATE -> shape of the React Router `location.state`
//                              handed off from the pattern-generation flow
//                              (patterns array + student/semester meta).
//   MOCK_ACTIVE_PATTERN     -> shape returned by getActivePattern(studentID)
//                              i.e. GET /api/patterns/active (one pattern =
//                              an array of section objects).
//   MOCK_SAVED_DRAFT        -> the object SaveDraftVault builds from that API.
//
// DELETE THIS WHOLE FILE when the real APIs are wired up. See each page's
// "// TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED" markers for the
// matching one-line reverts.
// ============================================================

export const MOCK_REGISTRATION_STATE = {
    studentID: 'A24CS4034',
    semesterID: 'SEM-2024-1-5',
    semesterNumber: 5,
    intakeMonth: 'October',
    academicSession: '2024/2025',
    intakeID: 'IN-2024-1',
    totalPatterns: 3,
    patterns: [
        [
            { courseCode: 'SCSE3143', sectionNumber: '01', courseName: 'Ubiquitous Computing', creditHours: 3, day: 'Mon', timeStart: '14:00:00', timeEnd: '17:00:00', lecturerName: 'Prof. Dr. Dayang Norhayati', venue: 'MPK10' },
            { courseCode: 'SCSE3103', sectionNumber: '01', courseName: 'Cognitive Computing', creditHours: 3, day: 'Wed', timeStart: '11:00:00', timeEnd: '13:00:00', lecturerName: 'Dr. Sim Hiew Moi', venue: 'N28a BT3' },
            { courseCode: 'SCSE3203', sectionNumber: '01', courseName: 'Special Topics', creditHours: 3, day: 'Mon', timeStart: '10:00:00', timeEnd: '13:00:00', lecturerName: 'Mr. Norizam bin Katmon', venue: 'MPK10' },
            { courseCode: 'UHLB3132', sectionNumber: '22', courseName: 'Professional Communication Skills', creditHours: 2, day: 'Tue', timeStart: '08:00:00', timeEnd: '10:00:00', lecturerName: 'TBA', venue: 'Online' },
        ],
        [
            { courseCode: 'SCSE3143', sectionNumber: '04', courseName: 'Ubiquitous Computing', creditHours: 3, day: 'Wed', timeStart: '14:00:00', timeEnd: '17:00:00', lecturerName: 'Prof. Dr. Dayang Norhayati', venue: 'MKP10' },
            { courseCode: 'SCSE3103', sectionNumber: '04', courseName: 'Cognitive Computing', creditHours: 3, day: 'Fri', timeStart: '10:00:00', timeEnd: '12:00:00', lecturerName: 'Dr. Sim Hiew Moi', venue: 'N28a BT3' },
            { courseCode: 'SCSE3203', sectionNumber: '04', courseName: 'Special Topics', creditHours: 3, day: 'Wed', timeStart: '08:00:00', timeEnd: '11:00:00', lecturerName: 'Mr. Norizam bin Katmon', venue: 'IDAL' },
        ],
        [
            { courseCode: 'SCSE3143', sectionNumber: '02', courseName: 'Ubiquitous Computing', creditHours: 3, day: 'Mon', timeStart: '14:00:00', timeEnd: '17:00:00', lecturerName: 'Dr. Muhammad Khatibsyarbini', venue: 'CCNA' },
            { courseCode: 'SCSE3103', sectionNumber: '02', courseName: 'Cognitive Computing', creditHours: 3, day: 'Wed', timeStart: '11:00:00', timeEnd: '13:00:00', lecturerName: 'Dr. Norsham binti Idris', venue: 'N28a BT5' },
            { courseCode: 'SCSE3203', sectionNumber: '02', courseName: 'Special Topics', creditHours: 3, day: 'Mon', timeStart: '10:00:00', timeEnd: '13:00:00', lecturerName: 'Dr. Nor Azizah binti Saadon', venue: 'ISTL' },
            { courseCode: 'UHLB3132', sectionNumber: '23', courseName: 'Professional Communication Skills', creditHours: 2, day: 'Tue', timeStart: '08:00:00', timeEnd: '10:00:00', lecturerName: 'TBA', venue: 'Online' },
            { courseCode: 'SCSE3243', sectionNumber: '01', courseName: 'Software Engineering', creditHours: 3, day: 'Thu', timeStart: '09:00:00', timeEnd: '12:00:00', lecturerName: 'Dr. Radziah binti Mohamad', venue: 'BK1' },
        ],
    ],
}

// One "active" saved pattern — the shape getActivePattern(studentID) returns.
export const MOCK_ACTIVE_PATTERN = MOCK_REGISTRATION_STATE.patterns[0]

// The draft object SaveDraftVault assembles from the API response.
export const MOCK_SAVED_DRAFT = {
    sections: MOCK_ACTIVE_PATTERN,
    credits: MOCK_ACTIVE_PATTERN.reduce((sum, s) => sum + (s.creditHours || 0), 0),
    name: 'Saved Blueprint — Sem 5',
}
