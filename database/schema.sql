-- ============================================
-- CourseBuddy Database Schema
-- Final Version — All Subsystems Combined
-- Subsystem 3: Pattern Generation (Rashed)
-- Subsystem 4: Student Registration (Zimly)
-- Subsystem 5: User Management (Tarin)
-- Subsystem 6: Handbook & Timetable (Yousra)
-- ============================================

-- ============================================
-- AUTH DESIGN DECISION:
-- Single users table stores ALL users
-- Role auto-detected from email domain:
--   @graduate.utm.my = student
--   @utm.my = admin
-- No separate password or email in student/admins
-- All authentication goes through users table
-- ============================================

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Users
-- Single source of truth for all authentication
-- role auto-detected from email domain
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    userID VARCHAR(20) PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    matricNumber VARCHAR(20) NOT NULL UNIQUE,
    utmEmail VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SUBSYSTEM 5 (Tarin) — User Session
-- Stores active JWT login sessions
-- isRevoked: TRUE on logout or expiry
-- ============================================

CREATE TABLE IF NOT EXISTS user_session (
    sessionID VARCHAR(20) PRIMARY KEY,
    userID VARCHAR(20) NOT NULL,
    digitalAccessPass TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    isRevoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Password Reset
-- Stores password reset verification links
-- isUsed: TRUE once reset is completed
-- ============================================

CREATE TABLE IF NOT EXISTS password_reset (
    resetID VARCHAR(20) PRIMARY KEY,
    userID VARCHAR(20) NOT NULL,
    verificationLink VARCHAR(255) NOT NULL UNIQUE,
    expiresAt DATETIME NOT NULL,
    isUsed BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Academic Alert
-- Notifications for students and admins
-- priority: 'high' or 'low'
-- isRead: FALSE until user views it
-- ============================================

CREATE TABLE IF NOT EXISTS academic_alert (
    alertID VARCHAR(20) PRIMARY KEY,
    userID VARCHAR(20) NOT NULL,
    message VARCHAR(255) NOT NULL,
    priority ENUM('high', 'low') NOT NULL DEFAULT 'low',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Academic Planner
-- Personal degree-progress tracking (per-student
-- course completion), separate from the shared
-- `course`/`handbook_slot` tables used for pattern
-- generation/registration — different domain, so
-- named with a planner_ prefix to avoid any
-- ownership ambiguity with other subsystems' tables.
-- ============================================

-- catalogID rows are (intakeType, semesterNumber, courseCode)
-- specific — the same real courseCode can appear at a
-- different semesterNumber depending on intakeType.
CREATE TABLE IF NOT EXISTS planner_course_catalog (
    catalogID VARCHAR(20) PRIMARY KEY,
    programmeID VARCHAR(20) NOT NULL DEFAULT 'SCSEH',
    intakeType ENUM('October', 'March') NOT NULL,
    semesterNumber INT NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    courseName VARCHAR(150) NOT NULL,
    creditHours INT NOT NULL,
    prerequisiteNote VARCHAR(150),
    electiveGroup VARCHAR(100)
);

-- One row per student per real course code. Not scoped by
-- intakeType/semester because a student only ever follows one
-- intake track, so courseCode alone is unambiguous for them.
CREATE TABLE IF NOT EXISTS planner_course_status (
    statusID VARCHAR(20) PRIMARY KEY,
    userID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    status ENUM('not_taken', 'in_progress', 'completed', 'failed', 'dropped') NOT NULL DEFAULT 'not_taken',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_user_course (userID, courseCode),
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- Which semester a student says they're currently in. Everything up to
-- and including this semester is editable in the Planner; later
-- semesters stay read-only "Upcoming". Defaults to 2 (matching the
-- feature's original Sem 1-2-only rollout) for students who haven't
-- picked a value yet.
CREATE TABLE IF NOT EXISTS planner_student_progress (
    userID VARCHAR(20) PRIMARY KEY,
    currentSemester INT NOT NULL DEFAULT 2,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Admins
-- One admin per faculty
-- No email or password here — handled by users
-- facultyID is scope key for data isolation
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
    adminID INT PRIMARY KEY AUTO_INCREMENT,
    facultyID VARCHAR(20) NOT NULL UNIQUE,
    facultyName VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    userID VARCHAR(20) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Programme
-- Each programme belongs to one faculty only
-- e.g. Software Engineering (SCSEH) under FC
-- ============================================

CREATE TABLE IF NOT EXISTS programme (
    programmeID VARCHAR(20) PRIMARY KEY,
    programmeName VARCHAR(100) NOT NULL,
    facultyID VARCHAR(20) NOT NULL,
    FOREIGN KEY (facultyID) REFERENCES admins(facultyID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Intake
-- Supports multiple academic sessions
-- academicSession e.g. 2024/2025, 2025/2026
-- intakeNumber: 1 = October, 2 = March
-- ============================================

CREATE TABLE IF NOT EXISTS intake (
    intakeID VARCHAR(20) PRIMARY KEY,
    intakeName VARCHAR(50) NOT NULL,
    intakeMonth ENUM('October', 'March') NOT NULL,
    academicSession VARCHAR(20) NOT NULL,
    intakeNumber INT NOT NULL,
    intakeYear INT NOT NULL
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Semester
-- Each semester belongs to an intake
-- ============================================

CREATE TABLE IF NOT EXISTS semester (
    semesterID VARCHAR(20) PRIMARY KEY,
    intakeID VARCHAR(20) NOT NULL,
    semesterNumber INT NOT NULL,
    semesterName VARCHAR(50) NOT NULL,
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Student
-- No email or password here — handled by users
-- Links to programme, intake and users
-- Student manually selects semester each time (UC001)
-- No automatic semester tracking needed
-- ============================================

CREATE TABLE IF NOT EXISTS student (
    studentID VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    programmeID VARCHAR(20) NOT NULL,
    intakeID VARCHAR(20) NOT NULL,
    userID VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (programmeID) REFERENCES programme(programmeID),
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID),
    FOREIGN KEY (userID) REFERENCES users(userID)
);

-- ============================================
-- GLOBAL COURSE POOL
-- All courses from all faculties stored here
-- ownerFacultyID = faculty who owns this course
-- Course code always 8 chars: 4 letters + 4 numbers
-- Cross-faculty courses have lowercase x in code
-- ============================================

CREATE TABLE IF NOT EXISTS course (
    courseCode VARCHAR(20) PRIMARY KEY,
    courseName VARCHAR(150) NOT NULL,
    creditHours INT NOT NULL,
    ownerFacultyID VARCHAR(20) NOT NULL,
    hasPrerequisite BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerFacultyID) REFERENCES admins(facultyID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Prerequisite
-- A course can have multiple prerequisites
-- ============================================

CREATE TABLE IF NOT EXISTS prerequisite (
    prerequisiteID VARCHAR(20) PRIMARY KEY,
    courseCode VARCHAR(20) NOT NULL,
    prerequisiteCourseCode VARCHAR(20) NOT NULL,
    isMandatory BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (prerequisiteCourseCode) REFERENCES course(courseCode)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Handbook Slot
-- Semester plan per programme AND intake
-- Each intake has its own handbook
-- slotType:
--   fixed          = must take, no choice
--   elective_group = pick X from defined list
--   free_elective  = any course matching pattern
--                    from a different faculty
-- pickCount = how many to pick from this slot
-- codePattern = e.g. SxxXxxx3 for free elective
-- ============================================

CREATE TABLE IF NOT EXISTS handbook_slot (
    slotID VARCHAR(20) PRIMARY KEY,
    programmeID VARCHAR(20) NOT NULL,
    intakeID VARCHAR(20) NOT NULL,
    semesterNumber INT NOT NULL,
    slotType ENUM('fixed', 'elective_group', 'free_elective') NOT NULL,
    slotLabel VARCHAR(100),
    pickCount INT DEFAULT 1,
    codePattern VARCHAR(20),
    FOREIGN KEY (programmeID) REFERENCES programme(programmeID),
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Handbook Slot Course
-- Links specific courses to handbook slots
-- Used for fixed and elective_group only
-- free_elective matched at runtime via codePattern
-- ============================================

CREATE TABLE IF NOT EXISTS handbook_slot_course (
    slotCourseID VARCHAR(20) PRIMARY KEY,
    slotID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    FOREIGN KEY (slotID) REFERENCES handbook_slot(slotID),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Handbook Upload Log
-- Tracks every handbook upload event
-- Who uploaded it, when, for which programme
-- and intake
-- ============================================

CREATE TABLE IF NOT EXISTS handbook_upload_log (
    uploadLogID VARCHAR(20) PRIMARY KEY,
    programmeID VARCHAR(20) NOT NULL,
    intakeID VARCHAR(20) NOT NULL,
    semesterNumber INT NOT NULL,
    uploadedBy VARCHAR(20) NOT NULL,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    fileName VARCHAR(255),
    status ENUM('success', 'failed') NOT NULL DEFAULT 'success',
    FOREIGN KEY (programmeID) REFERENCES programme(programmeID),
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID),
    FOREIGN KEY (uploadedBy) REFERENCES admins(facultyID)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Section (Timetable)
-- Uploaded every semester by faculty admin
-- Only offered courses have sections
-- academicYear e.g. 2026/2027-1 or 2026/2027-2
-- CASCADE DELETE: course deleted = sections deleted
-- ============================================

CREATE TABLE IF NOT EXISTS section (
    sectionID VARCHAR(20) PRIMARY KEY,
    courseCode VARCHAR(20) NOT NULL,
    sectionNumber VARCHAR(10) NOT NULL,
    lecturerID VARCHAR(20),
    lecturerName VARCHAR(100),
    day ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat') NOT NULL,
    timeStart TIME NOT NULL,
    timeEnd TIME NOT NULL,
    timeSlot VARCHAR(20),
    venue VARCHAR(50),
    facultyID VARCHAR(20) NOT NULL,
    semesterNumber INT NOT NULL,
    intakeMonth ENUM('October', 'March') NOT NULL,
    academicYear VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (courseCode) REFERENCES course(courseCode) ON DELETE CASCADE,
    FOREIGN KEY (facultyID) REFERENCES admins(facultyID)
);

-- ============================================
-- SUBSYSTEM 6 (Yousra) — Timetable Upload Log
-- Tracks every timetable upload event
-- Who uploaded it, when, for which semester
-- and academic year
-- ============================================

CREATE TABLE IF NOT EXISTS timetable_upload_log (
    uploadLogID VARCHAR(20) PRIMARY KEY,
    facultyID VARCHAR(20) NOT NULL,
    semesterNumber INT NOT NULL,
    intakeMonth ENUM('October', 'March') NOT NULL,
    academicYear VARCHAR(20) NOT NULL,
    uploadedBy VARCHAR(20) NOT NULL,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    fileName VARCHAR(255),
    totalSectionsUploaded INT DEFAULT 0,
    status ENUM('success', 'failed', 'partial') NOT NULL DEFAULT 'success',
    FOREIGN KEY (facultyID) REFERENCES admins(facultyID),
    FOREIGN KEY (uploadedBy) REFERENCES admins(facultyID)
);

-- ============================================
-- FREE ELECTIVE OFFERING
-- Each faculty uploads free elective list
-- separately from timetable every semester
-- Rules:
--   1. Code must match student's codePattern
--   2. offeringFacultyID != student's facultyID
--   3. Students cannot take own faculty's electives
-- ============================================

CREATE TABLE IF NOT EXISTS free_elective_offering (
    offeringID VARCHAR(20) PRIMARY KEY,
    courseCode VARCHAR(20) NOT NULL,
    offeringFacultyID VARCHAR(20) NOT NULL,
    intakeMonth ENUM('October', 'March') NOT NULL,
    academicYear VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (offeringFacultyID) REFERENCES admins(facultyID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Lecturer
-- For lecturer preference filtering
-- ============================================

CREATE TABLE IF NOT EXISTS lecturer (
    lecturerID VARCHAR(20) PRIMARY KEY,
    lecturerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    facultyID VARCHAR(20),
    FOREIGN KEY (facultyID) REFERENCES admins(facultyID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Selected Course
-- Courses student picks for pattern generation
-- ============================================

CREATE TABLE IF NOT EXISTS selected_course (
    selectionID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    selectionDate DATE NOT NULL,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Pattern Generation
-- ============================================

CREATE TABLE IF NOT EXISTS pattern (
    patternID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    totalCourses INT NOT NULL,
    totalCreditHours INT NOT NULL,
    generatedDate DATE NOT NULL,
    isSelected BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

CREATE TABLE IF NOT EXISTS pattern_detail (
    patternDetailID VARCHAR(20) PRIMARY KEY,
    patternID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    sectionID VARCHAR(20) NOT NULL,
    FOREIGN KEY (patternID) REFERENCES pattern(patternID),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (sectionID) REFERENCES section(sectionID)
);

CREATE TABLE IF NOT EXISTS registration_history (
    historyID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    patternID VARCHAR(20) NOT NULL,
    selectedDate DATE NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (patternID) REFERENCES pattern(patternID)
);

-- ============================================
-- SUBSYSTEM 3 (Rashed) — Lecturer Preference
-- ============================================

CREATE TABLE IF NOT EXISTS lecturer_preference (
    preferenceID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    lecturerID VARCHAR(20) NOT NULL,
    isConfirmed BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT TRUE,
    createdDate DATE NOT NULL,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (lecturerID) REFERENCES lecturer(lecturerID)
);

CREATE TABLE IF NOT EXISTS filtered_pattern (
    filteredPatternID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    isPreferenceApplied BOOLEAN DEFAULT TRUE,
    totalCourses INT NOT NULL,
    totalCreditHours INT NOT NULL,
    generatedDate DATE NOT NULL,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

CREATE TABLE IF NOT EXISTS filtered_pattern_detail (
    filteredPatternDetailID VARCHAR(20) PRIMARY KEY,
    filteredPatternID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    sectionID VARCHAR(20) NOT NULL,
    lecturerID VARCHAR(20) NOT NULL,
    FOREIGN KEY (filteredPatternID) REFERENCES filtered_pattern(filteredPatternID),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (sectionID) REFERENCES section(sectionID),
    FOREIGN KEY (lecturerID) REFERENCES lecturer(lecturerID)
);

CREATE TABLE IF NOT EXISTS preference_reset_log (
    resetLogID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    resetDate DATE NOT NULL,
    resetReason VARCHAR(255),
    regeneratedWithoutPreference BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (studentID) REFERENCES student(studentID)
);

-- ============================================
-- SUBSYSTEM 4 (Zimly) — Draft Vault
-- Student saves pattern drafts before
-- selecting their final blueprint
-- ============================================

CREATE TABLE IF NOT EXISTS draft_vault (
    draftID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    draftName VARCHAR(100) NOT NULL,
    patternData TEXT NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    createdDate DATE NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

-- ============================================
-- SUBSYSTEM 4 (Zimly) — Course Registration Status
-- Per-course registration status after student
-- attempts registration on UTM portal
-- courseStatus: 'registered', 'failed', 'pending'
-- ============================================

CREATE TABLE IF NOT EXISTS course_registration_status (
    statusID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    courseCode VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    courseStatus ENUM('registered', 'failed', 'pending') NOT NULL DEFAULT 'pending',
    reportedDate DATE NOT NULL,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

-- ============================================
-- SUBSYSTEM 4 (Zimly) — Semester Status
-- Overall registration status per semester
-- status: 'complete', 'partial', 'pending'
-- ============================================

CREATE TABLE IF NOT EXISTS semester_status (
    semesterStatusID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    status ENUM('complete', 'partial', 'pending') NOT NULL DEFAULT 'pending',
    totalCourses INT NOT NULL,
    registeredCourses INT DEFAULT 0,
    failedCourses INT DEFAULT 0,
    updatedDate DATE NOT NULL,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

-- ============================================
-- SUBSYSTEM 4 (Zimly) — Recovery Pattern
-- Clash-free patterns for failed courses only
-- Separate from main pattern table
-- ============================================

CREATE TABLE IF NOT EXISTS recovery_pattern (
    recoveryID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    patternData TEXT NOT NULL,
    generatedDate DATE NOT NULL,
    isSelected BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

-- ============================================
-- SUBSYSTEM 4 (Zimly) — Academic Profile
-- Student academic profile for Add/Drop
-- impact simulation
-- ============================================

CREATE TABLE IF NOT EXISTS academic_profile (
    profileID VARCHAR(20) PRIMARY KEY,
    studentID VARCHAR(20) NOT NULL UNIQUE,
    programmeID VARCHAR(20) NOT NULL,
    currentYear INT NOT NULL,
    currentSemester INT NOT NULL,
    totalCreditsCompleted INT DEFAULT 0,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    updatedDate DATE NOT NULL,
    FOREIGN KEY (studentID) REFERENCES student(studentID),
    FOREIGN KEY (programmeID) REFERENCES programme(programmeID)
);
