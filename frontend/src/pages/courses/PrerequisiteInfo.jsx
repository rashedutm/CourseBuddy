import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getPrerequisiteInfo } from '../../services/courseService'
import './courses.css'

function PrerequisiteInfo() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        courseCode,
        courseName,
        creditHours,
        intakeID,
        semesterID,
        semesterNumber,
        academicSession,
        intakeMonth
    } = location.state || {}

    const [prerequisites, setPrerequisites] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!courseCode) {
            setErrorMessage('Course not found. Please go back.')
            setLoading(false)
            return
        }

        getPrerequisiteInfo(courseCode)
            .then(data => {
                setPrerequisites(data)
                setLoading(false)
            })
            .catch(err => {
                setErrorMessage('Unable to load prerequisite information at this time. Please try again later.')
                setLoading(false)
            })
    }, [courseCode])

    const handleBack = () => {
        navigate('/courses/available', {
            state: { intakeID, semesterID, semesterNumber, academicSession, intakeMonth }
        })
    }

    if (loading) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={handleBack}></i>
                    <h1>Prerequisite Info</h1>
                </header>
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading...</h2>
                    <p>Fetching prerequisite information.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={handleBack}></i>
                <h1>Prerequisite Info</h1>
            </header>
            <p className="subtitle">{courseName}</p>

            {/* Selected course card */}
            <div className="selected-course-card" style={{
                background: '#8b0000',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '25px',
                color: '#fff'
            }}>
                <p style={{ fontSize: '13px', opacity: '0.75', marginBottom: '6px' }}>Selected Course</p>
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{courseName}</h2>
                <p style={{ fontSize: '14px', opacity: '0.85' }}>{courseCode} &nbsp;•&nbsp; {creditHours} Credit Hours</p>
            </div>

            <p className="section-title" style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <i className="fas fa-sitemap" style={{ color: '#d4af37' }}></i>
                Prerequisite Requirements
            </p>

            {/* Error state */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* No prerequisite */}
            {!loading && !errorMessage && prerequisites.length === 0 && (
                <div style={{
                    background: '#e8f8ee',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    color: '#22a559'
                }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '28px' }}></i>
                    <p style={{ fontSize: '15px', fontWeight: '600' }}>This course has no prerequisite requirements.</p>
                </div>
            )}

            {/* Prerequisites list */}
            {prerequisites.map(prereq => (
                <div key={prereq.prerequisiteID} className="prereq-card">
                    <div className="prereq-header">
                        <span className="prereq-code">{prereq.prerequisiteCourseCode}</span>
                        <span className="mandatory-badge" style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '12px',
                            background: prereq.isMandatory ? '#fff3cd' : '#e8f8ee',
                            color: prereq.isMandatory ? '#856404' : '#22a559'
                        }}>
                            {prereq.isMandatory ? 'Mandatory' : 'Informational'}
                        </span>
                    </div>
                    <p className="prereq-name">{prereq.prerequisiteCourseName}</p>
                    <div className="prereq-info">
                        <span><i className="fas fa-clock"></i> {prereq.prerequisiteCreditHours} Credit Hours</span>
                    </div>
                </div>
            ))}

            {/* Info note */}
            {prerequisites.length > 0 && (
                <div className="info-note">
                    <i className="fas fa-circle-info"></i>
                    <p>Mandatory prerequisites must be completed before registering for this course. Informational prerequisites are recommended but not strictly enforced.</p>
                </div>
            )}

            <button className="btn primary" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i>
                Back to Courses
            </button>
        </div>
    )
}

export default PrerequisiteInfo
