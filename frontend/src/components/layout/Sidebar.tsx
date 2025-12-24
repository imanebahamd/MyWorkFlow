import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  Folder,
  Person,
  HouseDoor
} from 'react-bootstrap-icons';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <HouseDoor />, label: 'Dashboard', desc: 'Overview & stats' },
    { path: '/projects', icon: <Folder />, label: 'Projects', desc: 'Manage your projects' },
    { path: '/profile', icon: <Person />, label: 'Profile', desc: 'Personal settings' }
  ];

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h6>Navigation</h6>
      </div>

      {/* Cards Navigation */}
      <div className="sidebar-cards">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Nav.Link
              as={Link}
              to={item.path}
              key={item.path}
              className={`sidebar-card ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-card-icon">
                {item.icon}
              </div>

              <div className="sidebar-card-content">
                <span className="sidebar-card-title">{item.label}</span>
                <span className="sidebar-card-desc">{item.desc}</span>
              </div>
            </Nav.Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
