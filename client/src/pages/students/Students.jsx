import React from 'react';
import { Link } from 'react-router-dom';
import './Students.css';

const items = [
  { title: 'Grades', description: 'Check your latest marks and feedback.', to: '/students/grades', badge: '8.7 avg' },
  { title: 'Timetable', description: 'See your weekly class schedule.', to: '/students/timetable', badge: 'Next: 10:00' },
  { title: 'Classes', description: 'Review your current level groups.', to: '/students/classes', badge: '3 groups' },
  { title: 'Announcements', description: 'Read teacher notes and reminders.', to: '/students/announcements', badge: '2 new' },
];

const Students = () => {
  return (
    <div className="section-dashboard students-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Students portal</span>
        <h1>Student dashboard</h1>
        <p>Simple mockup for the student side of the site. Each page stays isolated and read-only.</p>
      </section>

      <section className="section-grid">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="glass-panel section-card">
            <div className="card-topline">
              <h2>{item.title}</h2>
              <strong>{item.badge}</strong>
            </div>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Students;
