import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

function Login() {
    const navigate = useNavigate();
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

                // Redirect to the dashboard hub
                navigate('/dashboard');
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    return (
        <div>
            <h2>Sign In</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Authenticating...</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Official UTM Email: </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        disabled={loading}
                    />
                </div>
                <br />
                <div>
                    <label>Password: </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        disabled={loading}
                    />
                </div>
                <br />
                <button type="submit" disabled={loading}>Sign In</button>
            </form>
        </div>
    );
}

export default Login;