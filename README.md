# CourseBuddy (CB)

CourseBuddy is a web-based course registration assistant system developed for Universiti Teknologi Malaysia (UTM). The system helps students automatically generate clash-free course section patterns based on their selected courses, intake, and semester. Faculty administrators can manage handbook and timetable data digitally through structured Excel file uploads.

---

## 👥 Team Members

| Name | Subsystem | Role |
|---|---|---|
| Tarin | User Management Subsystem | Authentication, Profile, Navigation |
| Yousra | Handbook & Timetable Management Subsystem | Admin Upload, Course & Section Management |
| Rashed | Pattern Generation & Clash Detection Subsystem | Course Selection, Pattern Generation, Lecturer Preference |
| Shahtaj | Student Registration Subsystem | Pattern Selection, Recovery, Add/Drop Simulation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + CSS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Authentication | JWT + bcrypt.js |
| File Parsing | xlsx (SheetJS) |
| Local Development | XAMPP + phpMyAdmin |
| Hosting | Railway |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
CourseBuddy/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── auth/
│       │   ├── profile/
│       │   ├── home/
│       │   ├── admin/
│       │   ├── courses/
│       │   └── registration/
│       ├── services/
│       ├── components/
│       └── App.jsx
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .env
├── .gitignore
└── README.md
```

---

## 🗺️ Module Navigation Table

<table>
  <tr>
    <th>Module</th>
    <th>Frontend Script</th>
    <th>Backend Script</th>
  </tr>

  <!-- Subsystem 5: User Management — Tarin -->
  <tr>
    <td colspan="3"><strong>User Management Subsystem (Tarin)</strong></td>
  </tr>
  <tr>
    <td>Authentication and Authorization Module<br><br>UC021: Register Account<br>UC022: Login<br>UC023: Reset Password<br>UC024: Logout</td>
    <td>
      <a href="frontend/src/pages/auth/Register.jsx">Register.jsx</a><br>
      <a href="frontend/src/pages/auth/Login.jsx">Login.jsx</a><br>
      <a href="frontend/src/pages/auth/ResetPassword.jsx">ResetPassword.jsx</a><br>
      <a href="frontend/src/pages/auth/Logout.jsx">Logout.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/authController.js">authController.js</a><br>
      <a href="backend/services/authService.js">authService.js</a><br>
      <a href="backend/routes/authRoutes.js">authRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Profile Management Module<br><br>UC025: Initial Academic Setup<br>UC026: View Profile<br>UC027: Update Academic Info</td>
    <td>
      <a href="frontend/src/pages/profile/InitialAcademicSetup.jsx">InitialAcademicSetup.jsx</a><br>
      <a href="frontend/src/pages/profile/ViewProfile.jsx">ViewProfile.jsx</a><br>
      <a href="frontend/src/pages/profile/UpdateAcademicInfo.jsx">UpdateAcademicInfo.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/profileController.js">profileController.js</a><br>
      <a href="backend/services/profileService.js">profileService.js</a><br>
      <a href="backend/routes/profileRoutes.js">profileRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Homepage and Navigation Bar Module<br><br>UC028: Access Dashboard<br>UC029: Navigate System Features<br>UC030: Check Academic Alerts</td>
    <td>
      <a href="frontend/src/pages/home/Dashboard.jsx">Dashboard.jsx</a><br>
      <a href="frontend/src/pages/home/NavigationBar.jsx">NavigationBar.jsx</a><br>
      <a href="frontend/src/pages/home/AcademicAlerts.jsx">AcademicAlerts.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/homeController.js">homeController.js</a><br>
      <a href="backend/services/homeService.js">homeService.js</a><br>
      <a href="backend/routes/homeRoutes.js">homeRoutes.js</a>
    </td>
  </tr>

  <!-- Subsystem 6: Handbook & Timetable Management — Yousra -->
  <tr>
    <td colspan="3"><strong>Handbook & Timetable Management Subsystem (Yousra)</strong></td>
  </tr>
  <tr>
    <td>Handbook Management Module<br><br>UC031: Upload Handbook<br>UC032: View Handbook Data<br>UC033: Delete Handbook</td>
    <td>
      <a href="frontend/src/pages/admin/UploadHandbook.jsx">UploadHandbook.jsx</a><br>
      <a href="frontend/src/pages/admin/ViewHandbookData.jsx">ViewHandbookData.jsx</a><br>
      <a href="frontend/src/pages/admin/DeleteHandbook.jsx">DeleteHandbook.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/handbookController.js">handbookController.js</a><br>
      <a href="backend/services/handbookService.js">handbookService.js</a><br>
      <a href="backend/routes/handbookRoutes.js">handbookRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Timetable Management Module<br><br>UC034: Upload Timetable<br>UC035: View Timetable Data<br>UC036: Delete Timetable</td>
    <td>
      <a href="frontend/src/pages/admin/UploadTimetable.jsx">UploadTimetable.jsx</a><br>
      <a href="frontend/src/pages/admin/ViewTimetableData.jsx">ViewTimetableData.jsx</a><br>
      <a href="frontend/src/pages/admin/DeleteTimetable.jsx">DeleteTimetable.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/timetableController.js">timetableController.js</a><br>
      <a href="backend/services/timetableService.js">timetableService.js</a><br>
      <a href="backend/routes/timetableRoutes.js">timetableRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Course and Section Management Module<br><br>UC037: View Course and Section Data<br>UC038: Edit Course Data<br>UC039: Edit Section Data<br>UC040: Delete Course or Section Entry</td>
    <td>
      <a href="frontend/src/pages/admin/ViewCourseSection.jsx">ViewCourseSection.jsx</a><br>
      <a href="frontend/src/pages/admin/EditCourseData.jsx">EditCourseData.jsx</a><br>
      <a href="frontend/src/pages/admin/EditSectionData.jsx">EditSectionData.jsx</a><br>
      <a href="frontend/src/pages/admin/DeleteCourseSection.jsx">DeleteCourseSection.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/courseSectionController.js">courseSectionController.js</a><br>
      <a href="backend/services/courseSectionService.js">courseSectionService.js</a><br>
      <a href="backend/routes/courseSectionRoutes.js">courseSectionRoutes.js</a>
    </td>
  </tr>

  <!-- Subsystem 3: Pattern Generation — Rashed -->
  <tr>
    <td colspan="3"><strong>Pattern Generation & Clash Detection Subsystem (Rashed)</strong></td>
  </tr>
  <tr>
    <td>Course Selection Module<br><br>UC001: Select Intake and Semester<br>UC002: View Available Courses<br>UC003: View Course Prerequisite Information<br>UC004: Select Courses for Pattern Generation</td>
    <td>
      <a href="frontend/src/pages/courses/SelectIntakeSemester.jsx">SelectIntakeSemester.jsx</a><br>
      <a href="frontend/src/pages/courses/AvailableCourses.jsx">AvailableCourses.jsx</a><br>
      <a href="frontend/src/pages/courses/PrerequisiteInfo.jsx">PrerequisiteInfo.jsx</a><br>
      <a href="frontend/src/pages/courses/SelectCourses.jsx">SelectCourses.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/courseController.js">courseController.js</a><br>
      <a href="backend/services/courseService.js">courseService.js</a><br>
      <a href="backend/routes/courseRoutes.js">courseRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Pattern Generation Module<br><br>UC005: Generate Clash Free Patterns<br>UC006: View Generated Patterns<br>UC007: Select Preferred Pattern<br>UC008: View Pattern Details</td>
    <td>
      <a href="frontend/src/pages/courses/GeneratePatterns.jsx">GeneratePatterns.jsx</a><br>
      <a href="frontend/src/pages/courses/ViewPatterns.jsx">ViewPatterns.jsx</a><br>
      <a href="frontend/src/pages/courses/SelectPattern.jsx">SelectPattern.jsx</a><br>
      <a href="frontend/src/pages/courses/PatternDetails.jsx">PatternDetails.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/patternController.js">patternController.js</a><br>
      <a href="backend/services/patternService.js">patternService.js</a><br>
      <a href="backend/services/clashDetectionService.js">clashDetectionService.js</a><br>
      <a href="backend/routes/patternRoutes.js">patternRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Lecturer Preference Module<br><br>UC009: Set Lecturer Preference<br>UC010: Filter Patterns by Lecturer Preference<br>UC011: Generate Patterns Without Preference<br>UC012: Reset Lecturer Preference</td>
    <td>
      <a href="frontend/src/pages/courses/SetLecturerPreference.jsx">SetLecturerPreference.jsx</a><br>
      <a href="frontend/src/pages/courses/FilteredPatterns.jsx">FilteredPatterns.jsx</a><br>
      <a href="frontend/src/pages/courses/GenerateWithoutPref.jsx">GenerateWithoutPref.jsx</a><br>
      <a href="frontend/src/pages/courses/ResetPreference.jsx">ResetPreference.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/lecturerController.js">lecturerController.js</a><br>
      <a href="backend/services/lecturerService.js">lecturerService.js</a><br>
      <a href="backend/routes/lecturerRoutes.js">lecturerRoutes.js</a>
    </td>
  </tr>

  <!-- Subsystem 4: Student Registration — Shahtaj -->
  <tr>
    <td colspan="3"><strong>Student Registration Subsystem (Shahtaj)</strong></td>
  </tr>
  <tr>
    <td>Pattern Selection & Draft Vault Module<br><br>UC013: Filter Generated Patterns<br>UC014: Save Pattern to Draft Vault<br>UC015: View and Compare Saved Patterns<br>UC016: Select Final Blueprint</td>
    <td>
      <a href="frontend/src/pages/registration/FilterPatterns.jsx">FilterPatterns.jsx</a><br>
      <a href="frontend/src/pages/registration/SaveDraftVault.jsx">SaveDraftVault.jsx</a><br>
      <a href="frontend/src/pages/registration/ViewComparePatterns.jsx">ViewComparePatterns.jsx</a><br>
      <a href="frontend/src/pages/registration/SelectFinalBlueprint.jsx">SelectFinalBlueprint.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/registrationController.js">registrationController.js</a><br>
      <a href="backend/services/registrationService.js">registrationService.js</a><br>
      <a href="backend/routes/registrationRoutes.js">registrationRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Partial Registration Recovery Module<br><br>UC017: Report Registration Status<br>UC018: Execute Partial Recovery</td>
    <td>
      <a href="frontend/src/pages/registration/ReportRegistration.jsx">ReportRegistration.jsx</a><br>
      <a href="frontend/src/pages/registration/PartialRecovery.jsx">PartialRecovery.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/recoveryController.js">recoveryController.js</a><br>
      <a href="backend/services/recoveryService.js">recoveryService.js</a><br>
      <a href="backend/routes/recoveryRoutes.js">recoveryRoutes.js</a>
    </td>
  </tr>
  <tr>
    <td>Add/Drop Sandbox & Impact Simulation Module<br><br>UC019: Simulate Course Drop<br>UC020: Execute Gap Filling</td>
    <td>
      <a href="frontend/src/pages/registration/SimulateCourseDrop.jsx">SimulateCourseDrop.jsx</a><br>
      <a href="frontend/src/pages/registration/GapFilling.jsx">GapFilling.jsx</a>
    </td>
    <td>
      <a href="backend/controllers/sandboxController.js">sandboxController.js</a><br>
      <a href="backend/services/sandboxService.js">sandboxService.js</a><br>
      <a href="backend/routes/sandboxRoutes.js">sandboxRoutes.js</a>
    </td>
  </tr>

</table>

---

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js installed
- XAMPP installed and running (Apache + MySQL)
- Git installed

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/rashedutm/CourseBuddy.git
cd CourseBuddy
```

