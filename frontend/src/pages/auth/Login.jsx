import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../services/authContext';
import './auth.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        setError('');

        loginUser(email, password)
            .then(result => {
                setLoading(false);

                // Save token and role to session storage
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);

                // Save specific student or admin keys as required by team guidelines
                if (result.role === 'student') {
                    localStorage.setItem('studentID', result.user.studentID || '');
                    localStorage.setItem('programmeID', result.user.programmeID || '');
                    localStorage.setItem('studentName', result.user.name || '');
                    localStorage.setItem('intakeID', result.user.intakeID || '');
                } else if (result.role === 'admin') {
                    localStorage.setItem('adminID', result.user.adminID || '');
                    localStorage.setItem('facultyID', result.user.facultyID || '');
                    localStorage.setItem('adminName', result.user.name || '');
                }

                login(result);

                // First-ever login for a student (no academic profile yet)
                // goes through Initial Academic Setup before the dashboard.
                if (result.role === 'student' && !result.user.studentID) {
                    navigate('/profile/initial-setup');
                } else {
                    navigate('/dashboard');
                }
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
                    <h2>Sign In</h2>
                    <p>Welcome back to CourseBuddy</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-group">
                        <label>Official UTM Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            placeholder="user@graduate.utm.my"
                        />
                    </div>
                    <div className="auth-group">
                        <label>Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="subtitle" style={{ textAlign: 'center', marginTop: '20px', marginLeft: 0 }}>
                    <Link to="/reset-password">Forgot password?</Link>
                </p>
                <p className="subtitle" style={{ textAlign: 'center', marginLeft: 0 }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
