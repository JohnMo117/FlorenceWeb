import React from 'react';

const Students = () => {
  return (
    <div className="page-container glass-panel">
      <h1>Students Portal</h1>
      <p>Welcome to the students section. Here you can access your courses, grades, and assignments.</p>
      
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div className="glass-panel" style={{background: 'rgba(30, 41, 59, 0.4)'}}>
          <a href=''><h4>My Courses</h4></a>
          <p style={{fontSize: '2rem', color: 'var(--accent-primary)', fontWeight: 'bold'}}>4</p>
        </div>
        <div className="glass-panel" style={{background: 'rgba(30, 41, 59, 0.4)'}}>
          <h4>Upcoming Assignments</h4>
          <p style={{fontSize: '2rem', color: '#fbbf24', fontWeight: 'bold'}}>2</p>
        </div>
        <div className="glass-panel" style={{background: 'rgba(30, 41, 59, 0.4)'}}>
          <h4>Recent Grades</h4>
          <p style={{fontSize: '2rem', color: '#34d399', fontWeight: 'bold'}}>A-</p>
        </div>
      </div>
    </div>
  );
};

export default Students;
