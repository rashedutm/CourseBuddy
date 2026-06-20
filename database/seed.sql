-- ============================================
-- CourseBuddy Seed Data
-- Real UTM Data — SCSEH Programme
-- Intake: 2024/2025 - 1 (October)
-- ============================================

-- ============================================
-- USERS
-- All users stored here first
-- Passwords are bcrypt hash of 'Password123'
-- In real system passwords set during registration
-- ============================================

INSERT INTO users (userID, fullName, matricNumber, utmEmail, passwordHash, role) VALUES
-- Admin
('USR-ADM-001', 'Dr. Johana', 'STAFF001', 'Johana@utm.my', '$2b$10$examplehashedpasswordadmin001xx', 'admin'),
-- Students
('USR-STU-001', 'MD RASHEDUR RAHMAN', 'A24CS4024', 'mdrashedurrahman@graduate.utm.my', '$2b$10$examplehashedpasswordstu001xxxx', 'student'),
('USR-STU-002', 'Fatima Sanjina Yousra', 'A24CS0011', 'yousra@graduate.utm.my', '$2b$10$examplehashedpasswordstu002xxxx', 'student'),
('USR-STU-003', 'Shahtaj Zimly Shiney', 'A24CS4034', 'zimly@graduate.utm.my', '$2b$10$examplehashedpasswordstu003xxxx', 'student'),
('USR-STU-004', 'Fariha Ahmed Tarin', 'A24CS4036', 'tarin@graduate.utm.my', '$2b$10$examplehashedpasswordstu004xxxx', 'student');

-- ============================================
-- ADMINS
-- Faculty of Computing admin
-- ============================================

INSERT INTO admins (facultyID, facultyName, name, userID) VALUES
('FC', 'Faculty of Computing', 'Dr. Johana', 'USR-ADM-001');

-- ============================================
-- PROGRAMME
-- Software Engineering under Faculty of Computing
-- ============================================

INSERT INTO programme (programmeID, programmeName, facultyID) VALUES
('SCSEH', 'Bachelor in Software Engineering with Honours', 'FC');

-- ============================================
-- INTAKE
-- 2024/2025 - 1 (October intake)
-- ============================================

INSERT INTO intake (intakeID, intakeName, intakeMonth, academicSession, intakeNumber, intakeYear) VALUES
('IN-2024-1', 'October 2024', 'October', '2024/2025', 1, 2024);

-- ============================================
-- SEMESTER
-- 8 semesters for October 2024 intake
-- ============================================

INSERT INTO semester (semesterID, intakeID, semesterNumber, semesterName) VALUES
('SEM-2024-1-1', 'IN-2024-1', 1, 'Year 1 Semester 1'),
('SEM-2024-1-2', 'IN-2024-1', 2, 'Year 1 Semester 2'),
('SEM-2024-1-3', 'IN-2024-1', 3, 'Year 2 Semester 1'),
('SEM-2024-1-4', 'IN-2024-1', 4, 'Year 2 Semester 2'),
('SEM-2024-1-5', 'IN-2024-1', 5, 'Year 3 Semester 1'),
('SEM-2024-1-6', 'IN-2024-1', 6, 'Year 3 Semester 2'),
('SEM-2024-1-7', 'IN-2024-1', 7, 'Year 4 Semester 1'),
('SEM-2024-1-8', 'IN-2024-1', 8, 'Year 4 Semester 2');

-- ============================================
-- STUDENTS
-- All 4 team members as test students
-- ============================================

INSERT INTO student (studentID, name, programmeID, intakeID, userID) VALUES
('A24CS4024', 'MD RASHEDUR RAHMAN', 'SCSEH', 'IN-2024-1', 'USR-STU-001'),
('A24CS0011', 'Fatima Sanjina Yousra', 'SCSEH', 'IN-2024-1', 'USR-STU-002'),
('A24CS4034', 'Shahtaj Zimly Shiney', 'SCSEH', 'IN-2024-1', 'USR-STU-003'),
('A24CS4036', 'Fariha Ahmed Tarin', 'SCSEH', 'IN-2024-1', 'USR-STU-004');

-- ============================================
-- COURSES
-- All courses from SCSEH handbook
-- ownerFacultyID = FC for all SCSE/SCSR/SCST/SCSM/SCSB/SCSP courses
-- ULRS/UHLB/UHLM courses owned by respective faculties
-- For seed purposes all set to FC
-- ============================================

