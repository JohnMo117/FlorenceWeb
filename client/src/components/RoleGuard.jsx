import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RoleGuard = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>You must be logged in to view this page.</p>
          <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Go to Log In
          </Link>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '550px', textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#ef4444', display: 'block', marginBottom: '0.5rem' }}>Access Denied</span>
          <h2>This is not your role</h2>
          <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>
            Right now you are logged in as a <strong>{user.role}</strong>.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            This page is restricted to: {allowedRoles.join(', ')}.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
