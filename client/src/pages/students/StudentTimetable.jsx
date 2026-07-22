import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './StudentTimetable.css';

const StudentTimetable = () => {
  const { user } = useAuth();
  const studentId = user?.refId || 'S1';

  const [times, setTimes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/students/timetable?studentId=${encodeURIComponent(studentId)}`)
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
  }, [studentId]);

  if (loading) return <div className="section-dashboard"><p>Loading timetable...</p></div>;
  if (error) return <div className="section-dashboard"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Timetable</span>
        <h1>My weekly schedule</h1>
        <p>Your personalized timetable based on enrolled classes {user ? `(${user.name})` : ''}.</p>
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