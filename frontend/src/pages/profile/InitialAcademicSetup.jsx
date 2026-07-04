import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProgrammes, submitInitialSetup } from '../../services/profileService';
import { getAcademicSessions, getIntakesBySession } from '../../services/courseService';
import '../auth/auth.css';

// First-login flow (UC025): the student picks their programme and intake
// before they can use any course-selection features. Programme options
// come from my new profileService endpoint; intake options reuse Rashed's
// existing courseService endpoints (no need to duplicate that data source).
function InitialAcademicSetup() {
    const navigate = useNavigate();

    const [programmes, setProgrammes] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [intakes, setIntakes] = useState([]);

    const [programmeID, setProgrammeID] = useState('');
    const [academicSession, setAcademicSession] = useState('');
    const [intakeID, setIntakeID] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllProgrammes().then(setProgrammes).catch(err => setError(err.message));
        getAcademicSessions().then(setSessions).catch(err => setError(err.message));
    }, []);

    const handleSessionChange = (session) => {
        setAcademicSession(session);
        setIntakeID('');
        setIntakes([]);
        if (session) {
            getIntakesBySession(session).then(setIntakes).catch(err => setError(err.message));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!programmeID || !intakeID) {
            setError('Please select your programme and intake');
            return;
        }

        setError('');
        setLoading(true);

        submitInitialSetup(programmeID, intakeID)
            .then(result => {
                setLoading(false);
                localStorage.setItem('studentID', result.studentID);
                localStorage.setItem('programmeID', result.programmeID);
                localStorage.setItem('intakeID', result.intakeID);
                navigate('/dashboard');
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Academic Setup</h2>
                    <p>Tell us your programme and intake to get started</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-group">
                        <label>Programme</label>
                        <select
                            className="auth-input"
                            value={programmeID}
                            onChange={(e) => setProgrammeID(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select programme</option>
                            {programmes.map(p => (
                                <option key={p.programmeID} value={p.programmeID}>{p.programmeName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="auth-group">
                        <label>Academic Session</label>
                        <select
                            className="auth-input"
                            value={academicSession}
                            onChange={(e) => handleSessionChange(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select academic session</option>
                            {sessions.map(s => (
                                <option key={s.academicSession} value={s.academicSession}>{s.academicSession}</option>
                            ))}
                        </select>
                    </div>

                    <div className="auth-group">
                        <label>Intake</label>
                        <select
                            className="auth-input"
                            value={intakeID}
                            onChange={(e) => setIntakeID(e.target.value)}
                            disabled={loading || !academicSession}
                        >
                            <option value="">Select intake</option>
                            {intakes.map(i => (
                                <option key={i.intakeID} value={i.intakeID}>{i.intakeName}</option>
                            ))}
                        </select>
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default InitialAcademicSetup;
