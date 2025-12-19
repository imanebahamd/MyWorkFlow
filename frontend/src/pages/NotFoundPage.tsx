import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HouseDoor, ArrowLeft } from 'react-bootstrap-icons';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container className="text-center">
        <div className="mb-4">
          <h1 className="display-1 fw-bold text-primary">404</h1>
          <h2 className="h3 mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
        </div>
        
        <div className="d-flex justify-content-center gap-3">
          <Link to="/">
  <Button variant="outline-primary">
    <ArrowLeft className="me-2" />
    Go Back
  </Button>
</Link>
<Link to="/dashboard">
  <Button variant="primary">
    <HouseDoor className="me-2" />
    Go to Dashboard
  </Button>
</Link>

        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;