-- Semester 1 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSE1013', 'Fundamental Programming Concept', 3, 'FC', FALSE),
('SCST1123', 'Mathematics for Software Engineer', 3, 'FC', FALSE),
('SCSR1013', 'Digital Logic', 3, 'FC', FALSE),
('SCST1143', 'Database Engineering', 3, 'FC', FALSE),
('ULRS1032', 'Integrity and Anti-Corruption', 2, 'FC', FALSE);

-- Semester 2 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSE1203', 'Software Engineering Principles', 3, 'FC', TRUE),
('SCSR1033', 'Computer Organization and Architecture', 3, 'FC', TRUE),
('SCST1223', 'Probability and Statistical Data Analysis', 3, 'FC', FALSE),
('SCSE1224', 'Advanced Programming', 4, 'FC', TRUE),
('SCSR2213', 'Network Communications', 3, 'FC', FALSE),
('UHLM1012', 'Malaysia Language for Communication 2', 2, 'FC', FALSE);

-- Semester 3 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSE2133', 'Software Process and Project Management', 3, 'FC', TRUE),
('SCSE2123', 'Software Requirements Engineering', 3, 'FC', TRUE),
('SCSE2103', 'Data Structure and Algorithm', 3, 'FC', TRUE),
('SCSR2043', 'Operating Systems', 3, 'FC', FALSE),
('SCSM2113', 'Human Computer Interaction Fundamentals', 3, 'FC', TRUE);

-- Semester 4 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSM2223', 'Cross-Platform Application Development', 3, 'FC', TRUE),
('SCSE2233', 'Software Design and Architecture', 3, 'FC', TRUE),
('SCSE2243', 'Application Development Project I', 3, 'FC', TRUE),
('UHLB2122', 'Professional Communication Skills 1', 2, 'FC', FALSE),
('ULRS1022', 'Philosophy and Current Issues', 2, 'FC', FALSE),
('SCSB2103', 'Bioinformatics I', 3, 'FC', FALSE),
('SCSP2753', 'Data Mining', 3, 'FC', FALSE),
('SCSP3213', 'Business Intelligence', 3, 'FC', FALSE);

-- Semester 5 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('UHLB3132', 'Professional Communication Skills', 2, 'FC', FALSE),
('SCST3223', 'Data Analytic Programming', 3, 'FC', FALSE),
('SCSE3143', 'Ubiquitous Computing', 3, 'FC', FALSE),
('SCSR3113', 'Cloud Computing', 3, 'FC', FALSE),
('SCSE3103', 'Cognitive Computing', 3, 'FC', FALSE),
('SCSE3203', 'Special Topics', 3, 'FC', FALSE),
('SCSM3113', 'Virtual and Augmented Reality Application', 3, 'FC', FALSE);

-- Foreign language elective options (Sem 5)
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('UHLA1122', 'Arabic Language', 2, 'FC', FALSE),
('UHLM1122', 'Mandarin Language', 2, 'FC', FALSE),
('UHLF1122', 'French Language', 2, 'FC', FALSE),
('UHLJ1122', 'Japanese Language', 2, 'FC', FALSE);

-- Semester 6 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSE3242', 'Software Engineering Project I', 2, 'FC', TRUE),
('SCSR3133', 'Secure Software Programming', 3, 'FC', TRUE),
('SCSE3213', 'Software Quality and Testing', 3, 'FC', TRUE),
('SCSE3223', 'Application Development Project II', 3, 'FC', TRUE),
('SCSE3233', 'Professional Practice in Software Engineering', 3, 'FC', TRUE),
('ULRS3032', 'Entrepreneurship and Innovation', 2, 'FC', FALSE);

-- Semester 7 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSE4108', 'Industrial Training', 8, 'FC', TRUE),
('SCSE4114', 'Industrial Training Report', 4, 'FC', TRUE);

-- Semester 8 courses
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SCSE4214', 'Software Engineering Project II', 4, 'FC', TRUE),
('SCSR4453', 'Network Security', 3, 'FC', FALSE),
('SCSR4973', 'Computer Network and Security Special Topics', 3, 'FC', FALSE),
('SECB3133', 'Computational Biology I', 3, 'FC', FALSE),
('SCSB3203', 'Programming for Bioinformatics', 3, 'FC', FALSE);

