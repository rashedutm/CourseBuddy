import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { getStudentDashboard, getAdminDashboard, getAlerts } from '../../services/homeService';
import '../auth/auth.css';

// Small inline line icons — no icon library is set up in this project, so
// these are plain SVG rather than a font-icon dependency.
const icons = {
    draft: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    ),
    check: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    ),
    target: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    ),
    warning: (
        <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
    ),
    calendar: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    upload: (
        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    ),
    pencil: (
        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
    ),
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

// Static quick-links to Yousra's admin pages — routing only, no
// implementation of those screens.
const ADMIN_QUICK_LINKS = [
    { label: 'Upload Handbook', to: '/admin/handbook/upload', icon: 'upload' },
    { label: 'Upload Timetable', to: '/admin/timetable/upload', icon: 'upload' },
    { label: 'Manage Courses & Sections', to: '/admin/courses/view', icon: 'pencil' },
];

function StudentDashboard() {
    const [data, setData] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([getStudentDashboard(), getAlerts()])
            .then(([dashboard, alertList]) => {
                setData(dashboard);
                setAlerts(alertList);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="subtitle">Loading dashboard...</p>;
    if (error) return <div className="error-card">{error}</div>;

    const unreadCount = alerts.filter(a => !a.isRead).length;
    const latestAlert = alerts[0] || null; // already sorted high-priority-first, newest first

    return (
        <>
            <span className="page-label">Dashboard</span>
            <div className="page-heading">
                <h1>{getGreeting()}, {data.fullName}</h1>
            </div>

            {!data.hasProfile && (
                <div className="alert-banner">
                    {icons.warning}
                    <span>
                        <strong>Academic setup incomplete — </strong>
                        complete it to start selecting courses.{' '}
                        <Link to="/profile/initial-setup">Set up now</Link>
                    </span>
                </div>
            )}

            {data.hasProfile && (
                <>
                    <div className="stat-box-row">
                        <div className="stat-box">
                            {icons.draft}
                            <div className="value">{data.draftCount}</div>
                            <div className="label">Draft Routines</div>
                        </div>
                        <div className="stat-box">
                            {icons.check}
                            <div className="value">{data.routine ? data.routine.registeredCourses : 0}</div>
                            <div className="label">Registered</div>
                        </div>
                        <div className="stat-box">
                            {icons.target}
                            <div className="value">{data.routine ? data.routine.totalCourses : 0}</div>
                            <div className="label">Required</div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-label">Quick Summary</div>
                        <div className="panel-section">
                            <div className="panel-section-label">Notifications</div>
                            <div className="row-list">
                                <div className="row-list-item">
                                    <span className="row-label">Unread</span>
                                    <span className="row-value">{unreadCount}</span>
                                </div>
                                {latestAlert ? (
                                    <div className="row-list-item">
                                        <span className="row-label">
                                            <span className={`priority-dot ${latestAlert.priority}`}></span>
                                            Latest
                                        </span>
                                        <span className="row-value">{latestAlert.message}</span>
                                    </div>
                                ) : (
                                    <p className="panel-empty">No notifications yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Link to="/courses/select-intake" className="btn primary">
                View Course Selection
            </Link>
        </>
    );
}

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAdminDashboard()
            .then(result => {
                setData(result);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="subtitle">Loading dashboard...</p>;
    if (error) return <div className="error-card">{error}</div>;

    return (
        <>
            <span className="page-label">Dashboard</span>
            <div className="page-heading">
                <h1>Welcome, {data.fullName}</h1>
                {data.facultyName && <p>{data.facultyName}</p>}
            </div>

            <div className="stat-box-row">
                <div className="stat-box">
                    <span className="stat-icon-badge">{icons.draft}</span>
                    <div className="value">{data.coursesUploaded ?? '—'}</div>
                    <div className="label">Courses Uploaded</div>
                </div>
                <div className="stat-box">
                    <span className="stat-icon-badge">{icons.calendar}</span>
                    <div className="value">{data.sectionsLoaded ?? '—'}</div>
                    <div className="label">Sections Loaded</div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-label">Quick Actions</div>
                <div className="panel-section">
                    {ADMIN_QUICK_LINKS.map(link => (
                        <Link key={link.to} to={link.to} className="quick-action">
                            {icons[link.icon]}
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

function Dashboard() {
    const { role } = useAuth();

    return (
        <div className="app-shell">
            {role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
        </div>
    );
}

export default Dashboard;
