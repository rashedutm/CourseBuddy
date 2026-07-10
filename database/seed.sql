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
('UHLA1122', 'Arabic Language 1', 2, 'FC', FALSE),
('UHLM1122', 'Mandarin Language', 2, 'FC', FALSE),
('UHLF1122', 'French Language 1', 2, 'FC', FALSE),
('UHLJ1122', 'Japanese Language 1', 2, 'FC', FALSE),
('UHLK1122', 'Korean Language 1', 2, 'FC', FALSE),
('UHLC1122', 'Mandarin Language 1', 2, 'FC', FALSE);

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
('HSC-5-3', 'HS-5-2', 'UHLF1122'),
('HSC-5-4', 'HS-5-2', 'UHLJ1122'),
('HSC-5-5', 'HS-5-2', 'UHLC1122'),
('HSC-5-12', 'HS-5-2', 'UHLK1122');

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
-- INTAKE
-- 2024/2025 - 2 (March intake)
-- ============================================

INSERT INTO intake (intakeID, intakeName, intakeMonth, academicSession, intakeNumber, intakeYear) VALUES
('IN-2024-2', 'March 2025', 'March', '2024/2025', 2, 2025);

-- ============================================
-- SEMESTER
-- 8 semesters for March 2025 intake
-- ============================================

INSERT INTO semester (semesterID, intakeID, semesterNumber, semesterName) VALUES
('SEM-2024-2-1', 'IN-2024-2', 1, 'Year 1 Semester 1'),
('SEM-2024-2-2', 'IN-2024-2', 2, 'Year 1 Semester 2'),
('SEM-2024-2-3', 'IN-2024-2', 3, 'Year 2 Semester 1'),
('SEM-2024-2-4', 'IN-2024-2', 4, 'Year 2 Semester 2'),
('SEM-2024-2-5', 'IN-2024-2', 5, 'Year 3 Semester 1'),
('SEM-2024-2-6', 'IN-2024-2', 6, 'Year 3 Semester 2'),
('SEM-2024-2-7', 'IN-2024-2', 7, 'Year 4 Semester 1'),
('SEM-2024-2-8', 'IN-2024-2', 8, 'Year 4 Semester 2');

-- ============================================
-- NEW COURSES FOR MARCH INTAKE
-- Only courses not already in the course table
-- Most courses are shared with October intake
-- New ones specific to March intake structure
-- ============================================

INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SECB2103', 'Bioinformatics I', 3, 'FC', FALSE),
('SECP2753', 'Data Mining', 3, 'FC', FALSE),
('SECP3213', 'Business Intelligence', 3, 'FC', FALSE),
('SECB3203', 'Programming for Bioinformatics', 3, 'FC', FALSE);

-- ============================================
-- NEW PREREQUISITES FOR MARCH INTAKE
-- Only new ones not already in prerequisite table
-- ============================================

INSERT INTO prerequisite (prerequisiteID, courseCode, prerequisiteCourseCode, isMandatory) VALUES
('PR021', 'SCSR1033', 'SCSR1013', TRUE),
('PR022', 'SCSE4214', 'SCSE3242', TRUE);

-- ============================================
-- HANDBOOK SLOTS — MARCH INTAKE
-- SCSEH 2024/2025 - 2 (March)
-- Note: Same programme but different structure
-- compared to October intake
-- ============================================

-- SEMESTER 1 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-1-1', 'SCSEH', 'IN-2024-2', 1, 'fixed', 'Fundamental Programming Concept', 1, NULL),
('HS-M-1-2', 'SCSEH', 'IN-2024-2', 1, 'fixed', 'Probability and Statistical Data Analysis', 1, NULL),
('HS-M-1-3', 'SCSEH', 'IN-2024-2', 1, 'fixed', 'Digital Logic', 1, NULL),
('HS-M-1-4', 'SCSEH', 'IN-2024-2', 1, 'fixed', 'Network Communications', 1, NULL),
('HS-M-1-5', 'SCSEH', 'IN-2024-2', 1, 'fixed', 'Software Engineering Principles', 1, NULL),
('HS-M-1-6', 'SCSEH', 'IN-2024-2', 1, 'fixed', 'Malaysia Language for Communication 2', 1, NULL);

-- SEMESTER 2 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-2-1', 'SCSEH', 'IN-2024-2', 2, 'fixed', 'Computer Organisation and Architecture', 1, NULL),
('HS-M-2-2', 'SCSEH', 'IN-2024-2', 2, 'fixed', 'Mathematics for Software Engineer', 1, NULL),
('HS-M-2-3', 'SCSEH', 'IN-2024-2', 2, 'fixed', 'Advanced Programming', 1, NULL),
('HS-M-2-4', 'SCSEH', 'IN-2024-2', 2, 'fixed', 'Database Engineering', 1, NULL),
('HS-M-2-5', 'SCSEH', 'IN-2024-2', 2, 'fixed', 'Integrity and Anti-Corruption', 1, NULL),
('HS-M-2-6', 'SCSEH', 'IN-2024-2', 2, 'free_elective', 'Free Elective I', 1, 'Sxxxxxx3');

-- SEMESTER 3 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-3-1', 'SCSEH', 'IN-2024-2', 3, 'fixed', 'Cross-Platform Application Development', 1, NULL),
('HS-M-3-2', 'SCSEH', 'IN-2024-2', 3, 'fixed', 'Software Design and Architecture', 1, NULL),
('HS-M-3-3', 'SCSEH', 'IN-2024-2', 3, 'fixed', 'Professional Communication Skills 1', 1, NULL),
('HS-M-3-4', 'SCSEH', 'IN-2024-2', 3, 'fixed', 'Philosophy and Current Issues', 1, NULL),
('HS-M-3-5', 'SCSEH', 'IN-2024-2', 3, 'free_elective', 'Service Learning and Community Engagement', 1, 'ULRF2xx2'),
('HS-M-3-6', 'SCSEH', 'IN-2024-2', 3, 'elective_group', 'Choose 1 from Elective Group', 1, NULL);

-- SEMESTER 4 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-4-1', 'SCSEH', 'IN-2024-2', 4, 'fixed', 'Software Process and Project Management', 1, NULL),
('HS-M-4-2', 'SCSEH', 'IN-2024-2', 4, 'fixed', 'Software Requirements Engineering', 1, NULL),
('HS-M-4-3', 'SCSEH', 'IN-2024-2', 4, 'fixed', 'Application Development Project I', 1, NULL),
('HS-M-4-4', 'SCSEH', 'IN-2024-2', 4, 'fixed', 'Data Structure and Algorithm', 1, NULL),
('HS-M-4-5', 'SCSEH', 'IN-2024-2', 4, 'fixed', 'Operating System', 1, NULL),
('HS-M-4-6', 'SCSEH', 'IN-2024-2', 4, 'fixed', 'Human Computer Interaction', 1, NULL);

