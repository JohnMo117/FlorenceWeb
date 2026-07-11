import React, { useState, useEffect } from 'react';
import './AdminClasses.css';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/classes')
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
        <span className="eyebrow">English levels</span>
        <h1>Class structure overview</h1>
        <p>Review the A1 to C1 groups from the server.</p>
      </section>

      <section className="section-grid">
        {classes.map((item) => (
          <article key={item.id} className="glass-panel section-card class-card">
            <div className="card-topline">
              <div>
                <span className="eyebrow">Level {item.level}</span>
                <h2>{item.title}</h2>
              </div>
              <strong>{item.studentCount} students</strong>
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