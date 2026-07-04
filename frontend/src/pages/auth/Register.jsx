import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import './auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        matricNumber: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.matricNumber || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setLoading(true);

        registerUser(formData)
            .then(() => {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => navigate('/login'), 1500);
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card success-card">
                    <h3>✓ Registration successful!</h3>
                    <p>Redirecting you to sign in...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Register Account</h2>
                    <p>Create your student CourseBuddy account</p>
                </div>

                <p className="field-hint" style={{ marginBottom: '20px' }}>
                    This registration is for students only. Academic Officer (admin) accounts are set up internally — if you're staff, use your existing account on the Sign In page.
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-group">
                        <label>Full Name</label>
                        <input
                            className="auth-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="auth-group">
                        <label>Matric Number</label>
                        <input
                            className="auth-input"
                            type="text"
                            name="matricNumber"
                            value={formData.matricNumber}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="auth-group">
                        <label>Official UTM Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@graduate.utm.my"
                            disabled={loading}
                        />
                    </div>
                    <div className="auth-group">
                        <label>Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="subtitle" style={{ textAlign: 'center', marginTop: '20px', marginLeft: 0 }}>
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
