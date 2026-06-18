import React from 'react';

const Teachers_Grades = () => {
  return (
    <div className="page-container glass-panel">
      <h1>Teachers Grades</h1>
      <p>Submit and check your groups' grades</p>

      
      <div className="list-container" style={{ marginTop: '3rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          <li className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>Grades</h4>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Submit grades of your students</span>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>See</button>
          </li>
          <li className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>Broadcast</h4>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Talk to whole groups with 1 click</span>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>See</button>
          </li>
          <li className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>Timetables</h4>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Consult your shcedule</span>
            </div>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>See</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Teachers_Grades;
