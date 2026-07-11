import React, { useState, useEffect } from 'react';
import './StudentClasses.css';

// TODO(security): Replace hardcoded studentId with JWT-derived identity.
const CURRENT_STUDENT_ID = 'S1';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students/classes?studentId=${CURRENT_STUDENT_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load classes');
        return res.json();
      })
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="section-dashboard"><p>Loading classes...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

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