-- ============================================
-- PREREQUISITES
-- Based on handbook data
-- ============================================

INSERT INTO prerequisite (prerequisiteID, courseCode, prerequisiteCourseCode, isMandatory) VALUES
-- Semester 2
('PR001', 'SCSE1203', 'SCSE1013', TRUE),
('PR002', 'SCSR1033', 'SCSE1013', TRUE),
('PR003', 'SCSE1224', 'SCSE1013', TRUE),
-- Semester 3
('PR004', 'SCSE2133', 'SCSE1203', TRUE),
('PR005', 'SCSE2123', 'SCSE1203', TRUE),
('PR006', 'SCSE2103', 'SCSE1013', TRUE),
('PR007', 'SCSM2113', 'SCSE1203', TRUE),
-- Semester 4
('PR008', 'SCSM2223', 'SCST1143', TRUE),
('PR009', 'SCSE2233', 'SCSE1203', TRUE),
('PR010', 'SCSE2243', 'SCSE1203', TRUE),
('PR011', 'SCSE2243', 'SCSE2123', TRUE),
-- Semester 6
('PR012', 'SCSE3242', 'SCSE2243', TRUE),
('PR013', 'SCSR3133', 'SCSR2213', TRUE),
('PR014', 'SCSE3213', 'SCSE2123', TRUE),
('PR015', 'SCSE3213', 'SCSE2233', TRUE),
('PR016', 'SCSE3223', 'SCSE2243', TRUE),
('PR017', 'SCSE3233', 'SCSE1203', TRUE),
-- Semester 7
('PR018', 'SCSE4108', 'SCSE1013', FALSE),
('PR019', 'SCSE4114', 'SCSE1013', FALSE),
-- Semester 8
('PR020', 'SCSE4214', 'SCSE3242', TRUE);

-- ============================================
-- HANDBOOK SLOTS
-- Defines the semester plan for SCSEH
-- Intake: 2024/2025 - 1
-- ============================================

-- SEMESTER 1 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-1-1', 'SCSEH', 'IN-2024-1', 1, 'fixed', 'Fundamental Programming Concept', 1, NULL),
('HS-1-2', 'SCSEH', 'IN-2024-1', 1, 'fixed', 'Mathematics for Software Engineer', 1, NULL),
('HS-1-3', 'SCSEH', 'IN-2024-1', 1, 'fixed', 'Digital Logic', 1, NULL),
('HS-1-4', 'SCSEH', 'IN-2024-1', 1, 'fixed', 'Database Engineering', 1, NULL),
('HS-1-5', 'SCSEH', 'IN-2024-1', 1, 'fixed', 'Integrity and Anti-Corruption', 1, NULL),
('HS-1-6', 'SCSEH', 'IN-2024-1', 1, 'free_elective', 'Free Elective I', 1, 'Sxxxxx3');

-- SEMESTER 2 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-2-1', 'SCSEH', 'IN-2024-1', 2, 'fixed', 'Software Engineering Principles', 1, NULL),
('HS-2-2', 'SCSEH', 'IN-2024-1', 2, 'fixed', 'Computer Organization and Architecture', 1, NULL),
('HS-2-3', 'SCSEH', 'IN-2024-1', 2, 'fixed', 'Probability and Statistical Data Analysis', 1, NULL),
('HS-2-4', 'SCSEH', 'IN-2024-1', 2, 'fixed', 'Advanced Programming', 1, NULL),
('HS-2-5', 'SCSEH', 'IN-2024-1', 2, 'fixed', 'Network Communications', 1, NULL),
('HS-2-6', 'SCSEH', 'IN-2024-1', 2, 'fixed', 'Malaysia Language for Communication 2', 1, NULL);

