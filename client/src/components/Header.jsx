import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, GraduationCap, Network, Info, LogIn } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/teachers', label: 'Teachers', icon: GraduationCap },
    { path: '/florenceConnect', label: 'Florence Connect', icon: Network },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="main-header glass-panel">
      <div className="header-brand">
        <img src="/media/florenceLogo.jpg" alt="Florence Web Logo" className="logo-image" />
        <Link to="/">
          <h1>Florence Web</h1>
        </Link>
      </div>
      
      <nav className="header-nav">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="header-actions">
        <Link to="/login" className="btn btn-primary login-btn">
          <LogIn size={18} className="mr-2" style={{marginRight: '8px'}} />
          Log In
        </Link>
      </div>
    </header>
  );
};

export default Header;
