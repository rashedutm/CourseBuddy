import React, { useEffect, useRef, useState } from 'react';
import { getProfile, getAllProgrammes, updateFullName, updateAcademicInfo } from '../../services/profileService';
import { getAcademicSessions, getIntakesBySession } from '../../services/courseService';
import '../auth/auth.css';

function useToast() {
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);

    const showToast = (type, message) => {
        clearTimeout(timerRef.current);
        setToast({ type, message });
        timerRef.current = setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return [toast, showToast];
}

function ViewProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, showToast] = useToast();

    // Personal details (Full Name) edit state — Matric Number and UTM Email
    // are not editable: matric numbers are institutionally assigned and the
    // UTM email is what login/role detection is keyed on, so both stay
    // read-only here.
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const [nameError, setNameError] = useState('');
    const [savingName, setSavingName] = useState(false);

    // Academic details (Programme / Intake) edit state
    const [editingAcademic, setEditingAcademic] = useState(false);
    const [programmes, setProgrammes] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [intakes, setIntakes] = useState([]);
    const [programmeID, setProgrammeID] = useState('');
    const [academicSession, setAcademicSession] = useState('');
    const [intakeID, setIntakeID] = useState('');
    const [academicError, setAcademicError] = useState('');
    const [savingAcademic, setSavingAcademic] = useState(false);

    const loadProfile = () => {
        return getProfile().then(data => {
            setProfile(data);
            setNameDraft(data.name);
            setProgrammeID(data.programmeID || '');
            setIntakeID(data.intakeID || '');
        });
    };

    useEffect(() => {
        loadProfile()
            .then(() => setLoading(false))
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const startEditName = () => {
        setNameDraft(profile.name);
        setNameError('');
        setEditingName(true);
    };

    const saveName = () => {
        const trimmed = nameDraft.trim();
        if (!trimmed) {
            setNameError('Full name cannot be empty');
            return;
        }
        setNameError('');
        setSavingName(true);
        updateFullName(trimmed)
            .then(() => {
                setSavingName(false);
                setEditingName(false);
                setProfile(prev => ({ ...prev, name: trimmed }));
                localStorage.setItem(profile.role === 'admin' ? 'adminName' : 'studentName', trimmed);
                showToast('success', 'Name updated');
            })
            .catch(err => {
                setSavingName(false);
                setNameError(err.message);
            });
    };

    const startEditAcademic = () => {
        setAcademicError('');
        setEditingAcademic(true);
        if (programmes.length === 0) {
            getAllProgrammes().then(setProgrammes).catch(err => setAcademicError(err.message));
        }
        if (sessions.length === 0) {
            getAcademicSessions().then(setSessions).catch(err => setAcademicError(err.message));
        }
    };

    const handleSessionChange = (session) => {
        setAcademicSession(session);
        setIntakeID('');
        setIntakes([]);
        if (session) {
            getIntakesBySession(session).then(setIntakes).catch(err => setAcademicError(err.message));
        }
    };

    const saveAcademic = () => {
        if (!programmeID || !intakeID) {
            setAcademicError('Please select your programme and intake');
            return;
        }
        setAcademicError('');
        setSavingAcademic(true);
        updateAcademicInfo(programmeID, intakeID)
            .then(result => {
                setSavingAcademic(false);
                setEditingAcademic(false);
                setProfile(prev => ({ ...prev, programmeID: result.programmeID, intakeID: result.intakeID }));
                localStorage.setItem('programmeID', result.programmeID);
                localStorage.setItem('intakeID', result.intakeID);
                showToast('success', 'Academic info updated');
            })
            .catch(err => {
                setSavingAcademic(false);
                setAcademicError(err.message);
            });
    };

    return (
            <div className="app-shell">
                <span className="page-label">Profile</span>
                <div className="page-heading">
                    <h1>My Profile</h1>
                </div>

            {loading && <p className="subtitle">Loading profile...</p>}
            {error && <div className="error-card">{error}</div>}

            {profile && (
                <>
                    <div className="detail-card">
                        <div className="card-header-row">
                            <h3>Personal Details</h3>
                            {!editingName && (
                                <button className="icon-btn" onClick={startEditName}>Edit</button>
                            )}
                        </div>

                        {editingName ? (
                            <>
                                <div className="field-row">
                                    <label>Full Name</label>
                                    <input
                                        className="auth-input"
                                        type="text"
                                        value={nameDraft}
                                        onChange={(e) => setNameDraft(e.target.value)}
                                        disabled={savingName}
                                    />
                                </div>
                                {nameError && <div className="auth-error">{nameError}</div>}
                                <div className="edit-actions">
                                    <button className="btn primary btn-sm" onClick={saveName} disabled={savingName}>
                                        {savingName ? 'Saving...' : 'Save'}
                                    </button>
                                    <button className="btn outline btn-sm" onClick={() => setEditingName(false)} disabled={savingName}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="info-row">
                                <span>Full Name</span>
                                <strong>{profile.name}</strong>
                            </div>
                        )}

                        <div className="info-row">
                            <span>UTM Email</span>
                            <strong>{profile.utmEmail}</strong>
                        </div>
                        {profile.role === 'student' && (
                            <div className="info-row">
                                <span>Matric Number</span>
                                <strong>{profile.matricNumber}</strong>
                            </div>
                        )}
                        {!editingName && <p className="field-hint">Email and matric number can't be changed here.</p>}
                    </div>

                    {profile.role === 'student' && (
                        <div className="detail-card">
                            <div className="card-header-row">
                                <h3>Academic Details</h3>
                                {!editingAcademic && (
                                    <button className="icon-btn" onClick={startEditAcademic}>Edit</button>
                                )}
                            </div>

                            {editingAcademic ? (
                                <>
                                    <div className="field-row">
                                        <label>Programme</label>
                                        <select
                                            className="auth-input"
                                            value={programmeID}
                                            onChange={(e) => setProgrammeID(e.target.value)}
                                            disabled={savingAcademic}
                                        >
                                            <option value="">Select programme</option>
                                            {programmes.map(p => (
                                                <option key={p.programmeID} value={p.programmeID}>{p.programmeName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field-row">
                                        <label>Academic Session</label>
                                        <select
                                            className="auth-input"
                                            value={academicSession}
                                            onChange={(e) => handleSessionChange(e.target.value)}
                                            disabled={savingAcademic}
                                        >
                                            <option value="">Select academic session</option>
                                            {sessions.map(s => (
                                                <option key={s.academicSession} value={s.academicSession}>{s.academicSession}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field-row">
                                        <label>Intake</label>
                                        <select
                                            className="auth-input"
                                            value={intakeID}
                                            onChange={(e) => setIntakeID(e.target.value)}
                                            disabled={savingAcademic || !academicSession}
                                        >
                                            <option value="">{intakeID ? `Current: ${intakeID}` : 'Select intake'}</option>
                                            {intakes.map(i => (
                                                <option key={i.intakeID} value={i.intakeID}>{i.intakeName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {academicError && <div className="auth-error">{academicError}</div>}
                                    <div className="edit-actions">
                                        <button className="btn primary btn-sm" onClick={saveAcademic} disabled={savingAcademic}>
                                            {savingAcademic ? 'Saving...' : 'Save'}
                                        </button>
                                        <button className="btn outline btn-sm" onClick={() => setEditingAcademic(false)} disabled={savingAcademic}>
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="info-row">
                                        <span>Programme</span>
                                        <strong>{profile.programmeID || 'Not set'}</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>Intake</span>
                                        <strong>{profile.intakeID || 'Not set'}</strong>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}
            </div>
    );
}

export default ViewProfile;
