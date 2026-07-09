import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MiniTimetableGrid from './MiniTimetableGrid'
import { useRegistrationWorkspace, MAX_COMPARE_PATTERNS } from './workspace/RegistrationWorkspaceContext'
import '../courses/courses.css'
import './registration.css'

function EditableName({ name, onRename }) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(name)

    const commit = () => {
        const trimmed = value.trim()
        if (trimmed && trimmed !== name) onRename(trimmed)
        else setValue(name)
        setEditing(false)
    }

    if (editing) {
        return (
            <input
                autoFocus
                className="vault-name-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') commit()
                    if (e.key === 'Escape') { setValue(name); setEditing(false) }
                }}
                onClick={(e) => e.stopPropagation()}
            />
        )
    }
    return (
        <span className="vault-name-display" title="Click to rename" onClick={() => setEditing(true)}>
            {name} <i className="fas fa-pen"></i>
        </span>
    )
}

function DraftCard({ p, starred, isChecked, onToggleCompare, onTogglePriority, onLoad, onArchive, onRemove, onRename, onComment }) {
    const [commentOpen, setCommentOpen] = useState(false)
    const [commentValue, setCommentValue] = useState(p.comment || '')
    const [pendingDelete, setPendingDelete] = useState(false)

    const commitComment = () => {
        onComment(commentValue.trim())
        setCommentOpen(false)
    }

    const cancelComment = () => {
        setCommentValue(p.comment || '')
        setCommentOpen(false)
    }

    return (
        <div className={`pattern-card ${isChecked ? 'selected-pattern' : ''}`}>
            <div className="pattern-header">
                <span className="pattern-number">
                    {starred && <i className="fas fa-star star-badge" title="Starred"></i>}
                    <EditableName name={p.name} onRename={onRename} />
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <label className="vault-compare-label">
                        <input type="checkbox" checked={isChecked} onChange={onToggleCompare} />
                        Compare
                    </label>
                    {pendingDelete ? (
                        <>
                            <button
                                className="compare-remove-btn"
                                title="Confirm delete"
                                onClick={onRemove}
                                style={{ background: '#fdecea', color: '#dc2626' }}
                            >
                                <i className="fas fa-check"></i>
                            </button>
                            <button
                                className="compare-remove-btn"
                                title="Cancel"
                                onClick={() => setPendingDelete(false)}
                            >
                                <i className="fas fa-xmark"></i>
                            </button>
                        </>
                    ) : (
                        <button
                            className="compare-remove-btn"
                            title="Delete draft"
                            onClick={() => setPendingDelete(true)}
                        >
                            <i className="fas fa-xmark"></i>
                        </button>
                    )}
                </div>
            </div>

            <MiniTimetableGrid pattern={p.sections} />

            <div className="compare-stat-row">
                <span>{p.sections.length} Courses</span>
                <span>{p.credits} CH</span>
                <span>{[...new Set(p.sections.map(s => s.day))].length} Days/Week</span>
            </div>

            {p.comment && !commentOpen && (
                <div className="vault-comment-display" onClick={() => setCommentOpen(true)} title="Click to edit">
                    <i className="fas fa-comment-alt"></i>
                    <span>{p.comment}</span>
                </div>
            )}

            {commentOpen && (
                <div className="vault-comment-area">
                    <textarea
                        autoFocus
                        className="vault-comment-input"
                        value={commentValue}
                        onChange={(e) => setCommentValue(e.target.value)}
                        placeholder="Add a note about this draft…"
                        rows={3}
                    />
                    <div className="vault-comment-actions">
                        <button className="vault-comment-save" onMouseDown={(e) => { e.preventDefault(); commitComment() }}>Save</button>
                        <button className="vault-comment-cancel" onMouseDown={(e) => { e.preventDefault(); cancelComment() }}>Cancel</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                <button
                    className={`icon-btn star-btn ${starred ? 'active' : ''}`}
                    title={starred ? 'Starred — click to unstar' : 'Star this routine'}
                    onClick={onTogglePriority}
                >
                    <i className={starred ? 'fas fa-star' : 'far fa-star'}></i>
                </button>
                <button
                    className={`icon-btn comment-btn ${p.comment ? 'active' : ''}`}
                    title={p.comment ? 'Edit note' : 'Add note'}
                    onClick={() => { setCommentValue(p.comment || ''); setCommentOpen(true) }}
                >
                    <i className={p.comment ? 'fas fa-comment-alt' : 'far fa-comment-alt'}></i>
                </button>
                <button className="view-btn" style={{ flex: 1, background: 'var(--reg-maroon)', color: '#fff' }} onClick={onLoad}>
                    <i className="fas fa-lock"></i>
                    Sandbox
                </button>
                <button className="icon-btn archive-btn" title="Archive" onClick={onArchive}>
                    <i className="fas fa-box-archive"></i>
                </button>
            </div>
        </div>
    )
}

function DraftVault() {
    const navigate = useNavigate()
    const { state, removeSavedPattern, loadSavedPattern, togglePriority, renamePattern, archivePattern, addToCompareSet, commentPattern } = useRegistrationWorkspace()
    const { savedPatterns } = state
    const active = savedPatterns.filter((p) => !p.archived)

    const starred = active.filter((p) => p.priority).reverse()
    const rest = active.filter((p) => !p.priority).reverse()

    // UC015: pick a few saved drafts to compare side by side.
    const [compareIds, setCompareIds] = useState([])
    const toggleCompare = (id) => {
        setCompareIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id)
            if (prev.length < MAX_COMPARE_PATTERNS) return [...prev, id]
            return [...prev.slice(1), id]
        })
    }

    const handleLoad = (id) => {
        loadSavedPattern(id)
        navigate('/registration/routine')
    }

    const handleCompare = () => {
        const entries = compareIds
            .map((id) => savedPatterns.find((p) => p.id === id))
            .filter(Boolean)
            .map((p) => ({ pattern: p.sections, label: p.name }))
        addToCompareSet(entries)
        setCompareIds([])
        navigate('/registration/compare')
    }

    if (active.length === 0) {
        return (
            <div className="container">
                <header>
                    <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                    <h1>Draft Vault</h1>
                </header>
                <div className="error-card" style={{ display: 'flex' }}>
                    <i className="fas fa-box-archive"></i>
                    <span>Your Draft Vault is empty. Save a pattern from Explore or Compare to see it here.</span>
                </div>
                <button className="btn outline" onClick={() => navigate('/registration/filter')}>
                    <i className="fas fa-compass"></i>
                    Go to Explore
                </button>
            </div>
        )
    }

    return (
        <div className="container">
            <header>
                <i className="fas fa-arrow-left" onClick={() => navigate(-1)}></i>
                <h1>Draft Vault</h1>
            </header>
            <div className="info-note" style={{ marginBottom: '20px' }}>
                <i className="fas fa-info-circle"></i>
                <p>
                    {active.length} draft{active.length === 1 ? '' : 's'} saved. Star the ones you're leaning toward for
                    registration day, check a few to compare them, or archive ones you're done with.
                </p>
            </div>

            {starred.length > 0 && (
                <>
                    <div className="vault-section-title">
                        <i className="fas fa-star"></i> Starred
                    </div>
                    <div className="patterns-grid" style={{ marginBottom: '24px' }}>
                        {starred.map((p) => (
                            <DraftCard
                                key={p.id}
                                p={p}
                                starred
                                isChecked={compareIds.includes(p.id)}
                                onToggleCompare={() => toggleCompare(p.id)}
                                onTogglePriority={() => togglePriority(p.id)}
                                onLoad={() => handleLoad(p.id)}
                                onArchive={() => archivePattern(p.id)}
                                onRemove={() => removeSavedPattern(p.id)}
                                onRename={(name) => renamePattern(p.id, name)}
                                onComment={(comment) => commentPattern(p.id, comment)}
                            />
                        ))}
                    </div>
                </>
            )}

            {rest.length > 0 && (
                <>
                    <div className="vault-section-title">
                        <i className="fas fa-box-archive"></i> All Drafts
                    </div>
                    <div className="patterns-grid">
                        {rest.map((p) => (
                            <DraftCard
                                key={p.id}
                                p={p}
                                starred={false}
                                isChecked={compareIds.includes(p.id)}
                                onToggleCompare={() => toggleCompare(p.id)}
                                onTogglePriority={() => togglePriority(p.id)}
                                onLoad={() => handleLoad(p.id)}
                                onArchive={() => archivePattern(p.id)}
                                onRemove={() => removeSavedPattern(p.id)}
                                onRename={(name) => renamePattern(p.id, name)}
                                onComment={(comment) => commentPattern(p.id, comment)}
                            />
                        ))}
                    </div>
                </>
            )}

            {compareIds.length >= 2 && (
                <div className="sticky-bottom">
                    <button className="btn primary" onClick={handleCompare}>
                        <i className="fas fa-scale-balanced"></i>
                        Compare {compareIds.length} Selected
                    </button>
                </div>
            )}
        </div>
    )
}

export default DraftVault
