import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import './auth.css';

// Reached only via ProtectedRoute's role-mismatch branch. Shows the message
// first, then performs the actual logout, per the "Access Denied, then
// automatic logout" requirement.
function AccessDenied() {
    const { logout } = useAuth();
    const loggedOutRef = useRef(false);

    useEffect(() => {
        if (!loggedOutRef.current) {
            loggedOutRef.current = true;
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card no-pattern-card">
                <h3>Access Denied</h3>
                <p>You don't have permission to view that page. You've been signed out for security.</p>
                <Link to="/login" className="auth-btn" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}

export default AccessDenied;
