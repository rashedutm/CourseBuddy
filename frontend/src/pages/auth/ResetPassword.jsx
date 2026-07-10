import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, verifyResetCode, confirmPasswordReset } from '../../services/authService';
import './auth.css';

// Single-file step machine covering the whole UC023 flow:
// request email -> enter verification code -> set new password -> success.
// No email service is configured for this project, so the "email
// verification" step displays the generated code directly on screen
// instead of actually emailing it (documented dev-mode limitation).
function ResetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState('request');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [devCode, setDevCode] = useState('');
    const [code, setCode] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRequestCode = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        setError('');
        setLoading(true);
        requestPasswordReset(email)
            .then(result => {
                setLoading(false);
                setDevCode(result.code);
                setStep('verify');
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        if (!code) {
            setError('Verification code is required');
            return;
        }
        setError('');
        setLoading(true);
        verifyResetCode(email, code)
            .then(result => {
                setLoading(false);
                setResetToken(result.resetToken);
                setStep('newPassword');
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    const handleSetNewPassword = (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setLoading(true);
        confirmPasswordReset(resetToken, newPassword)
            .then(() => {
                setLoading(false);
                setStep('success');
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {step === 'request' && (
                    <>
                        <div className="auth-header">
                            <h2>Forgot Password</h2>
                            <p>Enter your UTM email to receive a verification code</p>
                        </div>
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleRequestCode}>
                            <div className="auth-group">
                                <label>Official UTM Email</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <button className="auth-btn" type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <div className="auth-header">
                            <h2>Email Verification</h2>
                            <p>Enter the verification code for {email}</p>
                        </div>
                        {devCode && (
                            <div className="info-note" style={{ marginBottom: '20px' }}>
                                <p>No email service is configured for this project, so here is your code directly: <strong>{devCode}</strong></p>
                            </div>
                        )}
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleVerifyCode}>
                            <div className="auth-group">
                                <label>Verification Code</label>
                                <input
                                    className="auth-input"
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <button className="auth-btn" type="submit" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'newPassword' && (
                    <>
                        <div className="auth-header">
                            <h2>Create New Password</h2>
                            <p>Choose a new password for your account</p>
                        </div>
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleSetNewPassword}>
                            <div className="auth-group">
                                <label>New Password</label>
                                <input
                                    className="auth-input"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="auth-group">
                                <label>Confirm New Password</label>
                                <input
                                    className="auth-input"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <button className="auth-btn" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'success' && (
                    <div className="success-card">
                        <h3>✓ Password reset successful</h3>
                        <p>You can now sign in with your new password.</p>
                        <button className="auth-btn" style={{ marginTop: '20px' }} onClick={() => navigate('/login')}>
                            Back to Sign In
                        </button>
                    </div>
                )}

                {step === 'request' && (
                    <p className="subtitle" style={{ textAlign: 'center', marginTop: '20px', marginLeft: 0 }}>
                        <Link to="/login">Back to Sign In</Link>
                    </p>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
