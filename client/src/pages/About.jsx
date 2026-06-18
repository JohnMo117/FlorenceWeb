import React from 'react';

const About = () => {
  return (
    <div className="page-container glass-panel">
      <h1>About Florence Web</h1>
      <div style={{ marginTop: '2rem' }}>
        <p>
          Florence Web is dedicated to revolutionizing the educational experience by providing a seamless, 
          interactive platform for teachers and students.
        </p>
        <p>
          Our mission is to empower educators with powerful tools while giving students an engaging environment 
          to learn and collaborate.
        </p>
      </div>
      
      <div className="team-section" style={{ marginTop: '4rem' }}>
        <h2>Our Values</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <div className="glass-panel" style={{ flex: '1 1 250px' }}>
            <h4 style={{ color: 'var(--accent-primary)' }}>Innovation</h4>
            <p>Constantly pushing the boundaries of ed-tech.</p>
          </div>
          <div className="glass-panel" style={{ flex: '1 1 250px' }}>
            <h4 style={{ color: '#a78bfa' }}>Accessibility</h4>
            <p>Making quality education available to everyone.</p>
          </div>
          <div className="glass-panel" style={{ flex: '1 1 250px' }}>
            <h4 style={{ color: '#34d399' }}>Community</h4>
            <p>Fostering strong relationships between educators and learners.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
