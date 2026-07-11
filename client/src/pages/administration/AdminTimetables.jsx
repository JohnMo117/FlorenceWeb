import React, { useState, useEffect } from 'react';
import './AdminTimetables.css';

const AdminTimetables = () => {
  const [times, setTimes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editActivity, setEditActivity] = useState('');

  useEffect(() => {
    fetch('/api/admin/timetables')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load timetables');
        return res.json();
      })
      .then((data) => {
        setTimes(data.times);
        setTimetable(data.timetable);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (slot) => {
    setEditingSlot(slot.id);
    setEditActivity(slot.activity);
  };

  const handleSave = async (slotId) => {
    try {
      const response = await fetch(`/api/admin/timetables/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity: editActivity }),
      });
      if (!response.ok) throw new Error('Failed to update slot');

      // Update local state
      setTimetable((prev) =>
        prev.map((row) => ({
          ...row,
          slots: row.slots.map((s) =>
            s.id === slotId ? { ...s, activity: editActivity } : s
          ),
        }))
      );
      setEditingSlot(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="section-dashboard"><p>Loading timetables...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Timetables</span>
        <h1>Group timetable management</h1>
        <p>Edit the weekly schedule for each group.</p>
      </section>

      <section className="glass-panel table-panel">
        <table className="simple-table timetable-table" aria-label="Administration timetable">
          <thead>
            <tr>
              <th>Day</th>
              {times.map((time) => (
                <th key={time}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.map((row) => (
              <tr key={row.day}>
                <th scope="row">{row.day}</th>
                {row.slots.map((slot) => (
                  <td key={slot.id}>
                    {editingSlot === slot.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={editActivity}
                          onChange={(e) => setEditActivity(e.target.value)}
                          style={{ fontSize: '0.8rem', padding: '0.25rem' }}
                        />
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => handleSave(slot.id)}
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => setEditingSlot(null)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(slot)}
                        title="Click to edit"
                      >
                        {slot.activity}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminTimetables;