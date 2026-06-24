import React, { useState } from 'react';
import './Teacher_Broadcast.css';

const initialAnnouncements = [
  {
    id: 'announcement-1',
    title: 'Welcome to this week',
    audience: 'All students',
    message: 'Please review Unit 5 notes before Thursday. We will open with a quick quiz.',
    createdAt: 'Today at 08:30',
  },
];

const createAnnouncementId = () => `announcement-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

const Teacher_Broadcast = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [formData, setFormData] = useState({
    title: '',
    audience: 'All students',
    message: '',
  });

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      return;
    }

    const now = new Date();
    const createdAt = now.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    });

    const newAnnouncement = {
      id: createAnnouncementId(),
      title: formData.title.trim(),
      audience: formData.audience,
      message: formData.message.trim(),
      createdAt,
    };

    setAnnouncements((current) => [newAnnouncement, ...current]);
    setFormData({
      title: '',
      audience: 'All students',
      message: '',
    });
  };

  return (
    <div className="teacher-broadcast page-container">
      <section className="glass-panel broadcast-header">
        <span className="broadcast-tag">Teacher tools</span>
        <h1>Broadcast announcements</h1>
        <p>Write an announcement and publish it instantly to your class feed (mock local view).</p>
      </section>

      <section className="broadcast-layout">
        <article className="glass-panel composer-panel">
          <h2>Create announcement</h2>
          <form className="broadcast-form" onSubmit={onSubmit}>
            <label>
              Title
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onFieldChange}
                placeholder="Exam reminder"
                required
              />
            </label>

            <label>
              Audience
              <select name="audience" value={formData.audience} onChange={onFieldChange}>
                <option value="All students">All students</option>
                <option value="A1 Begginers">A1 Begginers</option>
                <option value="B1 Intermidate">B1 Intermidate</option>
                <option value="C1 Advanced">C1 Advanced</option>
              </select>
            </label>

            <label>
              Announcement
              <textarea
                name="message"
                value={formData.message}
                onChange={onFieldChange}
                rows={5}
                placeholder="Write details for your students..."
                required
              />
            </label>

            <button type="submit" className="btn btn-primary">
              Publish announcement
            </button>
          </form>
        </article>

        <article className="glass-panel feed-panel">
          <div className="feed-heading">
            <h2>Published announcements</h2>
            <span>{announcements.length} total</span>
          </div>

          <div className="announcement-list">
            {announcements.map((announcement) => (
              <article key={announcement.id} className="announcement-card">
                <div className="announcement-topline">
                  <strong>{announcement.title}</strong>
                  <small>{announcement.createdAt}</small>
                </div>
                <p>{announcement.message}</p>
                <span className="audience-pill">To: {announcement.audience}</span>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Teacher_Broadcast;
