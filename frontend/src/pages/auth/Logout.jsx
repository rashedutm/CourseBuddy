import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import './auth.css';

function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        logout().finally(() => navigate('/login', { replace: true }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <p style={{ textAlign: 'center' }}>Signing you out...</p>
            </div>
        </div>
    );
}

export default Logout;
