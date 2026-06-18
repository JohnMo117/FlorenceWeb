import React from 'react';

const Home = () => {
  return (
    <div className="page-container glass-panel">
      <div className="hero-section">
        <h1>Welcome to Florence Web!</h1>
        <p className="hero-subtitle">
          In this web platform, teachers and students will be able to connect, learn, and grow together.
        </p>
        <div className="hero-actions" style={{marginTop: '2rem'}}>
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-outline" style={{marginLeft: '1rem'}}>Learn More</button>
        </div>
      </div>
      
      <div className="features-grid" style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '4rem'
      }}>
        <div className="glass-panel feature-card">
          <h3>Interactive Learning</h3>
          <p>Engage with materials and peers in real-time.</p>
        </div>
        <div className="glass-panel feature-card">
          <h3>Seamless Communication</h3>
          <p>Direct channels between students and teachers.</p>
        </div>
        <div className="glass-panel feature-card">
          <h3>Resource Library</h3>
          <p>Access all your materials in one secure place.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
