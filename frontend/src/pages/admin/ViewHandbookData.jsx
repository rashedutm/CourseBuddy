import React, { useState } from "react";



// UC032: View Handbook Data
// Shows the courses that were extracted from an
// uploaded handbook. Using dummy data for now
// since the backend is not connected yet.
// ───────────────────────────────────────────────
 
// Sample data to display, standing in for what would
// normally come from the database after an upload

const dummyHandbookData = [
    { courseCode: "SECJ3104", CourseName: "Application Development", creditHours: 4, prerequisite: "SECJ2154"},
    { courseCode: "SECR3203", courseName: "Software Engineering", creditHours: 3, prerequisite: "None" },
    { courseCode: "SECJ2154", courseName: "Object Oriented Programming", creditHours: 4, prerequisite: "SECJ1016" },
    { courseCode: "SCSJ3104", courseName: "Software Design and Architecture", creditHours: 3, prerequisite: "SECR3203" },
];
 

function ViewHandbookData() {
    const [intake, setIntake] = useSate("October");

    return (
        <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Handbook Management</p>
        <h1 style={styles.title}>View Handbook Data</h1>
        <p style={styles.subtitle}>
          Browse the course information currently stored for each intake's
          handbook.
        </p>
        
        <div style={styles.formGroup}>
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
        
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Course Code</th>
              <th style={styles.th}>Course Name</th>
              <th style={styles.th}>Credit Hours</th>
              <th style={styles.th}>Prerequisite</th>
            </tr>
          </thead>
          <tbody>
            {dummyHandbookData.map((course, index) => (
              <tr key={course.courseCode} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{course.courseCode}</td>
                <td style={styles.td}>{course.courseName}</td>
                <td style={styles.td}>{course.creditHours}</td>
                <td style={styles.td}>{course.prerequisite}</td>
              </tr>
            ))}
          </tbody>
        </table>
 
        <p style={styles.footnote}>
          Showing {dummyHandbookData.length} course entries for the {intake}{" "}
          intake handbook.
        </p>
      </div>
    </div>
  );
}

