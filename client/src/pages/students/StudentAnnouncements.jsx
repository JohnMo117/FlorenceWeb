import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './StudentAnnouncements.css';

const StudentAnnouncements = () => {
  const { user } = useAuth();
  const studentId = user?.refId || 'S1';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students/announcements?studentId=${encodeURIComponent(studentId)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load announcements');
        return res.json();
      })
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <div className="section-dashboard"><p>Loading announcements...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Announcements</span>
        <h1>Teacher announcements</h1>
        <p>Broadcasts from your teachers for your enrolled groups {user ? `(${user.name})` : ''}.</p>
      </section>

      <section className="announcement-list">
        {announcements.length === 0 ? (
          <p className="glass-panel" style={{ padding: '1.5rem' }}>No announcements yet.</p>
        ) : (
          announcements.map((announcement, index) => (
            <article key={index} className="glass-panel announcement-card">
              <div className="announcement-topline">
                <strong>{announcement.title}</strong>
                <small>{announcement.createdAt}</small>
              </div>
              <p>{announcement.message}</p>
              <span className="announcement-audience">To: {announcement.audience}</span>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default StudentAnnouncements;