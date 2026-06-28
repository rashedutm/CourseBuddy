import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './courses.css'

function GenerateWithoutPref() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID,
        patterns = [],
        totalPatterns
    } = location.state || {}

    const [confirmed, setConfirmed] = useState(false)

    const handleConfirm = () => {
        setConfirmed(true)
        // Navigate to view all patterns without any preference filter
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

    const handleGoBack = () => {
        navigate('/courses/lecturer-preference', {
            state: {
                studentID,
                semesterID,
                semesterNumber,
                intakeMonth,
                academicSession,
                intakeID,
                patterns,
                totalPatterns
            }
        })
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>No Pattern Found</h1>
            </header>
            <p className="subtitle">Lecturer preference could not be satisfied</p>

            <div className="notification-card">
                <i className="fas fa-triangle-exclamation"></i>
                <h2>No Clash Free Pattern Found</h2>
                <p>No clash free pattern could be found with your selected lecturer preferences. Would you like to generate patterns without lecturer preference?</p>
            </div>

            <button className="btn primary" onClick={handleConfirm} disabled={confirmed}>
                <i className="fas fa-wand-magic-sparkles"></i>
                Yes, Generate Without Preference
            </button>
            <button className="btn outline" onClick={handleGoBack}>
                <i className="fas fa-sliders"></i>
                No, Go Back to Preferences
            </button>
        </div>
    )
}

export default GenerateWithoutPref
