import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { generatePatterns } from '../../services/courseService'
import './courses.css'

function GeneratePatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        selectedCodes = []
    } = location.state || {}

    const academicYear = academicSession
        ? `${academicSession}-${intakeMonth === 'October' ? '1' : '2'}`
        : null

    const [status, setStatus] = useState('generating') // generating | success | error
    const [totalPatterns, setTotalPatterns] = useState(0)
    const [patterns, setPatterns] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!studentID || !semesterID || !academicYear) {
            setStatus('error')
            setErrorMessage('Missing required data. Please go back and try again.')
            return
        }

        generatePatterns(studentID, semesterID, academicYear)
            .then(data => {
                setTotalPatterns(data.totalPatterns)
                setPatterns(data.patterns)
                setStatus('success')
            })
            .catch(err => {
                setStatus('error')
                setErrorMessage(err.message || 'Unable to generate patterns at this time. Please try again later.')
            })
    }, [studentID, semesterID, academicYear])

    const handleViewPatterns = () => {
        navigate('/courses/patterns', {
            state: {
                patterns,
                totalPatterns,
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID
            }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Generate Patterns</h1>
            </header>
            <p className="subtitle">{academicSession} — {intakeMonth} Intake — Sem {semesterNumber}</p>

            {/* Selected courses summary */}
            <div className="summary-card">
                <h3>Selected Courses ({selectedCodes.length})</h3>
                {selectedCodes.map(code => (
                    <span key={code} className="course-pill">{code}</span>
                ))}
            </div>

            {/* Generating state */}
            {status === 'generating' && (
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Generating Patterns...</h2>
                    <p>Checking all section combinations for time conflicts. Please wait.</p>
                </div>
            )}

            {/* Success state */}
            {status === 'success' && (
                <div className="result-card" style={{ display: 'block' }}>
                    <div className="result-header">
                        <h3>Generation Complete</h3>
                        <span className="result-badge">{totalPatterns} Patterns Found</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
                    <div className="result-row">
                        <span>Courses Processed</span>
                        <strong>{selectedCodes.length} Courses</strong>
                    </div>
                    <div className="result-row">
                        <span>Clash Free Patterns</span>
                        <strong>{totalPatterns} Patterns</strong>
                    </div>
                </div>
            )}

            {/* Error / no pattern state */}
            {status === 'error' && (
                <div className="no-pattern-card" style={{ display: 'block' }}>
                    <i className="fas fa-circle-xmark"></i>
                    <h3>No Clash Free Pattern Found</h3>
                    <p>{errorMessage}</p>
                </div>
            )}

            {status === 'success' && (
                <button className="btn primary" onClick={handleViewPatterns}>
                    <i className="fas fa-list"></i>
                    View Generated Patterns
                </button>
            )}

            <button className="btn outline" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
                Back to Course Selection
            </button>
        </div>
    )
}

export default GeneratePatterns
