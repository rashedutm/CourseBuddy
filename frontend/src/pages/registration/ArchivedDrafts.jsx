import React from 'react'
import { useNavigate } from 'react-router-dom'
import MiniTimetableGrid from './MiniTimetableGrid'
import ConfirmDeleteButton from './ConfirmDeleteButton'
import { useRegistrationWorkspace } from './workspace/RegistrationWorkspaceContext'
import '../courses/courses.css'
import './registration.css'

function ArchivedDrafts() {
    const navigate = useNavigate()
    const { state, restorePattern, removeSavedPattern } = useRegistrationWorkspace()
    const archived = state.savedPatterns.filter((p) => p.archived)

    if (archived.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Archive</h1>
                </header>
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-box-archive"></i>
                    <span>Nothing archived yet. Archive a draft from the Draft Vault to see it here.</span>
                </div>
                <button className="btn outline" onClick={() => navigate('/registration/vault')}>
                    <i className="fas fa-box-archive"></i>
                    Go to Draft Vault
                </button>
            </div>
        )
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Archive</h1>
            </header>
            <div className="info-note" style={{ marginBottom: '20px' }}>
                <i className="fas fa-info-circle"></i>
                <p>{archived.length} archived draft{archived.length === 1 ? '' : 's'}. Restore one back to the Draft Vault, or delete it for good.</p>
            </div>

            <div className="patterns-grid">
                {archived.map((p) => (
                    <div key={p.id} className="pattern-card">
                        <div className="pattern-header">
                            <span className="pattern-number">{p.name}</span>
                        </div>

                        <MiniTimetableGrid pattern={p.sections} />

                        <div className="compare-stat-row">
                            <span>{p.sections.length} Courses</span>
                            <span>{p.credits} CH</span>
                            <span>{[...new Set(p.sections.map(s => s.day))].length} Days/Week</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="view-btn"
                                style={{ flex: 1, background: '#e8f8ee', color: '#22a559' }}
                                onClick={() => restorePattern(p.id)}
                            >
                                <i className="fas fa-rotate-left"></i>
                                Restore
                            </button>
                            <ConfirmDeleteButton onDelete={() => removeSavedPattern(p.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ArchivedDrafts
