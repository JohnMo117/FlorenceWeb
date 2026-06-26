import React from 'react';
import './Teacher_Timetables.css';

const timetable = [
  {
    day: 'Monday',
    slots: ['A1 Beginners - Room 101', 'B1 Intermediate - Room 203', 'Planning', 'C1 Advanced - Room 305'],
  },
  {
    day: 'Tuesday',
    slots: ['A1 Beginners - Room 101', 'Office Hour', 'B1 Intermediate - Room 203', 'C1 Advanced - Room 305'],
  },
  {
    day: 'Wednesday',
    slots: ['B1 Intermediate - Room 203', 'A1 Beginners - Room 101', 'Planning', 'C1 Advanced - Room 305'],
  },
  {
    day: 'Thursday',
    slots: ['A1 Beginners - Room 101', 'B1 Intermediate - Room 203', 'Office Hour', 'C1 Advanced - Room 305'],
  },
  {
    day: 'Friday',
    slots: ['B1 Intermediate - Room 203', 'A1 Beginners - Room 101', 'Planning', 'Assessment Review'],
  },
];

const timeLabels = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];

const Teacher_Timetables = () => {
  return (
    <div className="teacher-timetables page-container">
      <section className="glass-panel timetable-panel">
        <h1>Teacher Timetable</h1>
        <p>Weekly class schedule (read-only mockup).</p>

        <div className="timetable-table-wrapper">
          <table className="timetable-table" aria-label="Teacher weekly timetable">
            <thead>
              <tr>
                <th>Day</th>
                {timeLabels.map((time) => (
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
        </div>
      </section>
    </div>
  );
};

export default Teacher_Timetables;
