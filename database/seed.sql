-- ============================================
-- CourseBuddy Seed Data
-- Sample data for local testing — Subsystem 3
-- ============================================

INSERT INTO intake (intakeID, intakeName, intakeMonth, intakeYear) VALUES
('IN001', 'October 2023', 'October', 2023),
('IN002', 'March 2024', 'March', 2024);

INSERT INTO semester (semesterID, intakeID, semesterNumber, semesterName) VALUES
('SEM001', 'IN001', 1, 'Year 1 Semester 1'),
('SEM002', 'IN001', 2, 'Year 1 Semester 2');

INSERT INTO student (studentID, name, email, programme, intakeID) VALUES
('A22EC0001', 'Ahmad Rashed', 'rashed@graduate.utm.my', 'Software Engineering', 'IN001');

INSERT INTO handbook (handbookID, intakeID, semesterID, uploadedBy, uploadDate) VALUES
('HB001', 'IN001', 'SEM002', 'admin001', '2025-06-01');

INSERT INTO course (courseCode, handbookID, courseName, creditHours, hasPrerequisite) VALUES
('SECJ2013', 'HB001', 'Data Structures and Algorithms', 3, TRUE),
('SECJ2023', 'HB001', 'Object Oriented Programming', 3, TRUE),
('SECJ2033', 'HB001', 'Computer Organisation and Architecture', 3, FALSE),
('SECJ2043', 'HB001', 'Statistics for Computer Science', 2, FALSE),
('SECJ1013', 'HB001', 'Programming Fundamentals', 3, FALSE);

INSERT INTO prerequisite (prerequisiteID, courseCode, prerequisiteCourseCode, isMandatory) VALUES
('PR001', 'SECJ2013', 'SECJ1013', TRUE);

INSERT INTO lecturer (lecturerID, lecturerName, email, faculty) VALUES
('L001', 'Dr. Ahmad Zaki', 'azaki@utm.my', 'Faculty of Computing'),
('L002', 'Dr. Nurul Ain', 'nurulain@utm.my', 'Faculty of Computing'),
('L003', 'Dr. Siti Hajar', 'sitihajar@utm.my', 'Faculty of Computing');

INSERT INTO section (sectionID, courseCode, sectionNumber, lecturerID, day, timeStart, timeEnd, venue) VALUES
('S001', 'SECJ2013', '01', 'L001', 'Monday', '08:00:00', '10:00:00', 'N28-1'),
('S002', 'SECJ2013', '02', 'L001', 'Monday', '10:00:00', '12:00:00', 'N28-1'),
('S003', 'SECJ2013', '03', 'L002', 'Wednesday', '08:00:00', '10:00:00', 'N28-2'),
('S004', 'SECJ2023', '01', 'L003', 'Tuesday', '08:00:00', '10:00:00', 'N28-3'),
('S005', 'SECJ2023', '02', 'L003', 'Tuesday', '10:00:00', '12:00:00', 'N28-3');

INSERT INTO selected_course (selectionID, studentID, courseCode, semesterID, selectionDate) VALUES
('SC001', 'A22EC0001', 'SECJ2013', 'SEM002', '2025-06-10'),
('SC002', 'A22EC0001', 'SECJ2023', 'SEM002', '2025-06-10');