-- SEMESTER 5 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-5-1', 'SCSEH', 'IN-2024-2', 5, 'fixed', 'Secure Software Programming', 1, NULL),
('HS-M-5-2', 'SCSEH', 'IN-2024-2', 5, 'fixed', 'Software Quality and Testing', 1, NULL),
('HS-M-5-3', 'SCSEH', 'IN-2024-2', 5, 'fixed', 'Professional Practice in Software Engineering', 1, NULL),
('HS-M-5-4', 'SCSEH', 'IN-2024-2', 5, 'fixed', 'Professional Communication Skills', 1, NULL),
('HS-M-5-5', 'SCSEH', 'IN-2024-2', 5, 'fixed', 'Entrepreneurship and Innovation', 1, NULL),
('HS-M-5-6', 'SCSEH', 'IN-2024-2', 5, 'elective_group', 'Foreign Language Elective', 1, NULL);

-- SEMESTER 6 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-6-1', 'SCSEH', 'IN-2024-2', 6, 'fixed', 'Application Development Project II', 1, NULL),
('HS-M-6-2', 'SCSEH', 'IN-2024-2', 6, 'fixed', 'Software Engineering Project I', 1, NULL),
('HS-M-6-3', 'SCSEH', 'IN-2024-2', 6, 'free_elective', 'Free Elective II', 1, 'Sxxxxxx3'),
('HS-M-6-4', 'SCSEH', 'IN-2024-2', 6, 'elective_group', 'Choose 3 from Core Elective Group', 3, NULL);

-- SEMESTER 7 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-7-1', 'SCSEH', 'IN-2024-2', 7, 'fixed', 'Software Engineering Project II', 1, NULL),
('HS-M-7-2', 'SCSEH', 'IN-2024-2', 7, 'free_elective', 'Free Elective III', 1, 'Sxxxxxx3'),
('HS-M-7-3', 'SCSEH', 'IN-2024-2', 7, 'free_elective', 'Free Elective IV', 1, 'Sxxxxxx3'),
('HS-M-7-4', 'SCSEH', 'IN-2024-2', 7, 'elective_group', 'Choose 2 from Final Elective Group', 2, NULL);

-- SEMESTER 8 SLOTS (March)
INSERT INTO handbook_slot (slotID, programmeID, intakeID, semesterNumber, slotType, slotLabel, pickCount, codePattern) VALUES
('HS-M-8-1', 'SCSEH', 'IN-2024-2', 8, 'fixed', 'Industrial Training', 1, NULL),
('HS-M-8-2', 'SCSEH', 'IN-2024-2', 8, 'fixed', 'Industrial Training Report', 1, NULL);

-- ============================================
-- HANDBOOK SLOT COURSES — MARCH INTAKE
-- ============================================

-- Semester 1 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-1-1', 'HS-M-1-1', 'SCSE1013'),
('HSC-M-1-2', 'HS-M-1-2', 'SCST1223'),
('HSC-M-1-3', 'HS-M-1-3', 'SCSR1013'),
('HSC-M-1-4', 'HS-M-1-4', 'SCSR2213'),
('HSC-M-1-5', 'HS-M-1-5', 'SCSE1203'),
('HSC-M-1-6', 'HS-M-1-6', 'UHLM1012');

-- Semester 2 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-2-1', 'HS-M-2-1', 'SCSR1033'),
('HSC-M-2-2', 'HS-M-2-2', 'SCST1123'),
('HSC-M-2-3', 'HS-M-2-3', 'SCSE1224'),
('HSC-M-2-4', 'HS-M-2-4', 'SCST1143'),
('HSC-M-2-5', 'HS-M-2-5', 'ULRS1032');

-- Semester 3 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-3-1', 'HS-M-3-1', 'SCSM2223'),
('HSC-M-3-2', 'HS-M-3-2', 'SCSE2233'),
('HSC-M-3-3', 'HS-M-3-3', 'UHLB2122'),
('HSC-M-3-4', 'HS-M-3-4', 'ULRS1022');

-- Semester 3 elective group (March - choose 1 from 3)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-3-5', 'HS-M-3-6', 'SECB2103'),
('HSC-M-3-6', 'HS-M-3-6', 'SECP2753'),
('HSC-M-3-7', 'HS-M-3-6', 'SECP3213');

-- Semester 4 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-4-1', 'HS-M-4-1', 'SCSE2133'),
('HSC-M-4-2', 'HS-M-4-2', 'SCSE2123'),
('HSC-M-4-3', 'HS-M-4-3', 'SCSE2243'),
('HSC-M-4-4', 'HS-M-4-4', 'SCSE2103'),
('HSC-M-4-5', 'HS-M-4-5', 'SCSR2043'),
('HSC-M-4-6', 'HS-M-4-6', 'SCSM2113');

-- Semester 5 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-5-1', 'HS-M-5-1', 'SCSR3133'),
('HSC-M-5-2', 'HS-M-5-2', 'SCSE3213'),
('HSC-M-5-3', 'HS-M-5-3', 'SCSE3233'),
('HSC-M-5-4', 'HS-M-5-4', 'UHLB3132'),
('HSC-M-5-5', 'HS-M-5-5', 'ULRS3032');

