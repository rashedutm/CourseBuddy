// Timetable Service - API calls for timetable management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get timetable data by filters
export const getTimetableData = async (semesterNumber, intakeMonth, academicYear, facultyID) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/timetable?semesterNumber=${semesterNumber}&intakeMonth=${intakeMonth}&academicYear=${academicYear}&facultyID=${facultyID}`
        );
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch timetable data');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching timetable data:', error);
        throw error;
    }
};

// Get available semesters for dropdown
export const getAvailableSemesters = async (facultyID) => {
    try {
        const response = await fetch(`${API_BASE_URL}/timetable/semesters?facultyID=${facultyID}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch available semesters');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching available semesters:', error);
        throw error;
    }
};

// Delete timetable data
export const deleteTimetable = async (semesterNumber, intakeMonth, academicYear, facultyID) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/timetable/delete?semesterNumber=${semesterNumber}&intakeMonth=${intakeMonth}&academicYear=${academicYear}&facultyID=${facultyID}`,
            { method: 'DELETE' }
        );
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to delete timetable');
        }
        
        return data;
    } catch (error) {
        console.error('Error deleting timetable:', error);
        throw error;
    }
};

// Upload timetable file
export const uploadTimetable = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/timetable/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to upload timetable');
        }
        
        return data;
    } catch (error) {
        console.error('Error uploading timetable:', error);
        throw error;
    }
};

// Get sections for a specific course
export const getSectionsByCourse = async (courseCode, semesterNumber, intakeMonth, academicYear) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/timetable/sections?courseCode=${courseCode}&semesterNumber=${semesterNumber}&intakeMonth=${intakeMonth}&academicYear=${academicYear}`
        );
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch sections');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
};