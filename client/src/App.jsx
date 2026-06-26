import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/grades" element={<StudentGrades />} />
            <Route path="/students/timetable" element={<StudentTimetable />} />
            <Route path="/students/classes" element={<StudentClasses />} />
            <Route path="/students/announcements" element={<StudentAnnouncements />} />

            <Route path="/administration" element={<Administration />} />
            <Route path="/administration/timetables" element={<AdminTimetables />} />
            <Route path="/administration/classes" element={<AdminClasses />} />
            <Route path="/administration/registration" element={<AdminRegistration />} />

            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teacher_grades" element={<Teacher_Grades />} />
            <Route path="/teacher_broadcast" element={<Teacher_Broadcast />} />
            <Route path="/teacher_timetables" element={<Teacher_Timetables />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/florenceConnect" element={<FlorenceConnect />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