**2. Setup the database**
- Open phpMyAdmin at `http://localhost/phpmyadmin`
- Create a new database called `coursebuddy`
- Import `database/schema.sql`
- Import `database/seed.sql` for sample data

**3. Setup backend**
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=coursebuddy
JWT_SECRET=your_secret_key_here
PORT=3000
```

Run the backend:
```bash
node server.js
```

**4. Setup frontend**
```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3001`
Backend runs at `http://localhost:3000`

---

## 🤝 GitHub Collaboration Rules

1. Always work on your own branch only — never push directly to `main`
2. Always pull before starting work each day — `git pull origin your-branch-name`
3. Never touch another teammate's folder without agreement
4. Never push the `.env` file — it is in `.gitignore`
5. Each person writes their own database tables in `schema.sql` and informs the team before merging
6. Use clear commit messages — example: `feat: add UC005 generate patterns page`
7. Inform Rashed when your branch is ready to be merged into `main`

---

## 📌 Branch Strategy

| Branch | Owner | Purpose |
|---|---|---|
| `main` | Rashed | Stable final version — merged by Rashed only |
| `rashed` | Rashed | Pattern Generation & Clash Detection Subsystem |
| `tarin` | Tarin | User Management Subsystem |
| `yousra` | Yousra | Handbook & Timetable Management Subsystem |
| `zimly` | Zimly | Student Registration Subsystem |

**How to work with your branch:**

```bash
# Step 1 — Clone the repo (first time only)
git clone https://github.com/rashedutm/CourseBuddy.git
cd CourseBuddy

# Step 2 — Switch to your own branch
git checkout your-branch-name

# Step 3 — Pull latest changes before starting work
git pull origin your-branch-name

# Step 4 — After finishing your work, push to your branch
git add .
git commit -m "your commit message here"
git push origin your-branch-name
```
