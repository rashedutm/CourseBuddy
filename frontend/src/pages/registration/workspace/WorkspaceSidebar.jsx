import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useRegistrationWorkspace, MAX_SAVED_PATTERNS } from './RegistrationWorkspaceContext'
import { sumCredits } from './scheduleUtils'

const NAV_ITEMS = [
    { to: '/registration/filter', icon: 'fas fa-compass', label: 'Explore' },
    { to: '/registration/compare', icon: 'fas fa-scale-balanced', label: 'Compare' },
]

function SavePatternForm({ onSave, full }) {
    const [naming, setNaming] = useState(false)
    const [name, setName] = useState('')

    if (full) {
        return (
            <div className="workspace-vault-full">
                <i className="fas fa-circle-exclamation"></i> Vault full ({MAX_SAVED_PATTERNS}/{MAX_SAVED_PATTERNS}) — remove one to save
            </div>
        )
    }

    if (!naming) {
        return (
            <button className="workspace-save-btn" onClick={() => setNaming(true)}>
                <i className="fas fa-bookmark"></i> Save Current as Routine
            </button>
        )
    }

    return (
        <div className="workspace-save-form">
            <input
                autoFocus
                placeholder="Routine name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && (onSave(name.trim()), setNaming(false), setName(''))}
            />
            <button
                disabled={!name.trim()}
                onClick={() => { onSave(name.trim()); setNaming(false); setName('') }}
            >
                <i className="fas fa-check"></i>
            </button>
            <button onClick={() => { setNaming(false); setName('') }}>
                <i className="fas fa-xmark"></i>
            </button>
        </div>
    )
}

function WorkspaceSidebar() {
    const navigate = useNavigate()
    const { state, savePattern, removeSavedPattern, loadSavedPattern } = useRegistrationWorkspace()
    const { currentGoal, savedPatterns, meta } = state
    const goalCredits = sumCredits(currentGoal.sections)

    const handleLoad = (id) => {
        loadSavedPattern(id)
        navigate('/registration/routine')
    }

    return (
        <aside className="workspace-sidebar">
            <div className="workspace-brand">CourseBuddy</div>
            {meta.academicSession && (
                <div className="workspace-meta">{meta.academicSession} — Sem {meta.semesterNumber}</div>
            )}

            <nav className="workspace-nav">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `workspace-nav-link ${isActive ? 'active' : ''}`}
                    >
                        <i className={item.icon}></i>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="workspace-section-title">Current Routine</div>
            <div
                className="workspace-goal-card"
                style={{ cursor: currentGoal.sections.length > 0 ? 'pointer' : 'default' }}
                onClick={() => currentGoal.sections.length > 0 && navigate('/registration/routine')}
            >
                <div className="value">{currentGoal.sections.length}</div>
                <div className="label">Courses</div>
                <div className="workspace-goal-secondary">{goalCredits} Credits</div>
            </div>
            <SavePatternForm
                onSave={(name) => savePattern(name, currentGoal.sections)}
                full={savedPatterns.length >= MAX_SAVED_PATTERNS}
            />

            <div className="workspace-section-title" style={{ marginTop: '20px' }}>
                Saved Routines ({savedPatterns.length}/{MAX_SAVED_PATTERNS})
            </div>
            {savedPatterns.length === 0 ? (
                <p className="workspace-empty-note">No saved routines yet.</p>
            ) : (
                <div className="workspace-saved-list">
                    {savedPatterns.map((p) => (
                        <div key={p.id} className="workspace-saved-item">
                            <div className="workspace-saved-info">
                                <span className="name">{p.name}</span>
                                <span className="meta">{p.sections.length} courses • {p.credits} CH</span>
                            </div>
                            <div className="workspace-saved-actions">
                                <button title="Open this routine" onClick={() => handleLoad(p.id)}>
                                    <i className="fas fa-arrow-rotate-left"></i>
                                </button>
                                <button title="Delete" onClick={() => removeSavedPattern(p.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    )
}

export default WorkspaceSidebar