-- SEMESTER 3 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-3-1', 'SCSEH', 'IN-2024-1', 3, 'fixed', 'Software Process and Project Management', 1, NULL),
('HS-3-2', 'SCSEH', 'IN-2024-1', 3, 'fixed', 'Software Requirements Engineering', 1, NULL),
('HS-3-3', 'SCSEH', 'IN-2024-1', 3, 'fixed', 'Data Structure and Algorithm', 1, NULL),
('HS-3-4', 'SCSEH', 'IN-2024-1', 3, 'fixed', 'Operating Systems', 1, NULL),
('HS-3-5', 'SCSEH', 'IN-2024-1', 3, 'fixed', 'Human Computer Interaction Fundamentals', 1, NULL),
('HS-3-6', 'SCSEH', 'IN-2024-1', 3, 'free_elective', 'Service Learning and Community Engagement', 1, 'UKQF2xx2');

-- SEMESTER 4 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-4-1', 'SCSEH', 'IN-2024-1', 4, 'fixed', 'Cross-Platform Application Development', 1, NULL),
('HS-4-2', 'SCSEH', 'IN-2024-1', 4, 'fixed', 'Software Design and Architecture', 1, NULL),
('HS-4-3', 'SCSEH', 'IN-2024-1', 4, 'fixed', 'Application Development Project I', 1, NULL),
('HS-4-4', 'SCSEH', 'IN-2024-1', 4, 'fixed', 'Professional Communication Skills 1', 1, NULL),
('HS-4-5', 'SCSEH', 'IN-2024-1', 4, 'fixed', 'Philosophy and Current Issues', 1, NULL),
('HS-4-6', 'SCSEH', 'IN-2024-1', 4, 'elective_group', 'Choose 1 from Elective Group', 1, NULL);

-- SEMESTER 5 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-5-1', 'SCSEH', 'IN-2024-1', 5, 'fixed', 'Professional Communication Skills', 1, NULL),
('HS-5-2', 'SCSEH', 'IN-2024-1', 5, 'elective_group', 'Foreign Language Elective', 1, NULL),
('HS-5-3', 'SCSEH', 'IN-2024-1', 5, 'free_elective', 'Free Elective II', 1, 'SxxXxxx3'),
('HS-5-4', 'SCSEH', 'IN-2024-1', 5, 'elective_group', 'Choose 3 from Core Elective Group', 3, NULL);

-- SEMESTER 6 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-6-1', 'SCSEH', 'IN-2024-1', 6, 'fixed', 'Software Engineering Project I', 1, NULL),
('HS-6-2', 'SCSEH', 'IN-2024-1', 6, 'fixed', 'Secure Software Programming', 1, NULL),
('HS-6-3', 'SCSEH', 'IN-2024-1', 6, 'fixed', 'Software Quality and Testing', 1, NULL),
('HS-6-4', 'SCSEH', 'IN-2024-1', 6, 'fixed', 'Application Development Project II', 1, NULL),
('HS-6-5', 'SCSEH', 'IN-2024-1', 6, 'fixed', 'Professional Practice in Software Engineering', 1, NULL),
('HS-6-6', 'SCSEH', 'IN-2024-1', 6, 'fixed', 'Entrepreneurship and Innovation', 1, NULL);

-- SEMESTER 7 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-7-1', 'SCSEH', 'IN-2024-1', 7, 'fixed', 'Industrial Training', 1, NULL),
('HS-7-2', 'SCSEH', 'IN-2024-1', 7, 'fixed', 'Industrial Training Report', 1, NULL);

-- SEMESTER 8 SLOTS
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-8-1', 'SCSEH', 'IN-2024-1', 8, 'fixed', 'Software Engineering Project II', 1, NULL),
('HS-8-2', 'SCSEH', 'IN-2024-1', 8, 'free_elective', 'Free Elective III', 1, 'SxxXxxx3'),
('HS-8-3', 'SCSEH', 'IN-2024-1', 8, 'free_elective', 'Free Elective IV', 1, 'SxxXxxx3'),
('HS-8-4', 'SCSEH', 'IN-2024-1', 8, 'elective_group', 'Choose 2 from Final Elective Group', 2, NULL);

-- ============================================
-- HANDBOOK SLOT COURSES
-- Links courses to their slots
-- Only for fixed and elective_group slots
-- ============================================

-- Semester 1 fixed courses
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-1-1', 'HS-1-1', 'SCSE1013'),
('HSC-1-2', 'HS-1-2', 'SCST1123'),
('HSC-1-3', 'HS-1-3', 'SCSR1013'),
('HSC-1-4', 'HS-1-4', 'SCST1143'),
('HSC-1-5', 'HS-1-5', 'ULRS1032');

