import React from 'react';
import { Navigate } from 'react-router-dom';

// Academic info editing now happens inline on ViewProfile ("Edit" on the
// Academic Details card) rather than as a separate screen. This route is
// kept registered (rather than removed) so any existing links/bookmarks
// to /profile/update still land somewhere sensible.
function UpdateAcademicInfo() {
    return <Navigate to="/profile" replace />;
}

export default UpdateAcademicInfo;
