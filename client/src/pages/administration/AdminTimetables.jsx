import React from 'react';
import './AdminTimetables.css';

const timetable = [
  { day: 'Monday', slots: ['A1 - Room 101', 'B1 - Room 203', 'C1 - Room 305', 'Support block'] },
  { day: 'Tuesday', slots: ['A2 - Room 102', 'B2 - Room 204', 'C1 - Room 305', 'Registration block'] },
  { day: 'Wednesday', slots: ['A1 - Room 101', 'B1 - Room 203', 'B2 - Room 204', 'Assessment review'] },
  { day: 'Thursday', slots: ['A2 - Room 102', 'B1 - Room 203', 'C1 - Room 305', 'Teacher planning'] },
  { day: 'Friday', slots: ['A1 - Room 101', 'A2 - Room 102', 'B2 - Room 204', 'Open office hour'] },
];

const times = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];

const AdminTimetables = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Timetables</span>
        <h1>Group timetable management</h1>
        <p>Mock timetable overview for administrators.</p>
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
                  <td key={`${row.day}-${slot}`}>{slot}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <button className="glass-panel" style={{ margin: '1rem', color: 'white', position: 'relative', left: '32rem', padding: '1rem', width: '5rem', background: '#3a7fef' }} onClick={() => alert('Edit functionality not implemented in this mockup.')}>
            Edit
          </button>
          {/* <h4>Edit</h4> */}
        </table>
      </section>
    </div>
  );
};

export default AdminTimetables;