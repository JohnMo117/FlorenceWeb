import React from 'react';
import './StudentTimetable.css';

const timetable = [
  { day: 'Monday', slots: ['Reading', 'Listening', 'Break', 'Writing'] },
  { day: 'Tuesday', slots: ['Grammar', 'Speaking', 'Break', 'Project work'] },
  { day: 'Wednesday', slots: ['Reading', 'Listening', 'Break', 'Homework review'] },
  { day: 'Thursday', slots: ['Writing', 'Speaking', 'Break', 'Practice test'] },
  { day: 'Friday', slots: ['Quiz review', 'Listening', 'Break', 'Wrap-up'] },
];

const times = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];

const StudentTimetable = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Timetable</span>
        <h1>My weekly schedule</h1>
        <p>Mock timetable preview for the student portal.</p>
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
                {row.slots.map((slot) => (
                  <td key={`${row.day}-${slot}`}>{slot}</td>
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