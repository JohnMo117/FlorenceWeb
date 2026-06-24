import React from 'react';
import { Link } from 'react-router-dom';

const Teachers = () => {
  return (
    <div className="page-container glass-panel">
      <h1>Teachers Portal</h1>
      <p>See your grades, broadcast, and timetables!</p>

      <div className="list-container" style={{ marginTop: '3rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          <li className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link to="/teacher_grades" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h4 style={{ margin: 0 }}>Grades</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Submit grades of your students</span>
              </Link>
            </div>
            {/* <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>See</button> */}
          </li>
          <li className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link to="/teacher_broadcast" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h4 style={{ margin: 0 }}>Broadcast</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Talk to whole groups with 1 click</span>
              </Link>
            </div>
            {/* <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>See</button> */}
          </li>
          <li className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link to="/teacher_timetables" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h4 style={{ margin: 0 }}>Timetables</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Consult your schedule</span>
              </Link>
            </div>
            {/* <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>See</button> */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Teachers;
