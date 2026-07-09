import React, { useEffect, useState } from 'react';
import { getAlerts } from '../../services/homeService';
import '../auth/auth.css';

function AcademicAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAlerts()
            .then(data => {
                setAlerts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="app-shell">
            <span className="page-label">Notifications</span>
            <div className="page-heading">
                <h1>Notifications</h1>
            </div>

            {loading && <p className="subtitle">Loading notifications...</p>}
            {error && <div className="error-card">{error}</div>}

            {!loading && !error && alerts.length === 0 && (
                <div className="empty-state-card">
                    <h2>You're all caught up</h2>
                    <p>No notifications right now.</p>
                </div>
            )}

            {alerts.map(alert => (
                <div key={alert.alertID} className="detail-card">
                    <div className="info-row">
                        <span>
                            <span className={`priority-dot ${alert.priority}`}></span>
                            {alert.priority === 'high' ? 'High Priority' : 'Low Priority'}
                        </span>
                    </div>
                    <p>{alert.message}</p>
                </div>
            ))}
        </div>
    );
}

export default AcademicAlerts;
