import React from 'react';
import './StudentClasses.css';

const classes = [
  { level: 'A2', name: 'Everyday English', room: 'Room 102', teacher: 'Marta Ruiz' },
  { level: 'B1', name: 'Intermediate Skills', room: 'Room 203', teacher: 'Luis Gomez' },
  { level: 'B2', name: 'Conversation Lab', room: 'Room 204', teacher: 'Ana Torres' },
];

const StudentClasses = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Classes</span>
        <h1>My classes</h1>
        <p>Overview of the English levels you attend.</p>
      </section>

      <section className="section-grid">
        {classes.map((item) => (
          <article key={item.level} className="glass-panel section-card">
            <div className="card-topline">
              <div>
                <span className="eyebrow">Level {item.level}</span>
                <h2>{item.name}</h2>
              </div>
              <strong>{item.room}</strong>
            </div>
            <p>{item.teacher}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default StudentClasses;