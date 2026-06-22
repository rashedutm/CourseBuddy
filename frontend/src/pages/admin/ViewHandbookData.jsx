import React, { useState, useEffect } from "react";
import axios from "axios";

// ───────────────────────────────────────────────
// UC032: View Handbook Data
// Lets a faculty admin filter by programme,
// intake, and semester to view handbook slots
// and courses from the backend database.
//
// Schema tables this connects to:
//   - handbook_slot (programmeID, intakeID,
//       semesterNumber, slotType, slotLabel)
//   - handbook_slot_course (slotID, courseCode)
//   - course (courseCode, courseName, creditHours)
//
// API endpoint: GET /api/handbook
// Params: programme, intake, semesterNumber
// ───────────────────────────────────────────────

function ViewHandbookData() {

  // Filter state — all three needed to query
  // the correct handbook_slot rows
  const [programme, setProgramme] = useState("SECSEH");
  const [intake, setIntake] = useState("October");
  const [semesterNumber, setSemesterNumber] = useState("1");

  // Data state
  const [handbookData, setHandbookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-fetch whenever any filter changes
  useEffect(() => {
    fetchHandbookData();
  }, [programme, intake, semesterNumber]);

  const fetchHandbookData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/handbook", {
        params: {
          programme: programme,
          intake: intake,
          semesterNumber: semesterNumber,
        },
      });
      setHandbookData(response.data);
    } catch (err) {
      console.error("Error fetching handbook data:", err);
      setError("Failed to load handbook data. Please try again.");
      setHandbookData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <p style={styles.eyebrow}>Handbook Management</p>
        <h1 style={styles.title}>View Handbook Data</h1>
        <p style={styles.subtitle}>
          Browse the course information currently stored for a specific
          programme, intake, and semester.
        </p>

        {/* ── Filters ── */}
        <div style={styles.filterRow}>

          {/* Programme — maps to programmeID in handbook_slot */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Programme</label>
            <select
              style={styles.select}
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
            >
              <option value="SECSEH">Software Engineering</option>
              <option value="SCSSEH">Computer Science</option>
              <option value="SCSDEH">Data Engineering</option>
              <option value="SCJAI">Artificial Intelligence</option>
              <option value="SCSIS">Information Systems</option>
            </select>
          </div>

          {/* Intake — maps to intakeID in handbook_slot */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Intake</label>
            <select
              style={styles.select}
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
            >
              <option value="October">October Intake</option>
              <option value="March">March Intake</option>
            </select>
          </div>

          {/* Semester — maps to semesterNumber in handbook_slot */}
          <div style={styles.filterGroup}>
            <label style={styles.label}>Semester</label>
            <select
              style={styles.select}
              value={semesterNumber}
              onChange={(e) => setSemesterNumber(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Semester {num}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* ── Loading state ── */}
        {loading && (
          <p style={styles.loadingText}>Loading handbook data...</p>
        )}

        {/* ── Error state ── */}
        {error && (
          <p style={styles.errorText}>{error}</p>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && handbookData.length === 0 && (
          <p style={styles.emptyText}>
            No handbook data found for this combination.
          </p>
        )}

        {/* ── Table — only shown when data exists ── */}
        {!loading && !error && handbookData.length > 0 && (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course Code</th>
                  <th style={styles.th}>Course Name</th>
                  <th style={styles.th}>Credit Hours</th>
                  <th style={styles.th}>Slot Type</th>
                  <th style={styles.th}>Slot Label</th>
                </tr>
              </thead>
              <tbody>
                {handbookData.map((course, index) => (
                  <tr
                    key={course.courseCode || index}
                    style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                  >
                    <td style={styles.td}>{course.courseCode}</td>
                    <td style={styles.td}>{course.courseName}</td>
                    <td style={styles.td}>{course.creditHours}</td>
                    <td style={styles.td}>{course.slotType || "—"}</td>
                    <td style={styles.td}>{course.slotLabel || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={styles.footnote}>
              Showing {handbookData.length} course entries for {programme},{" "}
              {intake} intake, Semester {semesterNumber}.
            </p>
          </>
        )}

      </div>
    </div>
  );
}


export default ViewHandbookData;