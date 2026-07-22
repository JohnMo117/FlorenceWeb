import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './StudentClasses.css';

const StudentClasses = () => {
  const { user } = useAuth();
  const studentId = user?.refId || 'S1';

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students/classes?studentId=${encodeURIComponent(studentId)}`)
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
  }, [studentId]);

  if (loading) return <div className="section-dashboard"><p>Loading classes...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Classes</span>
        <h1>My classes</h1>
        <p>Overview of the English levels you attend {user ? `(${user.name})` : ''}.</p>
      </section>

      <section className="section-grid">
        {classes.length === 0 ? (
          <article className="glass-panel section-card">
            <p>Not enrolled in any active classes yet.</p>
          </article>
        ) : (
          classes.map((item, index) => (
            <article key={index} className="glass-panel section-card">
              <div className="card-topline">
                <div>
                  <span className="eyebrow">Level {item.level}</span>
                  <h2>{item.name}</h2>
                </div>
                <strong>{item.room}</strong>
              </div>
              <p>Teacher: {item.teacher}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default StudentClasses;