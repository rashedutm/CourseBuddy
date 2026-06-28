-- ============================================================
-- TEMP MOCK - REMOVE WHEN INTEGRATING WITH RASHED
-- Mock registration data for testing Subsystem 4 (Zimly)
-- Simulates ONE saved/active pattern so the API-driven
-- registration pages render WITHOUT Rashed's pattern generator.
--
-- Powers: GET /api/patterns/active?studentID=A24CS4034
-- Used by: SaveDraftVault, GapFilling, PartialRecovery, SimulateCourseDrop
--
-- PREREQUISITE: seed.sql must already be loaded — this mock
-- references existing rows:
--   student   A24CS4034 (Shahtaj Zimly Shiney)
--   semester  SEM-2024-1-5 (Year 3 Sem 1)
--   sections  SEC-T-001 / SEC-T-006 / SEC-T-011 / SEC-T-016
--   courses   SCSE3143 / SCSE3103 / SCSE3203 / UHLB3132
--
-- 4 clash-free sections:
--   SCSE3143 SEC-T-001  Mon 14:00-17:00
--   SCSE3103 SEC-T-006  Wed 11:00-13:00
--   SCSE3203 SEC-T-011  Mon 10:00-13:00
--   UHLB3132 SEC-T-016  Tue 08:00-10:00
--
-- RUN:
--   mysql -h 127.0.0.1 -P 8889 -u root -proot coursebuddy < mock_registration.sql
-- VERIFY:
--   curl "http://localhost:5000/api/patterns/active?studentID=A24CS4034"
-- ============================================================

-- Idempotent cleanup so this script is safe to re-run
DELETE FROM registration_history WHERE historyID = 'RH-MOCK-001';
DELETE FROM pattern_detail       WHERE patternID  = 'PAT-MOCK-001';
DELETE FROM pattern              WHERE patternID  = 'PAT-MOCK-001';

-- 1) Pattern header  (pattern table)
INSERT INTO pattern
    (patternID, studentID, semesterID, totalCourses, totalCreditHours, generatedDate, isSelected)
VALUES
    ('PAT-MOCK-001', 'A24CS4034', 'SEM-2024-1-5', 4, 11, CURDATE(), TRUE);

-- 2) The 4 sections in the pattern  (pattern_detail -> section)
INSERT INTO pattern_detail
    (patternDetailID, patternID, courseCode, sectionID)
VALUES
    ('PD-MOCK-001', 'PAT-MOCK-001', 'SCSE3143', 'SEC-T-001'),
    ('PD-MOCK-002', 'PAT-MOCK-001', 'SCSE3103', 'SEC-T-006'),
    ('PD-MOCK-003', 'PAT-MOCK-001', 'SCSE3203', 'SEC-T-011'),
    ('PD-MOCK-004', 'PAT-MOCK-001', 'UHLB3132', 'SEC-T-016');

-- 3) Mark it ACTIVE  (registration_history.isActive = TRUE)
--    This WHERE clause in getActivePattern is what selects this row.
INSERT INTO registration_history
    (historyID, studentID, patternID, selectedDate, isActive)
VALUES
    ('RH-MOCK-001', 'A24CS4034', 'PAT-MOCK-001', CURDATE(), TRUE);

SELECT 'Mock active pattern PAT-MOCK-001 created for student A24CS4034' AS status;
