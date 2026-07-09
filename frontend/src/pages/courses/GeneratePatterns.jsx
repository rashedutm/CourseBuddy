import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './courses.css'

// GeneratePatterns is now just a loading transition page
// Actual generation happens in SelectCourses.jsx
// This page shows while navigating to ViewPatterns

function GeneratePatterns() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // If somehow landed here without state, go back
        if (!location.state) {
            navigate(-1)
        }
    }, [location.state, navigate])

    return (
        <div className="container">
            <div className="generating-card" style={{ marginTop: '60px' }}>
                <div className="spinner"></div>
                <h2>Generating Patterns...</h2>
                <p>Checking all section combinations for time conflicts. Please wait.</p>
            </div>
        </div>
    )
}

export default GeneratePatterns
