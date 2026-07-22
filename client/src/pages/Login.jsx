import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, user, logout } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Student');
  const [regEnglishLevel, setRegEnglishLevel] = useState('A1');

  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const togglePanel = () => {
    setIsRegistering(!isRegistering);
    setLocalError('');
    setLocalSuccess('');
  };

  const handleRedirect = (role) => {
    if (role === 'Admin') navigate('/administration');
    else if (role === 'Teacher') navigate('/teachers');
    else navigate('/students');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    setSubmitting(true);

    try {
      const loggedUser = await login(loginEmail, loginPassword);
      setLocalSuccess(`Welcome back, ${loggedUser.name}!`);
      setTimeout(() => handleRedirect(loggedUser.role), 800);
    } catch (err) {
      setLocalError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    setSubmitting(true);

    try {
      const newUser = await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        englishLevel: regEnglishLevel,
      });

      setLocalSuccess(`Account created successfully! Welcome, ${newUser.name}.`);
      setTimeout(() => handleRedirect(newUser.role), 1000);
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return (
      <div className="login-page-container active" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '450px', textAlign: 'center' }}>
          <h2>You are logged in</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Logged in as <strong>{user.name}</strong> ({user.email}) — Role: <strong>{user.role}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => handleRedirect(user.role)}>
              Go to Dashboard
            </button>
            <button className="btn btn-outline" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`login-page-container ${isRegistering ? 'active' : ''}`}>
      {/* Login Box */}
      <div className="form-box login-box glass-panel">
        <form onSubmit={handleLoginSubmit}>
          <h1>Log In</h1>
          {localError && !isRegistering && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{localError}</p>}
          {localSuccess && !isRegistering && <p style={{ color: '#10b981', fontSize: '0.9rem' }}>{localSuccess}</p>}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            <strong>Demo Credentials:</strong><br />
            Admin: <code>admin@florence.edu</code> / <code>Admin123!</code><br />
            Teacher: <code>marta@florence.edu</code> / <code>Teacher123!</code><br />
            Student: <code>ana.r@florence.edu</code> / <code>Student123!</code>
          </p>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ marginTop: '1rem', width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>

      {/* Register Box */}
      <div className="form-box register-box glass-panel">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Register</h1>
          {localError && isRegistering && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{localError}</p>}
          {localSuccess && isRegistering && <p style={{ color: '#10b981', fontSize: '0.9rem' }}>{localSuccess}</p>}

          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password (min 8 chars)"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="input-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem' }}>Role:</label>
            <select
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <option value="Student" style={{ color: '#000' }}>Student</option>
              <option value="Teacher" style={{ color: '#000' }}>Teacher</option>
              <option value="Admin" style={{ color: '#000' }}>Admin</option>
            </select>
          </div>

          {regRole === 'Student' && (
            <div className="input-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem' }}>Level:</label>
              <select
                value={regEnglishLevel}
                onChange={(e) => setRegEnglishLevel(e.target.value)}
                style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <option value="A1" style={{ color: '#000' }}>A1</option>
                <option value="A2" style={{ color: '#000' }}>A2</option>
                <option value="B1" style={{ color: '#000' }}>B1</option>
                <option value="B2" style={{ color: '#000' }}>B2</option>
                <option value="C1" style={{ color: '#000' }}>C1</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ marginTop: '1rem', width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {/* Toggle Sliding Panels */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left glass-panel">
          <h1>Welcome Back!</h1>
          <p>Already have an account? Log in to access your dashboard.</p>
          <button className="btn btn-outline" onClick={togglePanel}>
            Go to Log In
          </button>
        </div>
        <div className="toggle-panel toggle-right glass-panel">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account? Register now to join Florence Web.</p>
          <button className="btn btn-outline" onClick={togglePanel}>
            Go to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
