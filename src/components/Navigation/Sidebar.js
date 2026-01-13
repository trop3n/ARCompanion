import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Event Timers', icon: '⏱️' },
    { path: '/items', label: 'Items', icon: '📦' },
    { path: '/needed-items', label: 'Needed Items', icon: '📋' }
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Arc Raiders</h2>
      </div>
      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
