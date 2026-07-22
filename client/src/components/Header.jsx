import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ShieldCheck, GraduationCap, Network, Info, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/administration', label: 'Administration', icon: ShieldCheck },
    { path: '/teachers', label: 'Teachers', icon: GraduationCap },
    { path: '/florenceConnect', label: 'Florence Connect', icon: Network },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActivePath = (path) => (path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`));

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
            const isActive = isActivePath(item.path);
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
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={16} />
              <strong>{user.name}</strong> ({user.role})
            </span>
            <button className="btn btn-outline" onClick={logout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <LogOut size={16} style={{ marginRight: '4px' }} />
              Log Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary login-btn">
            <LogIn size={18} className="mr-2" style={{ marginRight: '8px' }} />
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
