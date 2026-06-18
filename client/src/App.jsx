import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Students from './pages/Students';

import Teachers from './pages/Teachers';
import Teachers_Grades from './pages/Teacher_Grades';

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
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teacher-Grades" element={<Teachers_Grades/>}/>
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
