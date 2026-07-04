import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import RoleGuard from '../../components/RoleGuard';
import { getAlerts } from '../../services/homeService';
import '../auth/auth.css';

const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};

const BellIcon = () => (
    <svg className="notif-bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

// Full-width sticky header: brand, plain-text nav links with a single
// active-state underline, a bell icon (unread notification count, in
// place of a standalone Notifications tab) and an avatar dropdown
// holding Profile + Logout.
function NavigationBar() {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const menuRef = useRef(null);

    const displayName = localStorage.getItem(role === 'admin' ? 'adminName' : 'studentName') || '';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        getAlerts()
            .then(alerts => setUnreadCount(alerts.filter(a => !a.isRead).length))
            .catch(() => {});
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        navigate('/logout');
    };

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <div className="brand">
                    <span className="brand-name">CourseBuddy</span>
                    <span className="brand-tagline">UTM's next smart registration system</span>
                </div>

                <nav className="nav-links">
                    <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                    <RoleGuard allow={['student']}>
                        <NavLink to="/profile/planner" className={linkClass}>Planner</NavLink>
                        <NavLink to="/courses/select-intake" className={linkClass}>Course Selection</NavLink>
                        <NavLink to="/registration/vault" className={linkClass}>Draft Vault</NavLink>
                    </RoleGuard>
                    <RoleGuard allow={['admin']}>
                        <NavLink to="/admin/handbook/view" className={linkClass}>Handbook</NavLink>
                        <NavLink to="/admin/timetable/view" className={linkClass}>Timetable</NavLink>
                        <NavLink to="/admin/courses/view" className={linkClass}>Courses</NavLink>
                    </RoleGuard>
                </nav>

                <button className="notif-bell-btn" onClick={() => navigate('/alerts')} aria-label="Notifications">
                    <BellIcon />
                    {unreadCount > 0 && <span className="notif-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>

                <div className="user-menu" ref={menuRef}>
                    <button className="user-menu-trigger" onClick={() => setMenuOpen(open => !open)}>
                        <span className="user-avatar">{getInitials(displayName)}</span>
                        <span className="user-menu-caret">▾</span>
                    </button>

                    {menuOpen && (
                        <div className="user-menu-panel">
                            <div className="user-menu-header">
                                <div className="user-menu-name">{displayName || 'Account'}</div>
                                <div className="user-menu-role">{role}</div>
                            </div>
                            <NavLink to="/profile" className="user-menu-item" onClick={() => setMenuOpen(false)}>
                                View Profile
                            </NavLink>
                            <button className="user-menu-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default NavigationBar;
