import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  Folder,
  CheckSquare,
  BarChart,
  Person,
  Gear,
  HouseDoor
} from 'react-bootstrap-icons';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <HouseDoor />, label: 'Dashboard' },
    { path: '/projects', icon: <Folder />, label: 'Projects' },
    { path: '/tasks', icon: <CheckSquare />, label: 'Tasks' },
    { path: '/reports', icon: <BarChart />, label: 'Reports' },
    { path: '/profile', icon: <Person />, label: 'Profile' },
    { path: '/settings', icon: <Gear />, label: 'Settings' },
  ];

  return (
    <div className="sidebar bg-white border-end shadow-sm" style={{ width: '250px' }}>
      <div className="p-3 border-bottom">
        <h6 className="mb-0 text-muted">NAVIGATION</h6>
      </div>
      <Nav className="flex-column p-3">
        {navItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center gap-3 py-2 px-3 mb-1 rounded ${
              location.pathname === item.path 
                ? 'bg-primary text-white' 
                : 'text-dark hover-bg-light'
            }`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>
      
      <div className="p-3 mt-auto border-top">
        <div className="text-center">
          <small className="text-muted">
            MyWorkFlow v1.0.0
          </small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;