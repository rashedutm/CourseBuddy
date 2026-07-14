import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetLecturerPreferences } from '../../services/courseService'
import './courses.css'

function ResetPreference() {
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
        lecturerPreferences = {},
        selectedCodes = [],
        academicYear
    } = location.state || {}

    const [status, setStatus] = useState('idle') // idle | confirm | resetting | error
    const [errorMessage, setErrorMessage] = useState('')

    // An unset course is stored as null/'' — those don't count as a preference.
    const hasPreferences = Object.values(lecturerPreferences).some(v => v !== null && v !== undefined && v !== '')

    const handleResetClick = () => {
        if (!hasPreferences) {
            setErrorMessage('You have no lecturer preferences set at the moment. Please set your preferences first before attempting to reset.')
            return
        }
        setStatus('confirm')
    }

    // `patterns` here is the unfiltered set, so clearing the preferences just means
    // handing it straight back with an empty preference map — no regeneration
    // needed. Go back to the pattern list right away rather than parking the user
    // on a page that still shows the reset warning.
    const handleConfirmReset = async () => {
        setStatus('resetting')
        try {
            await resetLecturerPreferences(studentID)
            navigate('/courses/patterns', {
                state: {
                    patterns,
                    totalPatterns: patterns.length,
                    allPatterns: patterns,
                    preferences: {},
                    preferenceApplied: false,
                    noPreferenceMatch: false,
                    preferenceReset: true,
                    studentID,
                    semesterID,
                    semesterNumber,
                    intakeMonth,
                    academicSession,
                    intakeID,
                    selectedCodes,
                    academicYear
                }
            })
        } catch (err) {
            setStatus('error')
            setErrorMessage('Unable to reset your lecturer preferences at this time. Please try again later.')
        }
    }

    const handleCancel = () => {
        setStatus('idle')
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Reset Preferences</h1>
            </header>
            <p className="subtitle">Clear all lecturer preferences</p>

            {/* Current preferences */}
            <div className="current-pref-card">
                <h3><i className="fas fa-sliders"></i> Current Preferences</h3>
                {Object.entries(lecturerPreferences).map(([code, lecID]) => (
                    <div key={code} className="pref-item">
                        <span className="course" style={{ fontWeight: '600', color: '#333' }}>{code}</span>
                        {lecID
                            ? <span style={{ color: '#8b0000', fontSize: '13px' }}>Preference set</span>
                            : <span style={{ color: '#aaa', fontSize: '13px', fontStyle: 'italic' }}>Not set — all sections</span>
                        }
                    </div>
                ))}
                {Object.keys(lecturerPreferences).length === 0 && (
                    <p style={{ color: '#aaa', fontSize: '14px' }}>No preferences currently set.</p>
                )}
            </div>

            {/* Error state */}
            {errorMessage && (
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-circle-exclamation"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            <button className="btn danger" onClick={handleResetClick} disabled={status === 'resetting'}>
                <i className="fas fa-rotate-left"></i>
                {status === 'resetting' ? 'Resetting...' : 'Reset All Preferences'}
            </button>

            <button className="btn outline" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left"></i>
                Back
            </button>

            {/* Confirmation modal */}
            {status === 'confirm' && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-icon"><i className="fas fa-rotate-left"></i></div>
                        <h2>Reset All Preferences?</h2>
                        <p>Are you sure you want to reset all your lecturer preferences? This will clear all your current selections.</p>
                        <button className="btn primary" onClick={handleConfirmReset}>
                            <i className="fas fa-check"></i>
                            Confirm Reset
                        </button>
                        <button className="btn outline" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResetPreference
