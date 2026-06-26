import React from 'react';
import './StudentAnnouncements.css';

const announcements = [
  {
    title: 'Homework reminder',
    audience: 'B1 Intermediate',
    message: 'Please review Unit 4 before Thursday. Short quiz at the start of class.',
    createdAt: 'Today at 08:30',
  },
  {
    title: 'Room change',
    audience: 'A2 Everyday English',
    message: 'Tomorrow’s lesson will move to the main hall for a special event.',
    createdAt: 'Yesterday',
  },
];

const StudentAnnouncements = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Announcements</span>
        <h1>Teacher announcements</h1>
        <p>Read-only mock feed. Broadcast actions are not enabled here.</p>
      </section>

      <section className="announcement-list">
        {announcements.map((announcement) => (
          <article key={announcement.title} className="glass-panel announcement-card">
            <div className="announcement-topline">
              <strong>{announcement.title}</strong>
              <small>{announcement.createdAt}</small>
            </div>
            <p>{announcement.message}</p>
            <span className="announcement-audience">To: {announcement.audience}</span>
          </article>
        ))}
      </section>
    </div>
  );
};

export default StudentAnnouncements;