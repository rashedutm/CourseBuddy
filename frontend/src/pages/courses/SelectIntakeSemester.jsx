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

    // Step 1 — Load academic sessions when page opens
    useEffect(() => {
        getAcademicSessions()
            .then(data => setSessions(data))
            .catch(err => setErrorMessage('Unable to load sessions: ' + err.message))
    }, [])

    // Step 2 — When student selects a session, load its intakes
    const handleSessionSelect = async (session) => {
        setSelectedSession(session)
        setSelectedIntake(null)
        setSelectedSemester(null)
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

    // Step 3 — When student selects an intake, load its semesters
    const handleIntakeSelect = async (intake) => {
        setSelectedIntake(intake)
        setSelectedSemester(null)
        setHandbookInfo(null)
        setErrorMessage('')
        try {
            const data = await getSemestersByIntake(intake.intakeID)
            setSemesters(data)
        } catch (err) {
            setErrorMessage('Unable to load semesters: ' + err.message)
        }
    }

    // Step 4 — When student selects a semester, check handbook
    const handleSemesterSelect = async (semester) => {
        setSelectedSemester(semester)
        setHandbookInfo(null)
        setErrorMessage('')
        setLoading(true)

        // Get student's programmeID from localStorage
        // This is set during login/profile setup
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

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Course Selection</h1>
            </header>

            <div className="welcome-card">
                <h2>Welcome, {localStorage.getItem('studentName') || 'Student'}</h2>
                <p>Select your academic session, intake and semester to view available courses.</p>
            </div>

            {/* Step 1 — Academic Session */}
            <div className="section">
                <label>Select Academic Session</label>
                <div className="chips">
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

            {/* Step 2 — Intake */}
            {selectedSession && intakes.length > 0 && (
                <div className="section">
                    <label>Select Intake</label>
                    <div className="chips">
                        {intakes.map(intake => (
                            <button
                                key={intake.intakeID}
                                className={selectedIntake?.intakeID === intake.intakeID ? 'active' : ''}
                                onClick={() => handleIntakeSelect(intake)}
                            >
                                {intake.intakeNumber} — {intake.intakeMonth}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 3 — Semester */}
            {selectedIntake && semesters.length > 0 && (
                <div className="section">
                    <label>Select Semester</label>
                    <div className="chips">
                        {semesters.map(sem => (
                            <button
                                key={sem.semesterID}
                                className={selectedSemester?.semesterID === sem.semesterID ? 'active' : ''}
                                onClick={() => handleSemesterSelect(sem)}
                            >
                                Sem {sem.semesterNumber}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="info-card">
                    <p>Checking handbook data...</p>
                </div>
            )}

            {/* Handbook info card */}
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

            {/* Error state */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Proceed button */}
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
