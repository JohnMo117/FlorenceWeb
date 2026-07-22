import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Students from './pages/students/Students';
import StudentGrades from './pages/students/StudentGrades';
import StudentTimetable from './pages/students/StudentTimetable';
import StudentClasses from './pages/students/StudentClasses';
import StudentAnnouncements from './pages/students/StudentAnnouncements';

import Administration from './pages/administration/Administration';
import AdminTimetables from './pages/administration/AdminTimetables';
import AdminClasses from './pages/administration/AdminClasses';
import AdminRegistration from './pages/administration/AdminRegistration';

import Teachers from './pages/teachers/Teachers';
import Teacher_Grades from './pages/teachers/Teacher_Grades';
import Teacher_Broadcast from './pages/teachers/Teacher_Broadcast';
import Teacher_Timetables from './pages/teachers/Teacher_Timetables';

import About from './pages/About';
import Login from './pages/Login';
import FlorenceConnect from './pages/FlorenceConnect';
import RoleGuard from './components/RoleGuard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Student Routes */}
              <Route path="/students" element={<RoleGuard allowedRoles={['Student']}><Students /></RoleGuard>} />
              <Route path="/students/grades" element={<RoleGuard allowedRoles={['Student']}><StudentGrades /></RoleGuard>} />
              <Route path="/students/timetable" element={<RoleGuard allowedRoles={['Student']}><StudentTimetable /></RoleGuard>} />
              <Route path="/students/classes" element={<RoleGuard allowedRoles={['Student']}><StudentClasses /></RoleGuard>} />
              <Route path="/students/announcements" element={<RoleGuard allowedRoles={['Student']}><StudentAnnouncements /></RoleGuard>} />

              {/* Administration Routes */}
              <Route path="/administration" element={<RoleGuard allowedRoles={['Admin']}><Administration /></RoleGuard>} />
              <Route path="/administration/timetables" element={<RoleGuard allowedRoles={['Admin']}><AdminTimetables /></RoleGuard>} />
              <Route path="/administration/classes" element={<RoleGuard allowedRoles={['Admin']}><AdminClasses /></RoleGuard>} />
              <Route path="/administration/registration" element={<RoleGuard allowedRoles={['Admin']}><AdminRegistration /></RoleGuard>} />

              {/* Teacher Routes */}
              <Route path="/teachers" element={<RoleGuard allowedRoles={['Teacher']}><Teachers /></RoleGuard>} />
              <Route path="/teacher_grades" element={<RoleGuard allowedRoles={['Teacher']}><Teacher_Grades /></RoleGuard>} />
              <Route path="/teacher_broadcast" element={<RoleGuard allowedRoles={['Teacher']}><Teacher_Broadcast /></RoleGuard>} />
              <Route path="/teacher_timetables" element={<RoleGuard allowedRoles={['Teacher']}><Teacher_Timetables /></RoleGuard>} />

              {/* Public Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/florenceConnect" element={<FlorenceConnect />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
