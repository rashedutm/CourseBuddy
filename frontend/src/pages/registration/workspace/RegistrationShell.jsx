import React from 'react'
import { Outlet } from 'react-router-dom'
import WorkspaceSidebar from './WorkspaceSidebar'
import { RegistrationWorkspaceProvider } from './RegistrationWorkspaceContext'
import '../registration.css'

function RegistrationShell() {
    return (
        <RegistrationWorkspaceProvider>
            <div className="workspace-shell">
                <WorkspaceSidebar />
                <div className="workspace-main">
                    <Outlet />
                </div>
            </div>
        </RegistrationWorkspaceProvider>
    )
}

export default RegistrationShell
