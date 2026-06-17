import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIntakes, getSemesters, checkHandbook } from '../../services/courseService'
import './courses.css'

function SelectIntakeSemester() {
    const navigate = useNavigate()

    const [intakes, setIntakes] = useState([])
    const [semesters, setSemesters] = useState([])
    const [selectedIntake, setSelectedIntake] = useState(null)
    const [selectedSemester, setSelectedSemester] = useState(null)
    const [handbookInfo, setHandbookInfo] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Load intakes when page first opens
    useEffect(() => {
        getIntakes()
            .then(data => setIntakes(data))
            .catch(err => setErrorMessage('Unable to load intakes: ' + err.message))
    }, [])

    // When student selects an intake, load its semesters
    const handleIntakeSelect = async (intake) => {
        setSelectedIntake(intake)
        setSelectedSemester(null)
        setHandbookInfo(null)
        setErrorMessage('')
        try {
            const data = await getSemesters(intake.intakeID)
            setSemesters(data)
        } catch (err) {
            setErrorMessage('Unable to load semesters: ' + err.message)
        }
    }

    // When student selects a semester, check if handbook exists (UC001 main flow)
    const handleSemesterSelect = async (semester) => {
        setSelectedSemester(semester)
        setErrorMessage('')
        setLoading(true)
        try {
            const result = await checkHandbook(selectedIntake.intakeID, semester.semesterID)
            if (!result.found) {
                // A1 alternate flow
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
                semesterID: selectedSemester.semesterID
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
                <h2>Welcome, Ahmad Rashed</h2>
                <p>Select your intake and semester to view available courses for this registration period.</p>
            </div>

            <div className="section">
                <label>Select Intake</label>
                <div className="chips">
                    {intakes.map(intake => (
                        <button
                            key={intake.intakeID}
                            className={selectedIntake?.intakeID === intake.intakeID ? 'active' : ''}
                            onClick={() => handleIntakeSelect(intake)}
                        >
                            {intake.intakeMonth}
                        </button>
                    ))}
                </div>
            </div>

            {selectedIntake && (
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

            {loading && <p>Checking handbook data...</p>}

            {handbookInfo && (
                <div className="info-card">
                    <h3>Handbook Info</h3>
                    <div className="info-row">
                        <span>Intake</span>
                        <strong>{selectedIntake.intakeName}</strong>
                    </div>
                    <div className="info-row">
                        <span>Semester</span>
                        <strong>{selectedSemester.semesterName}</strong>
                    </div>
                    <div className="info-row">
                        <span>Last Updated</span>
                        <strong>{handbookInfo.uploadDate}</strong>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

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
