import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../pages/home/NavigationBar';

// Shared authenticated-page shell: renders the persistent nav once, above
// whatever route is active. Deliberately role-agnostic — NavigationBar
// already reads the real logged-in role and decides its own links, so this
// component doesn't need to know or care who's logged in.
function Layout() {
    return (
        <>
            <NavigationBar />
            <Outlet />
        </>
    );
}

export default Layout;
