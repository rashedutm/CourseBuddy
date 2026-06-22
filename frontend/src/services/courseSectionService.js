// Course Section Service - API calls for course and section management

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all courses with optional filters
export const getCourses = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.facultyID) queryParams.append('facultyID', filters.facultyID);
        if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);

        const response = await fetch(`${API_BASE_URL}/courses?${queryParams.toString()}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch courses');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

// Get course details by course code
export const getCourseByCode = async (courseCode) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseCode}`);
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch course details');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching course details:', error);
        throw error;
    }
};

// Get all sections with filters
export const getSections = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.facultyID) queryParams.append('facultyID', filters.facultyID);
        if (filters.semesterNumber) queryParams.append('semesterNumber', filters.semesterNumber);
        if (filters.intakeMonth) queryParams.append('intakeMonth', filters.intakeMonth);
        if (filters.academicYear) queryParams.append('academicYear', filters.academicYear);
        if (filters.courseCode) queryParams.append('courseCode', filters.courseCode);

        const response = await fetch(`${API_BASE_URL}/sections?${queryParams.toString()}`);
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

// Get sections for a specific course
export const getSectionsByCourse = async (courseCode, semesterNumber, intakeMonth, academicYear) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/sections/course/${courseCode}?semesterNumber=${semesterNumber}&intakeMonth=${intakeMonth}&academicYear=${academicYear}`
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

// Update course information
export const updateCourse = async (courseCode, updateData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseCode}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to update course');
        }
        
        return data;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

// Update section information
export const updateSection = async (sectionID, updateData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sections/${sectionID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to update section');
        }
        
        return data;
    } catch (error) {
        console.error('Error updating section:', error);
        throw error;
    }
};

// Delete a course
export const deleteCourse = async (courseCode) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseCode}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to delete course');
        }
        
        return data;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

// Delete a section
export const deleteSection = async (sectionID) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sections/${sectionID}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to delete section');
        }
        
        return data;
    } catch (error) {
        console.error('Error deleting section:', error);
        throw error;
    }
};

// Create a new course
export const createCourse = async (courseData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to create course');
        }
        
        return data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

// Create a new section
export const createSection = async (sectionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sectionData)
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to create section');
        }
        
        return data;
    } catch (error) {
        console.error('Error creating section:', error);
        throw error;
    }
};