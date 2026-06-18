import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const togglePanel = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className={`login-page-container ${isRegistering ? 'active' : ''}`}>
      <div className="form-box login-box glass-panel">
        <form>
          <h1>Log In</h1>
          <div className="input-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
          <button className="btn btn-primary w-100" style={{marginTop: '1rem', width: '100%'}}>Log In</button>
        </form>
      </div>

      <div className="form-box register-box glass-panel">
        <form>
          <h1>Register</h1>
          <div className="input-group">
            <input type="text" placeholder="Name" required />
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
          <button className="btn btn-primary w-100" style={{marginTop: '1rem', width: '100%'}}>Sign Up</button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left glass-panel">
          <h1>Welcome Back!</h1>
          <p>Already have an account? Log in to access your dashboard.</p>
          <button className="btn btn-outline" onClick={togglePanel}>Go to Log In</button>
        </div>
        <div className="toggle-panel toggle-right glass-panel">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account? Register now to join Florence Web.</p>
          <button className="btn btn-outline" onClick={togglePanel}>Go to Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
