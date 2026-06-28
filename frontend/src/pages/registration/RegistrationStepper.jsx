import React from 'react'
import './registration.css'

const STEPS = [
    { label: 'Filter', icon: 'fas fa-filter' },
    { label: 'Compare', icon: 'fas fa-scale-balanced' },
    { label: 'Blueprint', icon: 'fas fa-calendar-check' },
    { label: 'Report', icon: 'fas fa-file-lines' },
]

function RegistrationStepper({ current }) {
    return (
        <div className="reg-stepper">
            {STEPS.map((step, i) => {
                const isDone = i < current
                const isActive = i === current
                return (
                    <React.Fragment key={i}>
                        {i > 0 && (
                            <div className={`reg-step-connector ${isDone ? 'done' : ''}`} />
                        )}
                        <div className={`reg-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="reg-step-icon">
                                {isDone
                                    ? <i className="fas fa-check" />
                                    : <i className={step.icon} />
                                }
                            </div>
                            <span className="reg-step-label">{step.label}</span>
                        </div>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default RegistrationStepper
