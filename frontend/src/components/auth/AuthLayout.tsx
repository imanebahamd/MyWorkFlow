import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = 'MyWorkFlow',
  description = 'Project Task Management System'
}) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary">{title}</h1>
              <p className="text-muted">{description}</p>
            </div>
            
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4 p-md-5">
                {children}
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4">
              <p className="text-muted">
                &copy; {new Date().getFullYear()} {title}. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;