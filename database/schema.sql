-- ============================================
-- CourseBuddy Database Schema
-- Subsystem 3: Pattern Generation & Clash Detection
-- Owner: Rashed
-- ============================================

-- Note: Student, Intake, Semester tables are shared across subsystems.
-- Coordinate with Tarin (User Management) before running this if those
-- tables already exist from their schema file.

CREATE TABLE IF NOT EXISTS intake (
    intakeID VARCHAR(20) PRIMARY KEY,
    intakeName VARCHAR(50) NOT NULL,
    intakeMonth VARCHAR(20) NOT NULL,
    intakeYear INT NOT NULL
);

CREATE TABLE IF NOT EXISTS semester (
    semesterID VARCHAR(20) PRIMARY KEY,
    intakeID VARCHAR(20) NOT NULL,
    semesterNumber INT NOT NULL,
    semesterName VARCHAR(50) NOT NULL,
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID)
);

CREATE TABLE IF NOT EXISTS student (
    studentID VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    programme VARCHAR(100),
    intakeID VARCHAR(20),
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID)
);

CREATE TABLE IF NOT EXISTS handbook (
    handbookID VARCHAR(20) PRIMARY KEY,
    intakeID VARCHAR(20) NOT NULL,
    semesterID VARCHAR(20) NOT NULL,
    uploadedBy VARCHAR(20),
    uploadDate DATE NOT NULL,
    FOREIGN KEY (intakeID) REFERENCES intake(intakeID),
    FOREIGN KEY (semesterID) REFERENCES semester(semesterID)
);

CREATE TABLE IF NOT EXISTS course (
    courseCode VARCHAR(20) PRIMARY KEY,
    handbookID VARCHAR(20) NOT NULL,
    courseName VARCHAR(100) NOT NULL,
    creditHours INT NOT NULL,
    hasPrerequisite BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (handbookID) REFERENCES handbook(handbookID)
);

CREATE TABLE IF NOT EXISTS prerequisite (
    prerequisiteID VARCHAR(20) PRIMARY KEY,
    courseCode VARCHAR(20) NOT NULL,
    prerequisiteCourseCode VARCHAR(20) NOT NULL,
    isMandatory BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (prerequisiteCourseCode) REFERENCES course(courseCode)
);

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

CREATE TABLE IF NOT EXISTS lecturer (
    lecturerID VARCHAR(20) PRIMARY KEY,
    lecturerName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    faculty VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS section (
    sectionID VARCHAR(20) PRIMARY KEY,
    courseCode VARCHAR(20) NOT NULL,
    sectionNumber VARCHAR(10) NOT NULL,
    lecturerID VARCHAR(20),
    day VARCHAR(20) NOT NULL,
    timeStart TIME NOT NULL,
    timeEnd TIME NOT NULL,
    venue VARCHAR(50),
    FOREIGN KEY (courseCode) REFERENCES course(courseCode),
    FOREIGN KEY (lecturerID) REFERENCES lecturer(lecturerID)
);

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
