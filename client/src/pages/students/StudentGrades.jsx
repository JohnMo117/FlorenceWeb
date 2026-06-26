import React from 'react';
import './StudentGrades.css';

const rows = [
  { subject: 'Reading', score: '8.9', note: 'Excellent comprehension' },
  { subject: 'Writing', score: '7.8', note: 'Good structure and clarity' },
  { subject: 'Listening', score: '8.4', note: 'Teacher feedback pending' },
];

const StudentGrades = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Grades</span>
        <h1>My grades</h1>
        <p>Read-only view of your current marks and notes.</p>
      </section>

      <section className="glass-panel table-panel">
        <table className="simple-table" aria-label="Student grades">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.subject}>
                <td>{row.subject}</td>
                <td>{row.score}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default StudentGrades;