import React, { useState, useEffect } from 'react';
import './AdminRegistration.css';

const englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1'];

const AdminRegistration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerAs, setRegisterAs] = useState('Student');
  const [formData, setFormData] = useState({
    name: '',
    curp: '',
    address: '',
    englishLevel: '',
  });

  // Fetch registrations from the API
  useEffect(() => {
    fetch('/api/admin/registrations')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load registrations');
        return res.json();
      })
      .then((data) => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) return;

    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          role: registerAs,
          curp: formData.curp.trim(),
          address: formData.address.trim(),
          englishLevel: formData.englishLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create registration');
      }

      const newRegistration = await response.json();
      setRegistrations((prev) => [...prev, newRegistration]);
      setFormData({ name: '', curp: '', address: '', englishLevel: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Registration</span>
        <h1>Student and teacher onboarding</h1>
        <p>Register new students and teachers, and track pending enrollments.</p>
      </section>

      <section className="glass-panel registration-form-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">New entry</span>
            <h2>Registration form</h2>
          </div>
        </div>

        <form className="registration-form" aria-label="Registration form" onSubmit={handleSubmit}>
          <div className="form-field form-field-slider">
            <label htmlFor="registration-type">Register as</label>
            <div className="switch-shell" role="group" aria-label="Whether to register student or teacher">
              <button
                type="button"
                className={`switch-option ${registerAs === 'Student' ? 'is-active' : ''}`}
                aria-pressed={registerAs === 'Student'}
                onClick={() => setRegisterAs('Student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`switch-option ${registerAs === 'Teacher' ? 'is-active' : ''}`}
                aria-pressed={registerAs === 'Teacher'}
                onClick={() => setRegisterAs('Teacher')}
              >
                Teacher
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="registration-name">Name</label>
              <input
                id="registration-name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="registration-curp">CURP</label>
              <input
                id="registration-curp"
                type="text"
                placeholder="Enter CURP"
                maxLength={18}
                value={formData.curp}
                onChange={(e) => setFormData((prev) => ({ ...prev, curp: e.target.value }))}
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="registration-address">Address</label>
              <textarea
                id="registration-address"
                rows="3"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label htmlFor="registration-english-level">Current English level</label>
              <select
                id="registration-english-level"
                value={formData.englishLevel}
                onChange={(e) => setFormData((prev) => ({ ...prev, englishLevel: e.target.value }))}
              >
                <option value="" disabled>
                  Select level
                </option>
                {englishLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Submit registration
          </button>
        </form>
      </section>

      <section className="glass-panel registration-panel">
        <div className="panel-heading panel-heading-tight">
          <div>
            <span className="eyebrow">Overview</span>
            <h2>Pending registrations</h2>
          </div>
          <p>Current onboarding cases from the server.</p>
        </div>

        {loading && <p style={{ padding: '1rem' }}>Loading registrations...</p>}
        {error && <p style={{ padding: '1rem', color: '#ef4444' }}>Error: {error}</p>}

        <div className="registration-list">
          {registrations.map((entry) => (
            <div key={entry.id} className="registration-card">
              <strong>{entry.name}</strong>
              <span>{entry.role}</span>
              <small>{entry.status}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminRegistration;