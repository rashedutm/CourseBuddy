import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Logout from './pages/auth/Logout';
import ResetPassword from './pages/auth/ResetPassword';

// Home pages
import Dashboard from './pages/home/Dashboard';
import NavigationBar from './pages/home/NavigationBar';
import AcademicAlerts from './pages/home/AcademicAlerts';

// Profile pages
import ViewProfile from './pages/profile/ViewProfile';
import InitialAcademicSetup from './pages/profile/InitialAcademicSetup';
import UpdateAcademicInfo from './pages/profile/UpdateAcademicInfo';

// Course pages
import SelectIntakeSemester from './pages/courses/SelectIntakeSemester';
import SelectCourses from './pages/courses/SelectCourses';
import PrerequisiteInfo from './pages/courses/PrerequisiteInfo';
import AvailableCourses from './pages/courses/AvailableCourses';
import SetLecturerPreference from './pages/courses/SetLecturerPreference';
import GeneratePatterns from './pages/courses/GeneratePatterns';
import GenerateWithoutPref from './pages/courses/GenerateWithoutPref';
import ViewPatterns from './pages/courses/ViewPatterns';
import FilteredPatterns from './pages/courses/FilteredPatterns';
import PatternDetails from './pages/courses/PatternDetails';
import SelectPattern from './pages/courses/SelectPattern';
import ResetPreference from './pages/courses/ResetPreference';

// Registration pages
import RegistrationShell from './pages/registration/workspace/RegistrationShell';
import FilterPatterns from './pages/registration/FilterPatterns';
import ViewComparePatterns from './pages/registration/ViewComparePatterns';
import SelectedRoutine from './pages/registration/SelectedRoutine';
import DraftVault from './pages/registration/DraftVault';
import ArchivedDrafts from './pages/registration/ArchivedDrafts';
// Admin pages
import UploadHandbook from './pages/admin/UploadHandbook';
import ViewHandbookData from './pages/admin/ViewHandbookData';
import DeleteHandbook from './pages/admin/DeleteHandbook';
import UploadTimetable from './pages/admin/UploadTimetable';
import ViewTimetableData from './pages/admin/ViewTimetableData';
import DeleteTimetable from './pages/admin/DeleteTimetable';
import ViewCourseSection from './pages/admin/ViewCourseSection';
import EditCourseData from './pages/admin/EditCourseData';
import EditSectionData from './pages/admin/EditSectionData';
import DeleteCourseSection from './pages/admin/DeleteCourseSection';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Home Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/navigation" element={<NavigationBar />} />
        <Route path="/alerts" element={<AcademicAlerts />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<ViewProfile />} />
        <Route path="/profile/initial-setup" element={<InitialAcademicSetup />} />
        <Route path="/profile/update" element={<UpdateAcademicInfo />} />
        
        {/* Course Routes */}
        <Route path="/courses/select-intake" element={<SelectIntakeSemester />} />
        <Route path="/courses/select" element={<SelectCourses />} />
        <Route path="/courses/prerequisites" element={<PrerequisiteInfo />} />
        <Route path="/courses/available" element={<AvailableCourses />} />
        <Route path="/courses/lecturer-preference" element={<SetLecturerPreference />} />
        <Route path="/courses/generate" element={<GeneratePatterns />} />
        <Route path="/courses/generate-without-pref" element={<GenerateWithoutPref />} />
        <Route path="/courses/patterns" element={<ViewPatterns />} />
        <Route path="/courses/patterns/filtered" element={<FilteredPatterns />} />
        <Route path="/courses/patterns/select" element={<SelectPattern />} />
        <Route path="/courses/patterns/:id" element={<PatternDetails />} />
        <Route path="/courses/reset-preference" element={<ResetPreference />} />
        
        {/* Registration Routes — nested under a persistent workspace shell so
            Saved Routines / Current Routine survive navigation between views. */}
        <Route path="/registration" element={<RegistrationShell />}>
          <Route path="filter" element={<FilterPatterns />} />
          <Route path="compare" element={<ViewComparePatterns />} />
          <Route path="routine" element={<SelectedRoutine />} />
          <Route path="vault" element={<DraftVault />} />
          <Route path="archive" element={<ArchivedDrafts />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/handbook/upload" element={<UploadHandbook />} />
        <Route path="/admin/handbook/view" element={<ViewHandbookData />} />
        <Route path="/admin/handbook/delete" element={<DeleteHandbook />} />
        <Route path="/admin/timetable/upload" element={<UploadTimetable />} />
        <Route path="/admin/timetable/view" element={<ViewTimetableData />} />
        <Route path="/admin/timetable/delete" element={<DeleteTimetable />} />
        <Route path="/admin/courses/view" element={<ViewCourseSection />} />
        <Route path="/admin/courses/edit-course" element={<EditCourseData />} />
        <Route path="/admin/courses/edit-section" element={<EditSectionData />} />
        <Route path="/admin/courses/delete" element={<DeleteCourseSection />} />
      </Routes>
    </Router>
  );
}

export default App;
