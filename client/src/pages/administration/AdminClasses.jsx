import React from 'react';
import './AdminClasses.css';

const classes = [
  { level: 'A1', title: 'Beginners', students: 24, teacher: 'Marta Ruiz', room: 'Room 101' },
  { level: 'B1', title: 'Intermediate', students: 21, teacher: 'Luis Gomez', room: 'Room 203' },
  { level: 'C1', title: 'Advanced', students: 18, teacher: 'Ana Torres', room: 'Room 305' },
  { level: 'A2', title: 'Elementary', students: 20, teacher: 'Sara Lopez', room: 'Room 102' },
];

const AdminClasses = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">English levels</span>
        <h1>Class structure overview</h1>
        <p>Mock view for reviewing A1 to C1 groups.</p>
      </section>

      <section className="section-grid">
        {classes.map((item) => (
          <article key={item.level} className="glass-panel section-card class-card">
            <div className="card-topline">
              <div>
                <span className="eyebrow">Level {item.level}</span>
                <h2>{item.title}</h2>
              </div>
              <strong>{item.students} students</strong>
            </div>
            <p>{item.teacher}</p>
            <p>{item.room}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdminClasses;