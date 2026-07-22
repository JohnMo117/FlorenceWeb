import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Teacher_Timetables.css';

const Teacher_Timetables = () => {
  const { user } = useAuth();
  const teacherId = user?.refId || 'T1';

  const [times, setTimes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/teachers/timetable?teacherId=${encodeURIComponent(teacherId)}`)
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
  }, [teacherId]);

  if (loading) return <div className="teacher-timetables page-container"><p>Loading timetable...</p></div>;
  if (error) return <div className="teacher-timetables page-container"><p style={{ color: '#ef4444' }}>Error: {error}</p></div>;

  return (
    <div className="teacher-timetables page-container">
      <section className="glass-panel timetable-panel">
        <h1>Teacher Timetable</h1>
        <p>Your weekly class schedule {user ? `(${user.name})` : ''}.</p>

        <div className="timetable-table-wrapper">
          <table className="timetable-table" aria-label="Teacher weekly timetable">
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
                    <td key={`${row.day}-${index}`}>{slot.activity}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Teacher_Timetables;
