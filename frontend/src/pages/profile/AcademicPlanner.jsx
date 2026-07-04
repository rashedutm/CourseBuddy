import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlanner, updateCourseStatus, updateCurrentSemester } from '../../services/plannerService';
import '../auth/auth.css';

const STATUS_OPTIONS = [
    { value: 'not_taken', label: 'Not Taken' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'dropped', label: 'Dropped' }
];

const STATUS_LABELS = STATUS_OPTIONS.reduce((acc, o) => ({ ...acc, [o.value]: o.label }), {});

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

function AcademicPlanner() {
    const [planner, setPlanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingCode, setSavingCode] = useState(null);
    const [savingSemester, setSavingSemester] = useState(false);
    const [toast, showToast] = useToast();

    useEffect(() => {
        getPlanner()
            .then(data => {
                setPlanner(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleStatusChange = (courseCode, status) => {
        setSavingCode(courseCode);
        updateCourseStatus(courseCode, status)
            .then(() => {
                setPlanner(prev => {
                    const semesters = prev.semesters.map(sem => ({
                        ...sem,
                        courses: sem.courses.map(c => c.courseCode === courseCode ? { ...c, status } : c)
                    }));

                    const completed = semesters
                        .flatMap(sem => sem.courses)
                        .filter(c => c.status === 'completed')
                        .reduce((sum, c) => sum + c.creditHours, 0);
                    const required = prev.creditSummary.required;

                    return {
                        ...prev,
                        semesters,
                        creditSummary: {
                            completed,
                            required,
                            percent: required ? Math.round((completed / required) * 100) : null
                        }
                    };
                });
                setSavingCode(null);
                showToast('success', 'Course status updated');
            })
            .catch(err => {
                setSavingCode(null);
                showToast('error', err.message);
            });
    };

    const handleCurrentSemesterChange = (value) => {
        const currentSemester = parseInt(value, 10);
        setSavingSemester(true);
        updateCurrentSemester(currentSemester)
            .then(() => {
                setPlanner(prev => ({
                    ...prev,
                    currentSemester,
                    semesters: prev.semesters.map(sem => ({
                        ...sem,
                        interactive: sem.semesterNumber <= currentSemester
                    }))
                }));
                setSavingSemester(false);
                showToast('success', 'Current semester updated');
            })
            .catch(err => {
                setSavingSemester(false);
                showToast('error', err.message);
            });
    };

    if (loading) {
        return (
            <div className="app-shell">
                <p className="subtitle">Loading academic planner...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-shell">
                <div className="error-card">{error}</div>
            </div>
        );
    }

    if (!planner.hasProfile) {
        return (
            <div className="app-shell">
                <span className="page-label">Academic Planner</span>
                <div className="page-heading">
                    <h1>Academic Planner</h1>
                </div>
                <div className="alert-banner">
                    <span>
                        <strong>Academic setup incomplete — </strong>
                        complete it to see your degree plan.{' '}
                        <Link to="/profile/initial-setup">Set up now</Link>
                    </span>
                </div>
            </div>
        );
    }

    const { creditSummary, semesters, currentSemester, maxSemester } = planner;

    return (
        <div className="app-shell">
            <span className="page-label">Academic Planner</span>
            <div className="page-heading">
                <h1>Academic Planner</h1>
            </div>

            <div className="panel credit-summary-panel">
                <div className="panel-label">Credit Summary</div>
                <div className="panel-section">
                    <div className="credit-summary-numbers">
                        <span><strong>{creditSummary.completed}</strong> / {creditSummary.required ?? '—'} credits</span>
                        <span>{creditSummary.percent !== null ? `${creditSummary.percent}%` : '—'} completed</span>
                    </div>
                    <div className="progress-bar-track">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min(creditSummary.percent ?? 0, 100)}%` }}
                        />
                    </div>
                </div>
                <div className="panel-section current-semester-row">
                    <label htmlFor="current-semester-select">Current Semester</label>
                    <select
                        id="current-semester-select"
                        className="status-select"
                        value={currentSemester}
                        disabled={savingSemester}
                        onChange={(e) => handleCurrentSemesterChange(e.target.value)}
                    >
                        {Array.from({ length: maxSemester }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>Semester {n}</option>
                        ))}
                    </select>
                </div>
            </div>

            {semesters.map(sem => (
                <div className="planner-semester" key={sem.semesterNumber}>
                    <div className="planner-semester-header">
                        <span className="semester-title">Semester {sem.semesterNumber}</span>
                        {!sem.interactive && <span className="upcoming-badge">Upcoming</span>}
                    </div>

                    {sem.courses.map(course => (
                        <div className="planner-course-row" key={course.courseCode}>
                            <div className="planner-course-info">
                                <span className="planner-course-name">{course.courseName}</span>
                                <span className="planner-course-meta">
                                    <span className="credit-badge">{course.creditHours} cr</span>
                                    {course.prerequisiteNote && <span>Prerequisite: {course.prerequisiteNote}</span>}
                                    {course.electiveGroup && <span>{course.electiveGroup}</span>}
                                </span>
                            </div>

                            {sem.interactive ? (
                                <select
                                    className="status-select"
                                    value={course.status}
                                    disabled={savingCode === course.courseCode}
                                    onChange={(e) => handleStatusChange(course.courseCode, e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="upcoming-badge">{STATUS_LABELS[course.status]}</span>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {toast && (
                <div className={`toast toast-${toast.type}`}>{toast.message}</div>
            )}
        </div>
    );
}

export default AcademicPlanner;
