import React, { useState, useEffect } from 'react';
import './StudentTimetable.css';

// TODO(security): Replace hardcoded studentId with JWT-derived identity.
const CURRENT_STUDENT_ID = 'S1';

const StudentTimetable = () => {
  const [times, setTimes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students/timetable?studentId=${CURRENT_STUDENT_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load timetable');
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

  if (loading) return <div className="section-dashboard"><p>Loading timetable...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Timetable</span>
        <h1>My weekly schedule</h1>
        <p>Your personalized timetable based on enrolled classes.</p>
      </section>

      <section className="glass-panel table-panel">
        <table className="simple-table timetable-table" aria-label="Student timetable">
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
                {row.slots.map((slot, index) => (
                  <td key={`${row.day}-${index}`}>{slot}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default StudentTimetable;