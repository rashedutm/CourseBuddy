import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    getAcademicSessions,
    getIntakesBySession,
    getSemestersByIntake,
    checkHandbook
} from '../../services/courseService'
import './courses.css'

function SelectIntakeSemester() {
    const navigate = useNavigate()

    const [sessions, setSessions] = useState([])
    const [intakes, setIntakes] = useState([])
    const [semesters, setSemesters] = useState([])

    const [selectedSession, setSelectedSession] = useState(null)
    const [selectedIntake, setSelectedIntake] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [handbookInfo, setHandbookInfo] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const studentName = localStorage.getItem('studentName') || 'Student'

    // Placeholder structure — always visible before real data loads
    // These match the UTM structure: 2 intakes, 8 semesters
    const placeholderIntakes = [
        { intakeID: null, intakeNumber: 1, intakeMonth: 'October' },
        { intakeID: null, intakeNumber: 2, intakeMonth: 'March' }
    ]

    const placeholderSemesters = Array.from({ length: 8 }, (_, i) => ({
        semesterID: null,
        semesterNumber: i + 1,
        semesterName: `Year ${Math.ceil((i + 1) / 2)} Semester ${(i % 2) + 1}`
    }))

    // Load sessions on mount
    useEffect(() => {
        getAcademicSessions()
            .then(data => setSessions(data))
            .catch(err => setErrorMessage('Unable to load sessions: ' + err.message))
    }, [])

    // When session selected — load real intakes
    const handleSessionSelect = async (session) => {
        setSelectedSession(session)
        setSelectedIntake(null)
        setSelectedSemester(null)
        setIntakes([])
        setSemesters([])
        setHandbookInfo(null)
        setErrorMessage('')
        try {
            const data = await getIntakesBySession(session.academicSession)
            setIntakes(data)
        } catch (err) {
            setErrorMessage('Unable to load intakes: ' + err.message)
        }
    }

    // When intake selected — load real semesters
    const handleIntakeSelect = async (intake) => {
        if (!intake.intakeID) return // placeholder — not yet loaded
        setSelectedIntake(intake)
        setSelectedSemester(null)
        setSemesters([])
        setHandbookInfo(null)
        setErrorMessage('')
        try {
            const data = await getSemestersByIntake(intake.intakeID)
            setSemesters(data)
        } catch (err) {
            setErrorMessage('Unable to load semesters: ' + err.message)
        }
    }

    // When semester selected — check handbook
    const handleSemesterSelect = async (semester) => {
        if (!semester.semesterID) return // placeholder — not yet loaded
        setSelectedSemester(semester)
        setHandbookInfo(null)
        setErrorMessage('')
        setLoading(true)

        const programmeID = localStorage.getItem('programmeID')
        if (!programmeID) {
            setErrorMessage('Programme not found. Please update your profile first.')
            setLoading(false)
            return
        }

        try {
            const result = await checkHandbook(programmeID, selectedIntake.intakeID, semester.semesterNumber)
            if (!result.found) {
                setHandbookInfo(null)
                setErrorMessage(result.message)
            } else {
                setHandbookInfo(result.handbook)
            }
        } catch (err) {
            setErrorMessage('Something went wrong: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleViewCourses = () => {
        navigate('/courses/available', {
            state: {
                intakeID: selectedIntake.intakeID,
                semesterID: selectedSemester.semesterID,
                semesterNumber: selectedSemester.semesterNumber,
                academicSession: selectedSession.academicSession,
                intakeMonth: selectedIntake.intakeMonth
            }
        })
    }

    // Use real data if loaded, otherwise show placeholders
        const displayIntakes = !selectedSession ? placeholderIntakes : intakes
        const displaySemesters = !selectedIntake ? placeholderSemesters : semesters

    const intakesActive = selectedSession !== null
    const semestersActive = selectedIntake !== null

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Course Selection</h1>
            </header>

            <div className="welcome-card">
                <h2>Welcome, {studentName}</h2>
                <p>Select your academic session, intake and semester to view available courses.</p>
            </div>

            {/* Step 1 — Academic Session */}
            <div className="section">
                <label>Select Academic Session</label>
                <div className="chips">
                    {sessions.length === 0 && (
                        <p style={{ color: '#aaa', fontSize: '14px' }}>Loading...</p>
                    )}
                    {sessions.map(session => (
                        <button
                            key={session.academicSession}
                            className={selectedSession?.academicSession === session.academicSession ? 'active' : ''}
                            onClick={() => handleSessionSelect(session)}
                        >
                            {session.academicSession}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 2 — Intake — always visible, greyed until session selected */}
            <div className="section">
                <label>Select Intake</label>
                <div className="chips">
                    {displayIntakes.map((intake, index) => (
                        <button
                            key={intake.intakeID || index}
                            className={selectedIntake?.intakeID === intake.intakeID && intake.intakeID ? 'active' : ''}
                            onClick={() => intakesActive && handleIntakeSelect(intake)}
                            style={{
                                opacity: intakesActive ? 1 : 0.35,
                                cursor: intakesActive ? 'pointer' : 'default',
                                pointerEvents: intakesActive ? 'auto' : 'none'
                            }}
                        >
                            {intake.intakeNumber} — {intake.intakeMonth}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step 3 — Semester — always visible, greyed until intake selected */}
            <div className="section">
                <label>Select Semester</label>
                <div className="chips">
                    {displaySemesters.map((sem, index) => (
                        <button
                            key={sem.semesterID || index}
                            className={selectedSemester?.semesterID === sem.semesterID && sem.semesterID ? 'active' : ''}
                            onClick={() => semestersActive && handleSemesterSelect(sem)}
                            style={{
                                opacity: semestersActive ? 1 : 0.35,
                                cursor: semestersActive ? 'pointer' : 'default',
                                pointerEvents: semestersActive ? 'auto' : 'none'
                            }}
                        >
                            Sem {sem.semesterNumber}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="info-card">
                    <p>Checking handbook data...</p>
                </div>
            )}

            {/* Handbook confirmed */}
            {handbookInfo && !loading && (
                <div className="info-card">
                    <h3>Handbook Info</h3>
                    <div className="info-row">
                        <span>Academic Session</span>
                        <strong>{selectedSession.academicSession}</strong>
                    </div>
                    <div className="info-row">
                        <span>Intake</span>
                        <strong>{selectedIntake.intakeMonth}</strong>
                    </div>
                    <div className="info-row">
                        <span>Semester</span>
                        <strong>{selectedSemester.semesterName}</strong>
                    </div>
                </div>
            )}

            {/* Error */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Button */}
            <button
                className="btn primary"
                disabled={!handbookInfo}
                onClick={handleViewCourses}
            >
                <i className="fas fa-arrow-right"></i>
                View Available Courses
            </button>
        </div>
    )
}

export default SelectIntakeSemester