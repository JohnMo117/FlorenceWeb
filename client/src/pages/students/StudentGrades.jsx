import React, { useState, useEffect } from 'react';
import './StudentGrades.css';

// TODO(security): Replace hardcoded studentId with JWT-derived identity.
const CURRENT_STUDENT_ID = 'S1';

const StudentGrades = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students/grades?studentId=${CURRENT_STUDENT_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load grades');
        return res.json();
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="section-dashboard"><p>Loading grades...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Grades</span>
        <h1>My grades</h1>
        <p>View of your current marks and notes.</p>
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
            {rows.map((row, index) => (
              <tr key={index}>
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