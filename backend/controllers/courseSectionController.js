// Course Section Controller - Handles course and section management
// UC037: View Course and Section Data
// UC038: Edit Course Data
// UC039: Edit Section Data
// UC040: Delete Course or Section Entry

const courseSectionService = require('../services/courseSectionService');

// Get all courses with optional filters
// GET /api/courses?facultyID=FC&searchTerm=SCSE
exports.getCourses = async (req, res) => {
    try {
        const { facultyID, searchTerm } = req.query;
        
        const courses = await courseSectionService.getCourses({
            facultyID,
            searchTerm
        });

        res.json({
            success: true,
            data: courses,
            count: courses.length
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: err.message
        });
    }
};

// Get course details by course code
// GET /api/courses/:courseCode
exports.getCourseByCode = async (req, res) => {
    try {
        const { courseCode } = req.params;
        
        const course = await courseSectionService.getCourseByCode(courseCode);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course details',
            error: err.message
        });
    }
};

// Get all sections with filters
// GET /api/sections?facultyID=FC&semesterNumber=1&intakeMonth=October&academicYear=2024/2025
exports.getSections = async (req, res) => {
    try {
        const { facultyID, semesterNumber, intakeMonth, academicYear, courseCode } = req.query;
        
        const sections = await courseSectionService.getSections({
            facultyID,
            semesterNumber,
            intakeMonth,
            academicYear,
            courseCode
        });

        res.json({
            success: true,
            data: sections,
            count: sections.length
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sections',
            error: err.message
        });
    }
};

// Get sections for a specific course
// GET /api/sections/course/:courseCode?semesterNumber=1&intakeMonth=October&academicYear=2024/2025
exports.getSectionsByCourse = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const { semesterNumber, intakeMonth, academicYear } = req.query;

        if (!semesterNumber || !intakeMonth || !academicYear) {
            return res.status(400).json({
                success: false,
                message: 'Please provide semesterNumber, intakeMonth, and academicYear'
            });
        }

        const sections = await courseSectionService.getSectionsByCourse(
            courseCode,
            semesterNumber,
            intakeMonth,
            academicYear
        );

        res.json({
            success: true,
            data: sections
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sections',
            error: err.message
        });
    }
};

// Update course information
// PUT /api/courses/:courseCode
exports.updateCourse = async (req, res) => {
    try {
        const { courseCode } = req.params;
        const updateData = req.body;

        const result = await courseSectionService.updateCourse(courseCode, updateData);

        res.json({
            success: true,
            message: result.message,
            updated: result.updated,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update course',
            error: err.message
        });
    }
};

// Update section information
// PUT /api/sections/:sectionID
exports.updateSection = async (req, res) => {
    try {
        const { sectionID } = req.params;
        const updateData = req.body;

        const result = await courseSectionService.updateSection(sectionID, updateData);

        res.json({
            success: true,
            message: result.message,
            updated: result.updated,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update section',
            error: err.message
        });
    }
};

// Delete a course
// DELETE /api/courses/:courseCode
exports.deleteCourse = async (req, res) => {
    try {
        const { courseCode } = req.params;

        const result = await courseSectionService.deleteCourse(courseCode);

        res.json({
            success: true,
            message: result.message,
            deleted: result.deleted,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete course',
            error: err.message
        });
    }
};

// Delete a section
// DELETE /api/sections/:sectionID
exports.deleteSection = async (req, res) => {
    try {
        const { sectionID } = req.params;

        const result = await courseSectionService.deleteSection(sectionID);

        res.json({
            success: true,
            message: result.message,
            deleted: result.deleted,
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete section',
            error: err.message
        });
    }
};

// Create a new course
// POST /api/courses
exports.createCourse = async (req, res) => {
    try {
        const courseData = req.body;

        const result = await courseSectionService.createCourse(courseData);

        res.status(201).json({
            success: true,
            message: result.message,
            data: result
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create course',
            error: err.message
        });
    }
};

// Create a new section
// POST /api/sections
exports.createSection = async (req, res) => {
    try {
        const sectionData = req.body;

        const result = await courseSectionService.createSection(sectionData);

        res.status(201).json({
            success: true,
            message: result.message,
            data: result
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create section',
            error: err.message
        });
    }
};