import React from 'react';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../users/UserAvatar';
import { formatName } from '../../utils/formatters';
import NotificationBell from '../notifications/NotificationBell';

const CustomNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="clean-navbar">
      <Container fluid className="px-4 d-flex align-items-center">
        
        {/* Brand + Owl */}
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="clean-navbar-brand d-flex align-items-center gap-2"
        >
          {/* Mini Owl Mascot */}
          <div
            style={{
              width: '34px',
              height: '34px',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Head */}
              <circle cx="100" cy="90" r="55" fill="#F97316" />

              {/* Ears */}
              <path d="M 60 50 Q 50 30 70 40" fill="#EA580C" />
              <path d="M 140 50 Q 150 30 130 40" fill="#EA580C" />

              {/* Eyes */}
              <circle cx="80" cy="90" r="18" fill="#FFFFFF" />
              <circle cx="120" cy="90" r="18" fill="#FFFFFF" />

              {/* Pupils */}
              <circle cx="80" cy="90" r="8" fill="#1F2933">
                <animate
                  attributeName="cx"
                  values="80;84;80;76;80"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="120" cy="90" r="8" fill="#1F2933">
                <animate
                  attributeName="cx"
                  values="120;124;120;116;120"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Beak */}
              <path d="M 100 100 L 95 110 L 105 110 Z" fill="#FACC15" />
            </svg>
          </div>

          {/* App Name */}
          <span>MyWorkFlow</span>
        </Navbar.Brand>

        {/* Right actions */}
        <div className="navbar-actions ms-auto">
          <NotificationBell />

          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle className="clean-user-toggle">
                <UserAvatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  profileImageUrl={user.profileImageUrl}
                  size="sm"
                />
                <span className="user-name">
                  {formatName(user.firstName, user.lastName)}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="clean-dropdown-menu">
                <Dropdown.Item as={Link} to="/profile">
                  <PersonCircle className="me-2" />
                  Profile
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <BoxArrowRight className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