-- Semester 5 foreign language elective (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-5-6', 'HS-M-5-6', 'UHLA1122'),
('HSC-M-5-7', 'HS-M-5-6', 'UHLM1122'),
('HSC-M-5-8', 'HS-M-5-6', 'UHLF1122'),
('HSC-M-5-9', 'HS-M-5-6', 'UHLJ1122');

-- Semester 6 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-6-1', 'HS-M-6-1', 'SCSE3223'),
('HSC-M-6-2', 'HS-M-6-2', 'SCSE3242');

-- Semester 6 core elective group (March - choose 3 from 6)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-6-3', 'HS-M-6-4', 'SCST3223'),
('HSC-M-6-4', 'HS-M-6-4', 'SCSE3143'),
('HSC-M-6-5', 'HS-M-6-4', 'SCSR3113'),
('HSC-M-6-6', 'HS-M-6-4', 'SCSE3103'),
('HSC-M-6-7', 'HS-M-6-4', 'SCSE3203'),
('HSC-M-6-8', 'HS-M-6-4', 'SCSM3113');

-- Semester 7 fixed course (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-7-1', 'HS-M-7-1', 'SCSE4214');

-- Semester 7 elective group (March - choose 2 from 6)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-7-2', 'HS-M-7-4', 'SCSR4453'),
('HSC-M-7-3', 'HS-M-7-4', 'SCSR4973'),
('HSC-M-7-4', 'HS-M-7-4', 'SECB3133'),
('HSC-M-7-5', 'HS-M-7-4', 'SECB3203');

-- Semester 8 fixed courses (March)
INSERT INTO handbook_slot_course (slotCourseID, slotID, courseCode) VALUES
('HSC-M-8-1', 'HS-M-8-1', 'SCSE4108'),
('HSC-M-8-2', 'HS-M-8-2', 'SCSE4114');




-- ============================================
-- NEW LECTURERS from real timetable
-- Add new lecturers not in seed yet
-- ============================================

INSERT INTO lecturer (lecturerID, lecturerName, email, facultyID) VALUES
('LEC-008', 'Prof. Ts. Dr. Dayang Norhayati binti Awang Jawawi', 'dayang@utm.my', 'FC'),
('LEC-009', 'Dr. Muhammad Khatibsyarbini', 'khatibsyarbini@utm.my', 'FC'),
('LEC-010', 'Dr. Nor Azizah binti Saadon', 'azizahsaadon@utm.my', 'FC'),
('LEC-011', 'Dr. Sim Hiew Moi', 'hiewmoi@utm.my', 'FC'),
('LEC-012', 'Dr. Norsham binti Idris', 'norsham@utm.my', 'FC'),
('LEC-013', 'Dr. Zalmiyah binti Zakaria', 'zalmiyah@utm.my', 'FC'),
('LEC-014', 'Mr. Norizam bin Katmon', 'rizam@utm.my', 'FC'),
('LEC-015', 'Assoc. Prof. Dr. Hishammuddin bin Asmuni', 'hishamudin@utm.my', 'FC');

-- ============================================
-- REAL TIMETABLE — SEMESTER 5
-- Session: 2024/2025-1, October Intake
-- Source: SCSEH Semester 5 Timetable
-- Courses: SCSE3143, SCSE3103, SCSE3203, UHLB3132
-- ============================================

INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES

-- SCSE3143 Ubiquitous Computing
('SEC-T-001', 'SCSE3143', '01', 'LEC-008', 'Prof. Ts. Dr. Dayang Norhayati binti Awang Jawawi', 'Mon', '14:00:00', '17:00:00', '2pm-5pm', 'MPK10', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-002', 'SCSE3143', '02', 'LEC-009', 'Dr. Muhammad Khatibsyarbini', 'Mon', '14:00:00', '17:00:00', '2pm-5pm', 'CCNA', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-003', 'SCSE3143', '03', 'LEC-010', 'Dr. Nor Azizah binti Saadon', 'Mon', '14:00:00', '17:00:00', '2pm-5pm', 'N28a MP2', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-004', 'SCSE3143', '04', 'LEC-008', 'Prof. Ts. Dr. Dayang Norhayati binti Awang Jawawi', 'Wed', '14:00:00', '17:00:00', '2pm-5pm', 'MKP10', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-005', 'SCSE3143', '05', 'LEC-009', 'Dr. Muhammad Khatibsyarbini', 'Wed', '14:00:00', '17:00:00', '2pm-5pm', 'CCNA', 'FC', 5, 'October', '2024/2025-1'),

-- SCSE3103 Cognitive Computing
-- Note: Has 2 sessions per week (Wed/Fri lecture + Thu tutorial online)
('SEC-T-006', 'SCSE3103', '01', 'LEC-011', 'Dr. Sim Hiew Moi', 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'N28a BT3', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-007', 'SCSE3103', '02', 'LEC-012', 'Dr. Norsham binti Idris', 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'N28a BT5', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-008', 'SCSE3103', '03', 'LEC-013', 'Dr. Zalmiyah binti Zakaria', 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'ALL', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-009', 'SCSE3103', '04', 'LEC-011', 'Dr. Sim Hiew Moi', 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'N28a BT3', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-010', 'SCSE3103', '05', 'LEC-012', 'Dr. Norsham binti Idris', 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'N28a BT5', 'FC', 5, 'October', '2024/2025-1'),

-- SCSE3203 Special Topics
('SEC-T-011', 'SCSE3203', '01', 'LEC-014', 'Mr. Norizam bin Katmon', 'Mon', '10:00:00', '13:00:00', '10am-1pm', 'MPK10', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-012', 'SCSE3203', '02', 'LEC-010', 'Dr. Nor Azizah binti Saadon', 'Mon', '10:00:00', '13:00:00', '10am-1pm', 'ISTL', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-013', 'SCSE3203', '03', 'LEC-015', 'Assoc. Prof. Dr. Hishammuddin bin Asmuni', 'Mon', '10:00:00', '13:00:00', '10am-1pm', 'CCNA', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-014', 'SCSE3203', '04', 'LEC-014', 'Mr. Norizam bin Katmon', 'Wed', '08:00:00', '11:00:00', '8am-11am', 'IDAL', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-015', 'SCSE3203', '05', 'LEC-010', 'Dr. Nor Azizah binti Saadon', 'Wed', '08:00:00', '11:00:00', '8am-11am', 'CSL', 'FC', 5, 'October', '2024/2025-1'),

-- UHLB3132 Professional Communication Skills
-- All sections are Tue 8am-10am Online
('SEC-T-016', 'UHLB3132', '22', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-017', 'UHLB3132', '23', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-018', 'UHLB3132', '24', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-019', 'UHLB3132', '25', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-020', 'UHLB3132', '26', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-021', 'UHLB3132', '27', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-022', 'UHLB3132', '28', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-023', 'UHLB3132', '29', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-024', 'UHLB3132', '30', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-025', 'UHLB3132', '31', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-026', 'UHLB3132', '32', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1'),
('SEC-T-027', 'UHLB3132', '33', NULL, NULL, 'Tue', '08:00:00', '10:00:00', '8am-10am', 'Online', 'FC', 5, 'October', '2024/2025-1');

-- ============================================
-- FOREIGN LANGUAGE ELECTIVE TIMETABLE
-- Applies to BOTH sessions:
--   SESSION 2024/2025-1 (October) — Semester 5
--   SESSION 2025/2026-1 (October) — Semester 3
-- ============================================

-- Arabic (UHLA1122) — Session 2024/2025-1, Sem 5, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-AR-01', 'UHLA1122', '01', NULL, NULL, 'Mon', '09:00:00', '11:00:00', '9am-11am', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-02', 'UHLA1122', '02', NULL, NULL, 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-03', 'UHLA1122', '03', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-04', 'UHLA1122', '04', NULL, NULL, 'Mon', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-05', 'UHLA1122', '05', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-06', 'UHLA1122', '06', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-07', 'UHLA1122', '07', NULL, NULL, 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-08', 'UHLA1122', '08', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-09', 'UHLA1122', '09', NULL, NULL, 'Wed', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-10', 'UHLA1122', '10', NULL, NULL, 'Thu', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-11', 'UHLA1122', '11', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-12', 'UHLA1122', '12', NULL, NULL, 'Thu', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1'),
('SEC-AR-13', 'UHLA1122', '13', NULL, NULL, 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'D06-BK6', 'FC', 5, 'October', '2024/2025-1');

-- Mandarin (UHLC1122) — Session 2024/2025-1, Sem 5, October
-- Note: timetable has UHLC1122 not UHLM1122 for Mandarin 1
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-MN-01', 'UHLC1122', '01', NULL, NULL, 'Mon', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-02', 'UHLC1122', '02', NULL, NULL, 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-03', 'UHLC1122', '03', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-04', 'UHLC1122', '04', NULL, NULL, 'Mon', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-05', 'UHLC1122', '05', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-06', 'UHLC1122', '06', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-07', 'UHLC1122', '07', NULL, NULL, 'Wed', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-08', 'UHLC1122', '08', NULL, NULL, 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-09', 'UHLC1122', '09', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-10', 'UHLC1122', '10', NULL, NULL, 'Wed', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-11', 'UHLC1122', '11', NULL, NULL, 'Thu', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-12', 'UHLC1122', '12', NULL, NULL, 'Thu', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-13', 'UHLC1122', '13', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-14', 'UHLC1122', '14', NULL, NULL, 'Fri', '08:00:00', '10:00:00', '8am-10am', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-15', 'UHLC1122', '15', NULL, NULL, 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-16', 'UHLC1122', '16', NULL, NULL, 'Fri', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-17', 'UHLC1122', '17', NULL, NULL, 'Fri', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK7', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-18', 'UHLC1122', '18', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1'),
('SEC-MN-19', 'UHLC1122', '19', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1');

-- French (UHLF1122) — Session 2024/2025-1, Sem 5, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-FR-01', 'UHLF1122', '01', NULL, NULL, 'Mon', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-02', 'UHLF1122', '02', NULL, NULL, 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-03', 'UHLF1122', '03', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-04', 'UHLF1122', '04', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-05', 'UHLF1122', '05', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-06', 'UHLF1122', '06', NULL, NULL, 'Wed', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-07', 'UHLF1122', '07', NULL, NULL, 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-08', 'UHLF1122', '08', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-09', 'UHLF1122', '09', NULL, NULL, 'Thu', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-10', 'UHLF1122', '10', NULL, NULL, 'Thu', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-11', 'UHLF1122', '11', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1'),
('SEC-FR-12', 'UHLF1122', '12', NULL, NULL, 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'D06-BK12', 'FC', 5, 'October', '2024/2025-1');

-- Korean (UHLK1122) — Session 2024/2025-1, Sem 5, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-KR-01', 'UHLK1122', '01', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK8', 'FC', 5, 'October', '2024/2025-1'),
('SEC-KR-02', 'UHLK1122', '02', NULL, NULL, 'Wed', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK8', 'FC', 5, 'October', '2024/2025-1');

-- Japanese (UHLJ1122) — Session 2024/2025-1, Sem 5, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-JP-01', 'UHLJ1122', '01', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1'),
('SEC-JP-02', 'UHLJ1122', '02', NULL, NULL, 'Mon', '17:00:00', '19:00:00', '5pm-7pm', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1'),
('SEC-JP-03', 'UHLJ1122', '03', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1'),
('SEC-JP-04', 'UHLJ1122', '04', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1'),
('SEC-JP-05', 'UHLJ1122', '05', NULL, NULL, 'Thu', '17:00:00', '19:00:00', '5pm-7pm', 'D06-BK13', 'FC', 5, 'October', '2024/2025-1');

-- ============================================
-- SAME FOREIGN LANGUAGE SECTIONS FOR
-- SESSION 2025/2026-1, October Intake, Sem 3
-- Same timetable applies to both sessions
-- ============================================

-- Arabic (UHLA1122) — Session 2025/2026-1, Sem 3, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-AR2-01', 'UHLA1122', '01', NULL, NULL, 'Mon', '09:00:00', '11:00:00', '9am-11am', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-02', 'UHLA1122', '02', NULL, NULL, 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-03', 'UHLA1122', '03', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-04', 'UHLA1122', '04', NULL, NULL, 'Mon', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-05', 'UHLA1122', '05', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-06', 'UHLA1122', '06', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-07', 'UHLA1122', '07', NULL, NULL, 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-08', 'UHLA1122', '08', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-09', 'UHLA1122', '09', NULL, NULL, 'Wed', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-10', 'UHLA1122', '10', NULL, NULL, 'Thu', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-11', 'UHLA1122', '11', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-12', 'UHLA1122', '12', NULL, NULL, 'Thu', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1'),
('SEC-AR2-13', 'UHLA1122', '13', NULL, NULL, 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'D06-BK6', 'FC', 3, 'October', '2025/2026-1');

-- French (UHLF1122) — Session 2025/2026-1, Sem 3, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-FR2-01', 'UHLF1122', '01', NULL, NULL, 'Mon', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-02', 'UHLF1122', '02', NULL, NULL, 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-03', 'UHLF1122', '03', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-04', 'UHLF1122', '04', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-05', 'UHLF1122', '05', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-06', 'UHLF1122', '06', NULL, NULL, 'Wed', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-07', 'UHLF1122', '07', NULL, NULL, 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-08', 'UHLF1122', '08', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-09', 'UHLF1122', '09', NULL, NULL, 'Thu', '09:00:00', '11:00:00', '9am-11am', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-10', 'UHLF1122', '10', NULL, NULL, 'Thu', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-11', 'UHLF1122', '11', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1'),
('SEC-FR2-12', 'UHLF1122', '12', NULL, NULL, 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'D06-BK12', 'FC', 3, 'October', '2025/2026-1');

-- Korean (UHLK1122) — Session 2025/2026-1, Sem 3, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-KR2-01', 'UHLK1122', '01', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK8', 'FC', 3, 'October', '2025/2026-1'),
('SEC-KR2-02', 'UHLK1122', '02', NULL, NULL, 'Wed', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK8', 'FC', 3, 'October', '2025/2026-1');

-- Japanese (UHLJ1122) — Session 2025/2026-1, Sem 3, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-JP2-01', 'UHLJ1122', '01', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1'),
('SEC-JP2-02', 'UHLJ1122', '02', NULL, NULL, 'Mon', '17:00:00', '19:00:00', '5pm-7pm', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1'),
('SEC-JP2-03', 'UHLJ1122', '03', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1'),
('SEC-JP2-04', 'UHLJ1122', '04', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1'),
('SEC-JP2-05', 'UHLJ1122', '05', NULL, NULL, 'Thu', '17:00:00', '19:00:00', '5pm-7pm', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1');

-- Mandarin (UHLC1122) — Session 2025/2026-1, Sem 3, October
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-MN2-01', 'UHLC1122', '01', NULL, NULL, 'Mon', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-02', 'UHLC1122', '02', NULL, NULL, 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-03', 'UHLC1122', '03', NULL, NULL, 'Mon', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-04', 'UHLC1122', '04', NULL, NULL, 'Mon', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-05', 'UHLC1122', '05', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-06', 'UHLC1122', '06', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-07', 'UHLC1122', '07', NULL, NULL, 'Wed', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-08', 'UHLC1122', '08', NULL, NULL, 'Wed', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-09', 'UHLC1122', '09', NULL, NULL, 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-10', 'UHLC1122', '10', NULL, NULL, 'Wed', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-11', 'UHLC1122', '11', NULL, NULL, 'Thu', '09:00:00', '11:00:00', '9am-11am', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-12', 'UHLC1122', '12', NULL, NULL, 'Thu', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-13', 'UHLC1122', '13', NULL, NULL, 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-14', 'UHLC1122', '14', NULL, NULL, 'Fri', '08:00:00', '10:00:00', '8am-10am', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-15', 'UHLC1122', '15', NULL, NULL, 'Fri', '10:00:00', '12:00:00', '10am-12pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-16', 'UHLC1122', '16', NULL, NULL, 'Fri', '14:00:00', '16:00:00', '2pm-4pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-17', 'UHLC1122', '17', NULL, NULL, 'Fri', '16:00:00', '18:00:00', '4pm-6pm', 'D06-BK7', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-18', 'UHLC1122', '18', NULL, NULL, 'Tue', '09:00:00', '11:00:00', '9am-11am', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1'),
('SEC-MN2-19', 'UHLC1122', '19', NULL, NULL, 'Tue', '11:00:00', '13:00:00', '11am-1pm', 'D06-BK13', 'FC', 3, 'October', '2025/2026-1');




-- ============================================
-- TIMETABLE — SEMESTER 4
-- Session: 2024/2025-2, March Intake
-- Source: SCSEH Semester 4 March Intake Timetable
-- Courses: SCSE2243, SCSE2133, SCSE2123,
--          SCSE2103, SCSR2043, SCSM2113
-- ============================================

-- New lecturers from this timetable
INSERT IGNORE INTO lecturer (lecturerID, lecturerName, email, facultyID) VALUES
('LEC-016', 'Assoc. Prof. Dr. Mohd. Yazid bin Idris', 'yazid@utm.my', 'FC'),
('LEC-017', 'Dr. Adila Firdaus binti Arbain', 'adilafirdaus@utm.my', 'FC'),
('LEC-018', 'Assoc. Prof. Dr. Mohd Adham bin Isa', 'mohdadham@utm.my', 'FC'),
('LEC-019', 'Prof. Ts. Dr. Wan Mohd Nasir bin Wan Kadir', 'wnasir@utm.my', 'FC'),
('LEC-020', 'Assoc. Prof. Ts. Dr. Rohayanti binti Hassan', 'rohayanti@utm.my', 'FC'),
('LEC-021', 'Assoc. Prof. Dr. Radziah binti Mohamad', 'radziahm@utm.my', 'FC'),
('LEC-022', 'Dr. Shahliza binti Abd. Halim', 'shahliza@utm.my', 'FC'),
('LEC-023', 'Dr. Noraini binti Ibrahim', 'noraini_ib@utm.my', 'FC'),
('LEC-024', 'Ts. Dr. Johanna binti Ahmad', 'johanna@utm.my', 'FC'),
('LEC-025', 'Ms. Lizawati binti Mi Yusuf', 'lizawati@utm.my', 'FC'),
('LEC-026', 'Dr. Mohd Kufaisal bin Mohd Sidik', 'kufaisal@utm.my', 'FC'),
('LEC-027', 'Dr. Zanariah binti Zainudin', 'farkhana@utm.my', 'FC'),
('LEC-028', 'Dr. Sarina binti Sulaiman', 'sarina@utm.my', 'FC'),
('LEC-029', 'Dr. Layla Rasheed Abdallah Hasan', 'layla.hasan@utm.my', 'FC'),
('LEC-030', 'Prof. Ts. Dr. Nor Azman bin Ismail', 'azman@utm.my', 'FC');

-- SCSE2243 Application Development Project I
-- Wed 10am-1pm
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-M4-001', 'SCSE2243', '01', 'LEC-016', 'Assoc. Prof. Dr. Mohd. Yazid bin Idris', 'Wed', '10:00:00', '13:00:00', '10am-1pm', 'MPK10', 'FC', 4, 'March', '2024/2025-2');

-- SCSE2133 Software Process and Project Management
-- Tue 10am-1pm Online
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-M4-002', 'SCSE2133', '01', 'LEC-017', 'Dr. Adila Firdaus binti Arbain', 'Tue', '10:00:00', '13:00:00', '10am-1pm', 'Online', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-003', 'SCSE2133', '02', 'LEC-018', 'Assoc. Prof. Dr. Mohd Adham bin Isa', 'Tue', '10:00:00', '13:00:00', '10am-1pm', 'Online', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-004', 'SCSE2133', '03', 'LEC-019', 'Prof. Ts. Dr. Wan Mohd Nasir bin Wan Kadir', 'Tue', '10:00:00', '13:00:00', '10am-1pm', 'Online', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-005', 'SCSE2133', '04', 'LEC-020', 'Assoc. Prof. Ts. Dr. Rohayanti binti Hassan', 'Tue', '10:00:00', '13:00:00', '10am-1pm', 'Online', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-006', 'SCSE2133', '05', 'LEC-017', 'Dr. Adila Firdaus binti Arbain', 'Tue', '10:00:00', '13:00:00', '10am-1pm', 'Online', 'FC', 4, 'March', '2024/2025-2');

-- SCSE2123 Software Requirements Engineering
-- Mon 2pm-5pm
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-M4-007', 'SCSE2123', '01', 'LEC-021', 'Assoc. Prof. Dr. Radziah binti Mohamad', 'Mon', '14:00:00', '17:00:00', '2pm-5pm', 'BK1', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-008', 'SCSE2123', '02', 'LEC-022', 'Dr. Shahliza binti Abd. Halim', 'Mon', '14:00:00', '17:00:00', '2pm-5pm', 'BK3', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-009', 'SCSE2123', '05', 'LEC-023', 'Dr. Noraini binti Ibrahim', 'Mon', '14:00:00', '17:00:00', '2pm-5pm', 'BK7', 'FC', 4, 'March', '2024/2025-2');

-- SCSE2103 Data Structure and Algorithm
-- Wed 2pm-4pm + Fri 10am-12pm (2 sessions)
-- Storing main session (Wed) as primary
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-M4-010', 'SCSE2103', '05', 'LEC-024', 'Ts. Dr. Johanna binti Ahmad', 'Wed', '14:00:00', '16:00:00', '2pm-4pm', 'MPK1', 'FC', 4, 'March', '2024/2025-2');

-- SCSR2043 Operating Systems
-- Mon 11am-1pm + Thu 10am-11am Online tutorial
-- Storing main session (Mon) as primary
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-M4-011', 'SCSR2043', '01', 'LEC-025', 'Ms. Lizawati binti Mi Yusuf', 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'BK1', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-012', 'SCSR2043', '02', 'LEC-026', 'Dr. Mohd Kufaisal bin Mohd Sidik', 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'BK2', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-013', 'SCSR2043', '05', 'LEC-027', 'Dr. Zanariah binti Zainudin', 'Mon', '11:00:00', '13:00:00', '11am-1pm', 'BK3', 'FC', 4, 'March', '2024/2025-2');

-- SCSM2113 Human Computer Interaction Fundamentals
-- Thu 2pm-4pm Online + Fri 9am-10am tutorial
-- Storing main session (Thu) as primary
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-M4-014', 'SCSM2113', '03', 'LEC-028', 'Dr. Sarina binti Sulaiman', 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'Online', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-015', 'SCSM2113', '04', 'LEC-029', 'Dr. Layla Rasheed Abdallah Hasan', 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'Online', 'FC', 4, 'March', '2024/2025-2'),
('SEC-M4-016', 'SCSM2113', '05', 'LEC-030', 'Prof. Ts. Dr. Nor Azman bin Ismail', 'Thu', '14:00:00', '16:00:00', '2pm-4pm', 'Online', 'FC', 4, 'March', '2024/2025-2');

-- ============================================
-- FREE ELECTIVE DATA
-- Faculty of Chemical Engineering (FKT)
-- Session: 2026/2027-1
-- Semester 1, October intake
-- Source: JADUAL KURSUS ELEKTIF BEBAS FKT
-- ============================================

-- Step 1: Add Faculty of Chemical Engineering admin
-- Need a user first, then admin
INSERT INTO users (userID, fullName, matricNumber, utmEmail, passwordHash, role) VALUES
('USR-ADM-002', 'Admin FKT', 'STAFF002', 'admin.fkt@utm.my', '$2b$10$examplehashedpasswordadmin002xx', 'admin');

INSERT INTO admins (facultyID, facultyName, name, userID) VALUES
('FKT', 'Faculty of Chemical Engineering', 'Admin FKT', 'USR-ADM-002');

-- Step 2: Add the courses to global course pool
INSERT INTO course (courseCode, courseName, creditHours, ownerFacultyID, hasPrerequisite) VALUES
('SKTX4583', 'Surfactant and Detergent Technology', 3, 'FKT', FALSE),
('SKTX4273', 'Beauty Product Development and Innovation', 3, 'FKT', FALSE);

-- Step 3: Add lecturers (TBA as no lecturer listed in timetable)
-- Skipping lecturer insert as none listed in file

-- Step 4: Add sections to timetable
-- SKTX4583 — 1 section, Friday 3pm-5pm
-- SKTX4273 — 2 sections, Friday 3pm-5pm
-- These are for Session 2026/2027-1, Semester 1, October intake
-- Note: academicYear format matches our section table
INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, lecturerName, day, timeStart, timeEnd, timeSlot, venue, facultyID, semesterNumber, intakeMonth, academicYear) VALUES
('SEC-FKT-001', 'SKTX4583', '01', NULL, NULL, 'Fri', '15:00:00', '17:00:00', '3pm-5pm', NULL, 'FKT', 1, 'October', '2026/2027-1'),
('SEC-FKT-002', 'SKTX4273', '01', NULL, NULL, 'Fri', '15:00:00', '17:00:00', '3pm-5pm', NULL, 'FKT', 1, 'October', '2026/2027-1'),
('SEC-FKT-003', 'SKTX4273', '02', NULL, NULL, 'Fri', '15:00:00', '17:00:00', '3pm-5pm', NULL, 'FKT', 1, 'October', '2026/2027-1');

-- Step 5: Add to free_elective_offering table
-- offeringFacultyID = FKT (Chemical Engineering)
-- Students from FC (Computing) can take these
-- semesterNumber = 1 (this is Sem I of 2026/2027)
-- intakeMonth = October
-- academicYear = 2026/2027-1
INSERT INTO free_elective_offering (offeringID, courseCode, offeringFacultyID, intakeMonth, academicYear) VALUES
('FEO-FKT-001', 'SKTX4583', 'FKT', 'October', '2026/2027-1'),
('FEO-FKT-002', 'SKTX4273', 'FKT', 'October', '2026/2027-1');

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Working test admin account
-- Unlike the other seeded users above, this one has a
-- REAL bcrypt hash (of 'admin123'), so it can actually log in.
-- Not linked to a faculty in the admins table — that's not
-- required for login or the Academic Officer Dashboard to work.
-- ============================================
INSERT INTO users (userID, fullName, matricNumber, utmEmail, passwordHash, role) VALUES
('USR-ADM-003', 'Admin COM', 'STAFFCOM1', 'admincom@utm.my', '$2b$10$Fu/i4PoYOwmvjku0hj5LJ.hvAC0/8UtTTXQYttmmOI7h6kKNhFHFq', 'admin');

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Academic Planner Catalog
-- Full SCSEH degree structure (both October and March
-- intake tracks), used by the new Academic Planner
-- feature. Separate from the `course`/`handbook_slot`
-- tables above (personal progress tracking, not
-- registration/pattern-generation data).
--
-- Placeholder slots (Free Elective, Foreign Language
-- Elective, University Elective, PRISMS Elective) don't
-- have one real course code in the handbook, so each is
-- given its own stable synthetic code (FREE-ELEC-1..4,
-- FOREIGN-LANG-ELEC, UNIV-ELEC-1, PRISMS-ELEC-1/2) so a
-- student's status on "Free Elective II" never collides
-- with their status on "Free Elective I", etc. Reused
-- between October/March is safe since one student only
-- ever follows a single intake track.
-- ============================================

-- OCTOBER INTAKE — Semester 1
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-1-1', 'October', 1, 'SCSE1013', 'Fundamental Programming Concept', 3, NULL, NULL),
('PC-O-1-2', 'October', 1, 'SCST1123', 'Mathematics for Software Engineer', 3, NULL, NULL),
('PC-O-1-3', 'October', 1, 'SCSR1013', 'Digital Logic', 3, NULL, NULL),
('PC-O-1-4', 'October', 1, 'SCST1143', 'Database Engineering', 3, NULL, NULL),
('PC-O-1-5', 'October', 1, 'ULRS1032', 'Integrity and Anti-Corruption', 2, NULL, NULL),
('PC-O-1-6', 'October', 1, 'FREE-ELEC-1', 'Free Elective I', 3, NULL, 'Free Elective');

-- OCTOBER INTAKE — Semester 2
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-2-1', 'October', 2, 'SCSE1203', 'Software Engineering Principles', 3, 'SCSE1013', NULL),
('PC-O-2-2', 'October', 2, 'SCSR1033', 'Computer Organization and Architecture', 3, 'SCSE1013', NULL),
('PC-O-2-3', 'October', 2, 'SCST1223', 'Probability and Statistical Data Analysis', 3, NULL, NULL),
('PC-O-2-4', 'October', 2, 'SCSE1224', 'Advanced Programming', 4, 'SCSE1013', NULL),
('PC-O-2-5', 'October', 2, 'SCSR2213', 'Network Communications', 3, NULL, NULL),
('PC-O-2-6', 'October', 2, 'UHLM1012', 'Malaysia Language for Communication 2 (International students)', 2, NULL, 'Choose per student type'),
('PC-O-2-7', 'October', 2, 'ULRS1182', 'Appreciation of Ethics and Civilizations (Malaysian students)', 2, NULL, 'Choose per student type');

-- OCTOBER INTAKE — Semester 3
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-3-1', 'October', 3, 'SCSE2133', 'Software Process and Project Management', 3, 'SCSE1203', NULL),
('PC-O-3-2', 'October', 3, 'SCSE2123', 'Software Requirements Engineering', 3, 'SCSE1203', NULL),
('PC-O-3-3', 'October', 3, 'SCSE2103', 'Data Structure and Algorithm', 3, 'SCSE1013', NULL),
('PC-O-3-4', 'October', 3, 'SCSR2043', 'Operating Systems', 3, NULL, NULL),
('PC-O-3-5', 'October', 3, 'SCSM2113', 'Human Computer Interaction Fundamentals', 3, 'SCSE1203', NULL),
('PC-O-3-6', 'October', 3, 'UKQF2XX2', 'Service Learning & Community Engagement Courses', 2, NULL, NULL);

-- OCTOBER INTAKE — Semester 4
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-4-1', 'October', 4, 'SCSM2223', 'Cross-Platform Application Development', 3, 'SCST1143', NULL),
('PC-O-4-2', 'October', 4, 'SCSE2233', 'Software Design & Architecture', 3, 'SCSE1203', NULL),
('PC-O-4-3', 'October', 4, 'SCSE2243', 'Application Development Project I', 3, 'SCSE1203, SCSE2123', NULL),
('PC-O-4-4', 'October', 4, 'UHLB2122', 'Professional Communication Skills 1', 2, NULL, NULL),
('PC-O-4-5', 'October', 4, 'ULRS1022', 'Philosophy and Current Issues', 2, NULL, NULL),
('PC-O-4-6', 'October', 4, 'SCSB2103', 'Bioinformatics I', 3, NULL, 'Choose 1 of 3'),
('PC-O-4-7', 'October', 4, 'SCSP2753', 'Data Mining', 3, NULL, 'Choose 1 of 3'),
('PC-O-4-8', 'October', 4, 'SCSP3213', 'Business Intelligence', 3, NULL, 'Choose 1 of 3');

-- OCTOBER INTAKE — Semester 5
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-5-1', 'October', 5, 'UHLB3132', 'Professional Communication Skills', 2, NULL, NULL),
('PC-O-5-2', 'October', 5, 'FOREIGN-LANG-ELEC', 'Foreign Language Elective', 2, NULL, 'Foreign Language Elective'),
('PC-O-5-3', 'October', 5, 'FREE-ELEC-2', 'Free Elective II', 3, NULL, 'Free Elective'),
('PC-O-5-4', 'October', 5, 'SCST3223', 'Data Analytic Programming', 3, NULL, 'Choose 3 of 6'),
('PC-O-5-5', 'October', 5, 'SCSE3143', 'Ubiquitous Computing', 3, NULL, 'Choose 3 of 6'),
('PC-O-5-6', 'October', 5, 'SCSR3113', 'Cloud Computing', 3, NULL, 'Choose 3 of 6'),
('PC-O-5-7', 'October', 5, 'SCSE3103', 'Cognitive Computing', 3, NULL, 'Choose 3 of 6'),
('PC-O-5-8', 'October', 5, 'SCSE3203', 'Special Topics', 3, NULL, 'Choose 3 of 6'),
('PC-O-5-9', 'October', 5, 'SCSM3113', 'Virtual and Augmented Reality Application', 3, NULL, 'Choose 3 of 6');

-- OCTOBER INTAKE — Semester 6
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-6-1', 'October', 6, 'SCSE3242', 'Software Engineering Project I', 2, 'SCSE2243', NULL),
('PC-O-6-2', 'October', 6, 'SCSR3133', 'Secure Software Programming', 3, 'SCSM2213', NULL),
('PC-O-6-3', 'October', 6, 'SCSE3213', 'Software Quality & Testing', 3, 'SCSE2123, SCSE2233', NULL),
('PC-O-6-4', 'October', 6, 'SCSE3223', 'Application Development Project II', 3, 'SCSE2243', NULL),
('PC-O-6-5', 'October', 6, 'SCSE3233', 'Professional Practice in Software Engineering', 3, 'SCSE1203', NULL),
('PC-O-6-6', 'October', 6, 'ULRS3032', 'Entrepreneurship and Innovation', 2, NULL, NULL);

-- OCTOBER INTAKE — Semester 7
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-7-1', 'October', 7, 'SCSE4108', 'Industrial Training', 8, 'CGPA >= 2.00', NULL),
('PC-O-7-2', 'October', 7, 'SCSE4114', 'Industrial Training Report', 4, 'CGPA >= 2.00', NULL);

-- OCTOBER INTAKE — Semester 8
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-O-8-1', 'October', 8, 'SCSE4214', 'Software Engineering Project II', 4, 'SCSE3242', NULL),
('PC-O-8-2', 'October', 8, 'FREE-ELEC-3', 'Free Elective III', 3, NULL, 'Free Elective'),
('PC-O-8-3', 'October', 8, 'FREE-ELEC-4', 'Free Elective IV', 3, NULL, 'Free Elective'),
('PC-O-8-4', 'October', 8, 'SCSR4453', 'Network Security', 3, NULL, 'Choose 2 of 6'),
('PC-O-8-5', 'October', 8, 'SCSR4973', 'Computer Network & Security Special Topics', 3, NULL, 'Choose 2 of 6'),
('PC-O-8-6', 'October', 8, 'SECB3133', 'Computational Biology I', 3, NULL, 'Choose 2 of 6'),
('PC-O-8-7', 'October', 8, 'SCSB3203', 'Programming for Bioinformatics', 3, NULL, 'Choose 2 of 6'),
('PC-O-8-8', 'October', 8, 'PRISMS-ELEC-1', 'PRISMS Elective I (PRISMS students only)', 3, NULL, 'Choose 2 of 6'),
('PC-O-8-9', 'October', 8, 'PRISMS-ELEC-2', 'PRISMS Elective II (PRISMS students only)', 3, NULL, 'Choose 2 of 6');

-- MARCH INTAKE — Semester 1
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-1-1', 'March', 1, 'SCSE1013', 'Fundamental Programming Concept', 3, NULL, NULL),
('PC-M-1-2', 'March', 1, 'SCST1223', 'Probability and Statistical Data Analysis', 3, NULL, NULL),
('PC-M-1-3', 'March', 1, 'SCSR1013', 'Digital Logic', 3, NULL, NULL),
('PC-M-1-4', 'March', 1, 'SCSR2213', 'Network Communications', 3, NULL, NULL),
('PC-M-1-5', 'March', 1, 'SCSE1203', 'Software Engineering Principles', 3, 'SCSE1013', NULL),
('PC-M-1-6', 'March', 1, 'UNIV-ELEC-1', 'University Elective I', 2, NULL, 'University Elective'),
('PC-M-1-7', 'March', 1, 'UHLM1012', 'Malaysia Language for Communication 2 (International students)', 2, NULL, 'Choose per student type'),
('PC-M-1-8', 'March', 1, 'ULRS1182', 'Appreciation of Ethics and Civilizations (Malaysian students)', 2, NULL, 'Choose per student type');

-- MARCH INTAKE — Semester 2
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-2-1', 'March', 2, 'SCSR1033', 'Computer Organisation and Architecture', 3, 'SCSR1013', NULL),
('PC-M-2-2', 'March', 2, 'SCST1123', 'Mathematics for Software Engineer', 3, NULL, NULL),
('PC-M-2-3', 'March', 2, 'SCSE1224', 'Advanced Programming', 4, 'SCSE1013', NULL),
('PC-M-2-4', 'March', 2, 'SCST1143', 'Database Engineering', 3, NULL, NULL),
('PC-M-2-5', 'March', 2, 'ULRS1032', 'Integrity and Anti-Corruption', 2, NULL, NULL),
('PC-M-2-6', 'March', 2, 'FREE-ELEC-1', 'Free Elective I', 3, NULL, 'Free Elective');

-- MARCH INTAKE — Semester 3
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-3-1', 'March', 3, 'SCSM2223', 'Cross-Platform Application Development', 3, 'SCST1143', NULL),
('PC-M-3-2', 'March', 3, 'SCSE2233', 'Software Design & Architecture', 3, 'SCSE1203', NULL),
('PC-M-3-3', 'March', 3, 'UHLB2122', 'Professional Communication Skills 1', 2, NULL, NULL),
('PC-M-3-4', 'March', 3, 'ULRS1022', 'Philosophy and Current Issues', 2, NULL, NULL),
('PC-M-3-5', 'March', 3, 'ULRF2XX2', 'Service Learning & Community Engagement Courses', 2, NULL, NULL),
('PC-M-3-6', 'March', 3, 'SECB2103', 'Bioinformatics I', 3, NULL, 'Choose 1 of 3'),
('PC-M-3-7', 'March', 3, 'SECP2753', 'Data Mining', 3, NULL, 'Choose 1 of 3'),
('PC-M-3-8', 'March', 3, 'SECP3213', 'Business Intelligence', 3, NULL, 'Choose 1 of 3');

-- MARCH INTAKE — Semester 4
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-4-1', 'March', 4, 'SCSE2133', 'Software Process and Project Management', 3, 'SCSE1203', NULL),
('PC-M-4-2', 'March', 4, 'SCSE2123', 'Software Requirements Engineering', 3, 'SCSE1203', NULL),
('PC-M-4-3', 'March', 4, 'SCSE2243', 'Application Development Project I', 3, 'SCSE1203, SCSE2123', NULL),
('PC-M-4-4', 'March', 4, 'SCSE2103', 'Data Structure and Algorithm', 3, 'SCSE1013', NULL),
('PC-M-4-5', 'March', 4, 'SCSR2043', 'Operating System', 3, NULL, NULL),
('PC-M-4-6', 'March', 4, 'SCSM2113', 'Human Computer Interaction', 3, 'SCSE1203', NULL);

-- MARCH INTAKE — Semester 5
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-5-1', 'March', 5, 'SCSR3133', 'Secure Software Programming', 3, 'SCSM2213', NULL),
('PC-M-5-2', 'March', 5, 'SCSE3213', 'Software Quality & Testing', 3, 'SCSE2123, SCSE2233', NULL),
('PC-M-5-3', 'March', 5, 'SCSE3233', 'Professional Practice in Software Engineering', 3, 'SCSE1203', NULL),
('PC-M-5-4', 'March', 5, 'UHLB3132', 'Professional Communication Skills', 2, NULL, NULL),
('PC-M-5-5', 'March', 5, 'ULRS3032', 'Entrepreneurship and Innovation', 2, NULL, NULL),
('PC-M-5-6', 'March', 5, 'FOREIGN-LANG-ELEC', 'Foreign Language Elective', 2, NULL, 'Foreign Language Elective');

-- MARCH INTAKE — Semester 6
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-6-1', 'March', 6, 'SCSE3223', 'Application Development Project II', 3, 'SCSE2243', NULL),
('PC-M-6-2', 'March', 6, 'SCSE3242', 'Software Engineering Project I', 2, '80 credits, SCSE2243', NULL),
('PC-M-6-3', 'March', 6, 'FREE-ELEC-2', 'Free Elective II', 3, NULL, 'Free Elective'),
('PC-M-6-4', 'March', 6, 'SCST3223', 'Data Analytic Programming', 3, NULL, 'Choose 3 of 6'),
('PC-M-6-5', 'March', 6, 'SCSE3143', 'Ubiquitous Computing', 3, NULL, 'Choose 3 of 6'),
('PC-M-6-6', 'March', 6, 'SCSR3113', 'Cloud Computing', 3, NULL, 'Choose 3 of 6'),
('PC-M-6-7', 'March', 6, 'SCSE3103', 'Cognitive Computing', 3, NULL, 'Choose 3 of 6'),
('PC-M-6-8', 'March', 6, 'SCSE3203', 'Special Topics', 3, NULL, 'Choose 3 of 6'),
('PC-M-6-9', 'March', 6, 'SCSM3113', 'Virtual and Augmented Reality Application', 3, NULL, 'Choose 3 of 6');

-- MARCH INTAKE — Semester 7
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-7-1', 'March', 7, 'SCSE4214', 'Software Engineering Project II', 4, 'SCSE3242', NULL),
('PC-M-7-2', 'March', 7, 'FREE-ELEC-3', 'Free Elective III', 3, NULL, 'Free Elective'),
('PC-M-7-3', 'March', 7, 'FREE-ELEC-4', 'Free Elective IV', 3, NULL, 'Free Elective'),
('PC-M-7-4', 'March', 7, 'SCSR4453', 'Network Security', 3, NULL, 'Choose 2 of 6'),
('PC-M-7-5', 'March', 7, 'SCSR4973', 'Computer Network & Security Special Topics', 3, NULL, 'Choose 2 of 6'),
('PC-M-7-6', 'March', 7, 'SECB3133', 'Computational Biology I', 3, NULL, 'Choose 2 of 6'),
('PC-M-7-7', 'March', 7, 'SECB3203', 'Programming for Bioinformatics', 3, NULL, 'Choose 2 of 6'),
('PC-M-7-8', 'March', 7, 'PRISMS-ELEC-1', 'PRISMS Elective 1 (PRISMS students only)', 3, NULL, 'Choose 2 of 6'),
('PC-M-7-9', 'March', 7, 'PRISMS-ELEC-2', 'PRISMS Elective 2 (PRISMS students only)', 3, NULL, 'Choose 2 of 6');

-- MARCH INTAKE — Semester 8
INSERT INTO planner_course_catalog (catalogID, intakeType, semesterNumber, courseCode, courseName, creditHours, prerequisiteNote, electiveGroup) VALUES
('PC-M-8-1', 'March', 8, 'SCSE4108', 'Industrial Training (HW)', 8, '92 credits, CGPA >= 2.0', NULL),
('PC-M-8-2', 'March', 8, 'SCSE4114', 'Industrial Training Report', 4, '92 credits, CGPA >= 2.0', NULL);

-- ============================================
-- SUBSYSTEM 5 (Tarin) — Academic Planner demo account
-- TEST/DEMO DATA — not a real student. Seeded so the
-- Academic Planner feature can be exercised end-to-end.
-- Real bcrypt hash (of 'Planner123'), unlike the placeholder
-- hashes on the other seeded student accounts above.
-- Sem 1 fully completed, Sem 2 mostly completed with one
-- course in progress — 32 of 130 credits (only Sem 1/2 are
-- populated since those are the only interactive semesters
-- so far; later semesters will add more once extended).
-- ============================================
INSERT INTO users (userID, fullName, matricNumber, utmEmail, passwordHash, role) VALUES
('USR-STU-005', 'Nur Aisyah Kamil', 'A24CS5099', 'aisyahkamil@graduate.utm.my', '$2b$10$GVyPxs/11DWC7O.OSmINnOUEsMJtPdVF.4aR5WVbies7KM7Tdz/Hq', 'student');

INSERT INTO student (studentID, name, programmeID, intakeID, userID) VALUES
('A24CS5099', 'Nur Aisyah Kamil', 'SCSEH', 'IN-2024-1', 'USR-STU-005');

INSERT INTO planner_course_status (statusID, userID, courseCode, status) VALUES
('PST-001', 'USR-STU-005', 'SCSE1013', 'completed'),
('PST-002', 'USR-STU-005', 'SCST1123', 'completed'),
('PST-003', 'USR-STU-005', 'SCSR1013', 'completed'),
('PST-004', 'USR-STU-005', 'SCST1143', 'completed'),
('PST-005', 'USR-STU-005', 'ULRS1032', 'completed'),
('PST-006', 'USR-STU-005', 'FREE-ELEC-1', 'completed'),
('PST-007', 'USR-STU-005', 'SCSE1203', 'completed'),
('PST-008', 'USR-STU-005', 'SCSR1033', 'completed'),
('PST-009', 'USR-STU-005', 'SCST1223', 'completed'),
('PST-010', 'USR-STU-005', 'SCSE1224', 'completed'),
('PST-011', 'USR-STU-005', 'SCSR2213', 'in_progress'),
('PST-012', 'USR-STU-005', 'ULRS1182', 'completed');

-- Explicit row matching the DEFAULT (2) so the seeded demo account's
-- state is reproducible even if the column default ever changes.
INSERT INTO planner_student_progress (userID, currentSemester) VALUES
('USR-STU-005', 2);