-- Semester 2 fixed courses
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-2-1', 'HS-2-1', 'SCSE1203'),
('HSC-2-2', 'HS-2-2', 'SCSR1033'),
('HSC-2-3', 'HS-2-3', 'SCST1223'),
('HSC-2-4', 'HS-2-4', 'SCSE1224'),
('HSC-2-5', 'HS-2-5', 'SCSR2213'),
('HSC-2-6', 'HS-2-6', 'UHLM1012');

-- Semester 3 fixed courses
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-3-1', 'HS-3-1', 'SCSE2133'),
('HSC-3-2', 'HS-3-2', 'SCSE2123'),
('HSC-3-3', 'HS-3-3', 'SCSE2103'),
('HSC-3-4', 'HS-3-4', 'SCSR2043'),
('HSC-3-5', 'HS-3-5', 'SCSM2113');

-- Semester 4 fixed courses
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-4-1', 'HS-4-1', 'SCSM2223'),
('HSC-4-2', 'HS-4-2', 'SCSE2233'),
('HSC-4-3', 'HS-4-3', 'SCSE2243'),
('HSC-4-4', 'HS-4-4', 'UHLB2122'),
('HSC-4-5', 'HS-4-5', 'ULRS1022');

-- Semester 4 elective group (choose 1 from 3)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-4-6', 'HS-4-6', 'SCSB2103'),
('HSC-4-7', 'HS-4-6', 'SCSP2753'),
('HSC-4-8', 'HS-4-6', 'SCSP3213');

-- Semester 5 fixed course
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-5-1', 'HS-5-1', 'UHLB3132');

-- Semester 5 foreign language elective (choose 1 from 4)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-5-2', 'HS-5-2', 'UHLA1122'),
('HSC-5-3', 'HS-5-2', 'UHLM1122'),
('HSC-5-4', 'HS-5-2', 'UHLF1122'),
('HSC-5-5', 'HS-5-2', 'UHLJ1122');

-- Semester 5 core elective group (choose 3 from 6)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-5-6', 'HS-5-4', 'SCST3223'),
('HSC-5-7', 'HS-5-4', 'SCSE3143'),
('HSC-5-8', 'HS-5-4', 'SCSR3113'),
('HSC-5-9', 'HS-5-4', 'SCSE3103'),
('HSC-5-10', 'HS-5-4', 'SCSE3203'),
('HSC-5-11', 'HS-5-4', 'SCSM3113');

-- Semester 6 fixed courses
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-6-1', 'HS-6-1', 'SCSE3242'),
('HSC-6-2', 'HS-6-2', 'SCSR3133'),
('HSC-6-3', 'HS-6-3', 'SCSE3213'),
('HSC-6-4', 'HS-6-4', 'SCSE3223'),
('HSC-6-5', 'HS-6-5', 'SCSE3233'),
('HSC-6-6', 'HS-6-6', 'ULRS3032');

-- Semester 7 fixed courses
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-7-1', 'HS-7-1', 'SCSE4108'),
('HSC-7-2', 'HS-7-2', 'SCSE4114');

-- Semester 8 fixed course
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-8-1', 'HS-8-1', 'SCSE4214');

-- Semester 8 elective group (choose 2 from 6)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-8-2', 'HS-8-4', 'SCSR4453'),
('HSC-8-3', 'HS-8-4', 'SCSR4973'),
('HSC-8-4', 'HS-8-4', 'SECB3133'),
('HSC-8-5', 'HS-8-4', 'SCSB3203');

-- ============================================
-- LECTURERS
-- Sample lecturers for Faculty of Computing
-- ============================================

INSERT INTO lecturer (lecturerID, lecturerName, email, facultyID) VALUES
('LEC-001', 'Dr. Ahmad Zaki', 'ahmadzaki@utm.my', 'FC'),
('LEC-002', 'Dr. Nurul Ain', 'nurulain@utm.my', 'FC'),
('LEC-003', 'Dr. Siti Hajar', 'sitihajar@utm.my', 'FC'),
('LEC-004', 'Prof. Mohd Faris', 'mohdFaris@utm.my', 'FC'),
('LEC-005', 'Dr. Rashidah', 'rashidah@utm.my', 'FC'),
('LEC-006', 'Dr. Hafizul', 'hafizul@utm.my', 'FC'),
('LEC-007', 'Dr. Johana', 'Johana@utm.my', 'FC');

