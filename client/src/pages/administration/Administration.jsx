import React from 'react';
import { Link } from 'react-router-dom';
import './Administration.css';

const items = [
  { title: 'Timetables', description: 'Manage the weekly schedule for each group.', to: '/administration/timetables', badge: '3 groups' },
  { title: 'English levels', description: 'Organize the A1 to C1 classes.', to: '/administration/classes', badge: 'A1 - C1' },
  { title: 'Registration', description: 'Track student and teacher enrollment.', to: '/administration/registration', badge: '12 pending' },
];

const Administration = () => {
  return (
    <div className="section-dashboard admin-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Administration portal</span>
        <h1>Administrative dashboard</h1>
        <p>Read-only mockup for the school operations area.</p>
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

      {/* <section className="glass-panel admin-note-panel">
        <h2>Dashboard scope</h2>
        <ul>
          <li>Timetables for each group</li>
          <li>English levels from A1 to C1</li>
          <li>Student and teacher registration overview</li>
        </ul>
      </section> */}
    </div>
  );
};

export default Administration;