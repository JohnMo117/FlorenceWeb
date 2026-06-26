import React from 'react';
import './AdminRegistration.css';

const registrations = [
  { name: 'Laura Perez', role: 'Student', status: 'Pending documents' },
  { name: 'Miguel Ortega', role: 'Teacher', status: 'Profile review' },
  { name: 'Sofia Herrera', role: 'Student', status: 'Payment check' },
  { name: 'Carlos Vega', role: 'Teacher', status: 'Contract draft' },
];

const englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1'];

const AdminRegistration = () => {
  return (
    <div className="section-dashboard">
      <section className="glass-panel section-hero">
        <span className="eyebrow">Registration</span>
        <h1>Student and teacher onboarding</h1>
        <p>Simple mockup for registration management with no working actions.</p>
      </section>

      <section className="glass-panel registration-form-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">New entry</span>
            <h2>Registration form</h2>
          </div>
        </div>

        <form className="registration-form" aria-label="Registration form mockup">
          <div className="form-field form-field-slider">
            <label htmlFor="registration-type">Register as</label>
            <div className="switch-shell" role="group" aria-label="Whether to register student or teacher">
              <button type="button" className="switch-option is-active" aria-pressed="true">
                Student
              </button>
              <button type="button" className="switch-option" aria-pressed="false">
                Teacher
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="registration-name">Name</label>
              <input id="registration-name" type="text" placeholder="Enter full name" disabled />
            </div>

            <div className="form-field">
              <label htmlFor="registration-curp">CURP</label>
              <input id="registration-curp" type="text" placeholder="Enter CURP" disabled />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="registration-address">Address</label>
              <textarea id="registration-address" rows="3" placeholder="Enter address" disabled />
            </div>

            <div className="form-field">
              <label htmlFor="registration-english-level">Current English level</label>
              <select id="registration-english-level" defaultValue="" disabled>
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
        </form>
      </section>

      <section className="glass-panel registration-panel">
        <div className="panel-heading panel-heading-tight">
          <div>
            <span className="eyebrow">Overview</span>
            <h2>Pending registrations</h2>
          </div>
          <p>Read-only queue of current onboarding cases.</p>
        </div>

        <div className="registration-list">
          {registrations.map((entry) => (
            <div key={entry.name} className="registration-card">
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