-- ============================================
-- SECTIONS (TIMETABLE)
-- Sample timetable for Semester 1
-- Academic Year: 2024/2025-1
-- Note: Replace with real timetable data
-- when available
-- ============================================

INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
-- SCSE1013 sections
('SEC-001', 'SCSE1013', '01', 'LEC-001', 'Dr. Ahmad Zaki', 'Mon', '08:00:00', '10:00:00', '08:00-10:00', 'N28-1', 'FC', 1, 'October', '2024/2025-1'),
('SEC-002', 'SCSE1013', '02', 'LEC-001', 'Dr. Ahmad Zaki', 'Mon', '10:00:00', '12:00:00', '10:00-12:00', 'N28-1', 'FC', 1, 'October', '2024/2025-1'),
('SEC-003', 'SCSE1013', '03', 'LEC-002', 'Dr. Nurul Ain', 'Tue', '08:00:00', '10:00:00', '08:00-10:00', 'N28-2', 'FC', 1, 'October', '2024/2025-1'),
('SEC-004', 'SCSE1013', '04', 'LEC-002', 'Dr. Nurul Ain', 'Tue', '10:00:00', '12:00:00', '10:00-12:00', 'N28-2', 'FC', 1, 'October', '2024/2025-1'),
-- SCST1123 sections
('SEC-005', 'SCST1123', '01', 'LEC-003', 'Dr. Siti Hajar', 'Mon', '12:00:00', '14:00:00', '12:00-14:00', 'N24-1', 'FC', 1, 'October', '2024/2025-1'),
('SEC-006', 'SCST1123', '02', 'LEC-003', 'Dr. Siti Hajar', 'Wed', '08:00:00', '10:00:00', '08:00-10:00', 'N24-1', 'FC', 1, 'October', '2024/2025-1'),
('SEC-007', 'SCST1123', '03', 'LEC-005', 'Dr. Rashidah', 'Thu', '08:00:00', '10:00:00', '08:00-10:00', 'N24-2', 'FC', 1, 'October', '2024/2025-1'),
-- SCSR1013 sections
('SEC-008', 'SCSR1013', '01', 'LEC-004', 'Prof. Mohd Faris', 'Tue', '12:00:00', '14:00:00', '12:00-14:00', 'N28-3', 'FC', 1, 'October', '2024/2025-1'),
('SEC-009', 'SCSR1013', '02', 'LEC-004', 'Prof. Mohd Faris', 'Wed', '10:00:00', '12:00:00', '10:00-12:00', 'N28-3', 'FC', 1, 'October', '2024/2025-1'),
('SEC-010', 'SCSR1013', '03', 'LEC-006', 'Dr. Hafizul', 'Thu', '10:00:00', '12:00:00', '10:00-12:00', 'N28-4', 'FC', 1, 'October', '2024/2025-1'),
-- SCST1143 sections
('SEC-011', 'SCST1143', '01', 'LEC-005', 'Dr. Rashidah', 'Mon', '14:00:00', '16:00:00', '14:00-16:00', 'N24-3', 'FC', 1, 'October', '2024/2025-1'),
('SEC-012', 'SCST1143', '02', 'LEC-005', 'Dr. Rashidah', 'Wed', '12:00:00', '14:00:00', '12:00-14:00', 'N24-3', 'FC', 1, 'October', '2024/2025-1'),
('SEC-013', 'SCST1143', '03', 'LEC-007', 'Dr. Johana', 'Fri', '08:00:00', '10:00:00', '08:00-10:00', 'N24-4', 'FC', 1, 'October', '2024/2025-1'),
-- ULRS1032 sections
('SEC-014', 'ULRS1032', '01', 'LEC-006', 'Dr. Hafizul', 'Fri', '10:00:00', '12:00:00', '10:00-12:00', 'DK1', 'FC', 1, 'October', '2024/2025-1'),
('SEC-015', 'ULRS1032', '02', 'LEC-007', 'Dr. Johana', 'Fri', '12:00:00', '14:00:00', '12:00-14:00', 'DK1', 'FC', 1, 'October', '2024/2025-1');