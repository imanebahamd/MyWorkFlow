import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PersonCircle, 
  BoxArrowRight,
  Gear,
  Bell 
} from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../users/UserAvatar';
import { formatName } from '../../utils/formatters';

const CustomNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(3); // Example notification count

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="fw-bold text-primary">
          <span className="d-none d-md-inline">MyWorkFlow</span>
          <span className="d-md-none">MW</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
            <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            {/* Notifications */}
            <Dropdown className="me-3">
              <Dropdown.Toggle 
                variant="light" 
                size="sm" 
                className="position-relative border-0"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {notifications}
                    <span className="visually-hidden">unread notifications</span>
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Item>Task "Design Review" is due tomorrow</Dropdown.Item>
                <Dropdown.Item>New project assigned to you</Dropdown.Item>
                <Dropdown.Item>3 tasks completed this week</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/notifications">
                  View all notifications
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile Dropdown */}
            {user && (
              <Dropdown>
                <Dropdown.Toggle 
                  variant="light" 
                  className="d-flex align-items-center gap-2 border-0"
                >
                  <UserAvatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    profileImageUrl={user.profileImageUrl}
                    size="sm"
                  />
                  <span className="d-none d-md-inline">
                    {formatName(user.firstName, user.lastName)}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Header>
                    Signed in as<br />
                    <strong>{user.email}</strong>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <PersonCircle className="me-2" />
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">
                    <Gear className="me-2" />
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <BoxArrowRight className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;