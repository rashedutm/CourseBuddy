import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getActivePattern } from '../../services/courseService'
import '../courses/courses.css'
import './registration.css'

function SaveDraftVault() {
    const navigate = useNavigate()
    const location = useLocation()

    const {
        selectedPattern,
        patternIndex,
        patterns,
        totalPatterns,
        studentID,
        semesterID,
        semesterNumber,
        intakeMonth,
        academicSession,
        intakeID
    } = location.state || {}

    const [savedDraft, setSavedDraft] = useState(null)
    const [loading, setLoading] = useState(!!studentID)

    useEffect(() => {
        if (!studentID) { setLoading(false); return }
        getActivePattern(studentID)
            .then(data => {
                const sections = Array.isArray(data) ? data : []
                if (sections.length > 0) {
                    const credits = sections.reduce((s, p) => s + (p.creditHours || 0), 0)
                    setSavedDraft({ sections, credits, name: `Saved Blueprint — Sem ${semesterNumber}` })
                }
            })
            .catch(() => setSavedDraft(null))
            .finally(() => setLoading(false))
    }, [studentID, semesterNumber])

    const navState = { patterns, totalPatterns, studentID, semesterID, semesterNumber, intakeMonth, academicSession, intakeID }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Draft Vault</h1>
            </header>
            <p className="subtitle">Your saved registration blueprints</p>

            <div className="info-note">
                <i className="fas fa-vault"></i>
                <p>Blueprints saved here are your registration plans. Activate one to generate the final report and proceed to register on the UTM portal.</p>
            </div>

            {/* Current pattern passed in from navigation */}
            {selectedPattern && selectedPattern.length > 0 && (
                <div className="result-card" style={{ display: 'block' }}>
                    <div className="result-header">
                        <h3>Current Blueprint — Pattern {(patternIndex ?? 0) + 1}</h3>
                        <span className="result-badge">
                            {selectedPattern.reduce((s, p) => s + (p.creditHours || 0), 0)} Credits
                        </span>
                    </div>
                    {selectedPattern.map((s, i) => (
                        <div key={i} className="result-row">
                            <span>{s.courseCode}</span>
                            <strong>S{s.sectionNumber} • {s.day} {s.timeStart?.slice(0, 5)}</strong>
                        </div>
                    ))}
                    <button
                        className="btn primary"
                        style={{ marginTop: '16px', marginBottom: '0' }}
                        onClick={() => navigate('/registration/report', {
                            state: { selectedPattern, patternIndex, ...navState }
                        })}
                    >
                        <i className="fas fa-file-lines"></i>
                        Generate Report for This Blueprint
                    </button>
                </div>
            )}

            {/* Saved drafts from backend */}
            <div className="section" style={{ marginTop: selectedPattern?.length > 0 ? '10px' : '0' }}>
                <label>Saved from Vault</label>
            </div>

            {loading ? (
                <div className="generating-card">
                    <div className="spinner"></div>
                    <h2>Loading Saved Blueprints...</h2>
                    <p>Fetching your previous plans from the server.</p>
                </div>
            ) : savedDraft ? (
                <div className="draft-card">
                    <div className="draft-info">
                        <h4>{savedDraft.name}</h4>
                        <p>{savedDraft.sections.length} Courses • {savedDraft.credits} Credit Hours</p>
                        <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                            <i className="fas fa-circle-check" style={{ color: '#22a559', marginRight: '4px' }}></i>
                            Active Blueprint
                        </p>
                    </div>
                    <div className="draft-actions">
                        <button
                            className="draft-btn activate"
                            onClick={() => navigate('/registration/report', {
                                state: { selectedPattern: savedDraft.sections, patternIndex: 0, ...navState }
                            })}
                        >
                            <i className="fas fa-play"></i> Activate
                        </button>
                        <button
                            className="draft-btn"
                            style={{ background: '#fdf0f0', color: '#8b0000', border: '1px solid #f5c6c6' }}
                            onClick={() => navigate('/registration/select-final', {
                                state: { selectedPattern: savedDraft.sections, patternIndex: 0, ...navState }
                            })}
                        >
                            View
                        </button>
                    </div>
                </div>
            ) : (
                <div className="no-pref-card">
                    <i className="fas fa-vault" style={{ fontSize: '36px', color: '#aaa', display: 'block', marginBottom: '12px' }}></i>
                    <p>No saved blueprints found. Go back and select a pattern to save it here.</p>
                </div>
            )}

            <div className="sticky-bottom">
                <button className="btn outline" onClick={() => navigate('/registration/filter', { state: navState })}>
                    <i className="fas fa-filter"></i>
                    Back to Pattern Filter
                </button>
            </div>
        </div>
    )
}

export default SaveDraftVault
