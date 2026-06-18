import React from 'react';

const FlorenceConnect = () => {
  return (
    <div className="page-container glass-panel">
      <h1>Florence Connect</h1>
      <p>Your networking hub for educational collaboration.</p>
      
      <div style={{ marginTop: '3rem', textAlign: 'center', padding: '4rem 2rem' }} className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Coming Soon</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          We are building an exciting new way to connect with peers, join study groups, 
          and share resources globally. Stay tuned!
        </p>
        <button className="btn btn-primary" style={{ marginTop: '2rem' }}>Notify Me</button>
      </div>
    </div>
  );
};

export default FlorenceConnect;
