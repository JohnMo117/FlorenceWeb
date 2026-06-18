import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content glass-panel">
        <div className="footer-section">
          <h3>Florence Web</h3>
          <p>Empowering teachers and students with modern tools.</p>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect</h4>
          <p>Follow us on social media for updates.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Florence Web. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
