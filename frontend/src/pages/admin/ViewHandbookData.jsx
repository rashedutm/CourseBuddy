import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAvailableYears,
  getAvailableMonths,
  getHandbookData
} from "../../services/handbookService";
import "./admin.css";

// ============================================
// UC032: View Handbook Data
// Shows the courses from the handbook for a selected intake
// Uses real UTM data from seed.sql
// ============================================

export default function ViewHandbookData() {
    const navigate = useNavigate();
  // State for filters
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  // State for data
  const [handbookData, setHandbookData] = useState([]);
  const [groupedCourses, setGroupedCourses] = useState({});
  const [intakeInfo, setIntakeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // Load available years on component mount
  // ============================================
  useEffect(() => {
    const loadYears = async () => {
      try {
        const years = await getAvailableYears();
        
        // If backend returns data, use it; otherwise use local fallback
        if (years && years.length > 0) {
          setAvailableYears(years);
          const latestYear = years[0];
          setSelectedYear(latestYear);

          const months = await getAvailableMonths(latestYear);
          setAvailableMonths(months);

          if (months.length > 0) {
            const defaultMonth = months.includes("October") ? "October" : months[0];
            setSelectedMonth(defaultMonth);
          }
        } else {
          // Fallback to local data if backend is empty
          console.log("Backend returned no data, using local fallback");
          const localYears = [2025, 2024];
          setAvailableYears(localYears);
          setSelectedYear(2025);
          setAvailableMonths(["March", "October"]);
          setSelectedMonth("March");
        }
      } catch (err) {
        console.error("Error loading years:", err);
        // Use local fallback on error
        const localYears = [2025, 2024];
        setAvailableYears(localYears);
        setSelectedYear(2025);
        setAvailableMonths(["March", "October"]);
        setSelectedMonth("March");
      }
    };
    loadYears();
  }, []);

  // ============================================
  // Fetch data when year or month changes
  // ============================================
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      loadHandbookData(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth]);

  // ============================================
  // Load handbook data for selected intake
  // ============================================
  const loadHandbookData = async (year, month) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHandbookData(year, month);

      if (data && data.courses && data.courses.length > 0) {
        setHandbookData(data.courses);
        setIntakeInfo({
          intakeName: data.intakeName,
          academicSession: data.academicSession,
          totalCourses: data.courses.length
        });

        // Group courses by semester
        const grouped = {};
        data.courses.forEach(course => {
          const semester = course.semesterNumber;
          if (!grouped[semester]) {
            grouped[semester] = [];
          }
          grouped[semester].push(course);
        });
        setGroupedCourses(grouped);
      } else {
        // Backend returned no data, use local fallback
        console.log("Backend returned no data, using local fallback");
        const { getIntakeData, getCoursesGroupedBySemester } = require("../../data/handbookData");
        const localData = getIntakeData(year, month);
        
        if (localData) {
          setHandbookData(localData.courses);
          setIntakeInfo({
            intakeName: localData.intakeName,
            academicSession: localData.academicSession,
            totalCourses: localData.courses.length
          });
          setGroupedCourses(getCoursesGroupedBySemester(year, month));
        } else {
          setHandbookData([]);
          setGroupedCourses({});
          setIntakeInfo(null);
          setError(`No handbook data found for ${month} ${year}. Please select a different intake.`);
        }
      }
    } catch (err) {
      console.error("Error loading handbook data:", err);
      // Try local fallback on error
      try {
        const { getIntakeData, getCoursesGroupedBySemester } = require("../../data/handbookData");
        const localData = getIntakeData(year, month);
        
        if (localData) {
          setHandbookData(localData.courses);
          setIntakeInfo({
            intakeName: localData.intakeName,
            academicSession: localData.academicSession,
            totalCourses: localData.courses.length
          });
          setGroupedCourses(getCoursesGroupedBySemester(year, month));
        } else {
          setError("Failed to load handbook data. Please try again.");
          setHandbookData([]);
          setGroupedCourses({});
        }
      } catch (fallbackErr) {
        setError("Failed to load handbook data. Please try again.");
        setHandbookData([]);
        setGroupedCourses({});
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Handle year change
  // ============================================
  const handleYearChange = async (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);

    try {
      const months = await getAvailableMonths(year);
      setAvailableMonths(months);

      if (months.length > 0) {
        const defaultMonth = months.includes("October") ? "October" : months[0];
        setSelectedMonth(defaultMonth);
      } else {
        setSelectedMonth("");
      }
    } catch (err) {
      console.error("Error loading months:", err);
      setError("Failed to load available months");
    }
  };

  // ============================================
  // Handle month change
  // ============================================
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // ============================================
  // Get sorted semesters
  // ============================================
  const getSortedSemesters = () => {
    return Object.keys(groupedCourses).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="admin-page">
      <div className="admin-card">
        <p className="admin-badge">Handbook Management</p>
        <h1 style={{fontSize: '26px', fontWeight: '700', color: '#333', marginBottom: '8px'}}>View Handbook Data</h1>
        <p style={{color: '#888', fontSize: '14px', marginBottom: '24px'}}>
          Browse the course information currently stored for each intake's handbook.
        </p>

        <div style={{display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap'}}>
          <div className="admin-form-group" style={{marginBottom: 0}}>
            <label>Intake Year</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">Select Year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group" style={{marginBottom: 0}}>
            <label>Intake Month</label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={!selectedYear}
            >
              <option value="">Select Month</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {intakeInfo && (
            <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto'}}>
              <span className="admin-badge">
                {intakeInfo.intakeName} ({intakeInfo.academicSession})
              </span>
              <span style={{fontSize: '14px', color: '#6b7280'}}>
                {intakeInfo.totalCourses} courses total
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="admin-loading">
            <p>Loading handbook data...</p>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && handbookData.length === 0 && selectedYear && selectedMonth && (
          <div className="admin-empty">
            <p style={{fontSize: '18px', marginBottom: '8px'}}>
              No handbook data found for {selectedMonth} {selectedYear}.
            </p>
            <p style={{fontSize: '14px', color: '#9ca3af'}}>
              Please try selecting a different intake or contact your faculty administrator.
            </p>
          </div>
        )}

        {!loading && !error && handbookData.length > 0 && (
          <>
            {getSortedSemesters().map((semesterNum) => (
              <div key={semesterNum} style={{marginBottom: '32px'}}>
                <h3 style={{fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '16px'}}>
                  Semester {semesterNum}
                  <span style={{fontSize: '14px', fontWeight: '400', color: '#6b7280', marginLeft: '8px'}}>
                    ({groupedCourses[semesterNum].length} courses)
                  </span>
                </h3>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Credit Hours</th>
                      <th>Prerequisites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCourses[semesterNum].map((course, index) => (
                      <tr key={course.courseCode} style={index % 2 === 0 ? {backgroundColor: '#fff'} : {backgroundColor: '#f9fafb'}}>
                        <td><strong>{course.courseCode}</strong></td>
                        <td>{course.courseName}</td>
                        <td>{course.creditHours}</td>
                        <td>
                          {course.prerequisites ? (
                            <span className="admin-badge" style={{background: '#fef3c7', color: '#92400e'}}>
                              {course.prerequisites}
                            </span>
                          ) : (
                            <span style={{color: '#9ca3af'}}>None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <p style={{fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '32px'}}>
              Showing {handbookData.length} course entries for {intakeInfo?.intakeName}.
            </p>
          </>
        )}

        {/* Route Links */}
        <div style={{marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e5e7eb'}}>
          <p style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>📋 Available Admin Pages:</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px'}}>
            <a href="/admin/handbook/upload" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Upload Handbook</a>
            <a href="/admin/handbook/delete" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Delete Handbook</a>
            <a href="/admin/timetable/upload" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>Upload Timetable</a>
            <a href="/admin/timetable/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Timetable</a>
            <a href="/admin/courses/view" style={{color: '#8b0000', textDecoration: 'none', fontSize: '14px', padding: '8px 12px', background: '#fdf0f0', borderRadius: '6px'}}>View Courses</a>
          </div>
        </div>
      </div>
    </div>
  );
}