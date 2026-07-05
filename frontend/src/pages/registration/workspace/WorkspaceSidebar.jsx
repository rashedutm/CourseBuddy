import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useRegistrationWorkspace } from './RegistrationWorkspaceContext'

const COLLAPSE_KEY = 'cb-registration-sidebar-collapsed'

const NAV_ITEMS = [
    { to: '/registration/filter', icon: 'fas fa-compass', label: 'Explore' },
    { to: '/registration/compare', icon: 'fas fa-scale-balanced', label: 'Compare & Build' },
    { to: '/registration/vault', icon: 'fas fa-box-archive', label: 'Draft Vault' },
    { to: '/registration/archive', icon: 'fas fa-boxes-packing', label: 'Archive' },
]

function WorkspaceSidebar() {
    const { state } = useRegistrationWorkspace()
    const { savedPatterns, meta } = state

    const badgeCounts = {
        '/registration/vault': savedPatterns.filter((p) => !p.archived).length,
        '/registration/archive': savedPatterns.filter((p) => p.archived).length,
    }

    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === 'true')
    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev
            localStorage.setItem(COLLAPSE_KEY, String(next))
            return next
        })
    }

    return (
        <aside className={`workspace-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button
                className="workspace-collapse-toggle"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                onClick={toggleCollapsed}
            >
                <i className={`fas ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
            </button>

            {!collapsed && <div className="workspace-brand">CourseBuddy</div>}
            {!collapsed && meta.academicSession && (
                <div className="workspace-meta">
                    {meta.programmeID && <>{meta.programmeID} • </>}
                    {meta.academicSession} — Sem {meta.semesterNumber}
                </div>
            )}

            <nav className="workspace-nav">
                {NAV_ITEMS.map((item) => {
                    const count = badgeCounts[item.to] || 0
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) => `workspace-nav-link ${isActive ? 'active' : ''}`}
                        >
                            <i className={item.icon}></i>
                            {!collapsed && item.label}
                            {count > 0 && !collapsed && (
                                <span className="workspace-nav-badge">{count}</span>
                            )}
                            {count > 0 && collapsed && (
                                <span className="workspace-nav-dot"></span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

        </aside>
    )
}

export default WorkspaceSidebar
