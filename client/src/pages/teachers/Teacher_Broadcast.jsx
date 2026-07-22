import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Teacher_Broadcast.css';

const Teacher_Broadcast = () => {
  const { user } = useAuth();
  const teacherId = user?.refId || 'T1';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    audience: 'All students',
    message: '',
  });

  // Fetch teacher's announcements and groups
  useEffect(() => {
    Promise.all([
      fetch(`/api/teachers/announcements?teacherId=${encodeURIComponent(teacherId)}`).then((r) => {
        if (!r.ok) throw new Error('Failed to load announcements');
        return r.json();
      }),
      fetch(`/api/teachers/groups?teacherId=${encodeURIComponent(teacherId)}`).then((r) => {
        if (!r.ok) throw new Error('Failed to load groups');
        return r.json();
      }),
    ])
      .then(([announcementsData, groupsData]) => {
        setAnnouncements(announcementsData);
        setGroups(groupsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [teacherId]);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/teachers/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacherId,
          title: formData.title.trim(),
          audience: formData.audience,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create announcement');
      }

      const newAnnouncement = await response.json();
      setAnnouncements((current) => [newAnnouncement, ...current]);
      setFormData({ title: '', audience: 'All students', message: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="teacher-broadcast page-container"><p>Loading...</p></div>;

  return (
    <div className="teacher-broadcast page-container">
      <section className="glass-panel broadcast-header">
        <span className="broadcast-tag">Teacher tools</span>
        <h1>Broadcast announcements</h1>
        <p>Write an announcement and publish it to your class feed.</p>
      </section>

      {error && (
        <section className="glass-panel" style={{ padding: '1rem', color: '#ef4444' }}>
          Error: {error}
          <button style={{ marginLeft: '1rem' }} onClick={() => setError(null)}>Dismiss</button>
        </section>
      )}

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
                {groups.map((group) => (
                  <option key={group.id} value={`${group.level} ${group.title}`}>
                    {group.level} {group.title}
                  </option>
                ))}
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