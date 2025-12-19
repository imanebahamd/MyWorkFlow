import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { 
  Person, 
  Calendar, 
  Envelope,
  ShieldCheck 
} from 'react-bootstrap-icons';

const UserInfoCard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <h6 className="mb-0 d-flex align-items-center gap-2">
          <ShieldCheck className="text-primary" />
          Account Information
        </h6>
      </Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex align-items-center gap-3">
          <Person className="text-muted" />
          <div>
            <small className="text-muted d-block">Full Name</small>
            <span className="fw-medium">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </ListGroup.Item>
        
        <ListGroup.Item className="d-flex align-items-center gap-3">
          <Envelope className="text-muted" />
          <div>
            <small className="text-muted d-block">Email Address</small>
            <span className="fw-medium">{user.email}</span>
          </div>
        </ListGroup.Item>
        
        <ListGroup.Item className="d-flex align-items-center gap-3">
          <Calendar className="text-muted" />
          <div>
            <small className="text-muted d-block">Member Since</small>
            <span className="fw-medium">
              {formatDate(user.createdAt ?? new Date().toISOString())}
            </span>
          </div>
        </ListGroup.Item>
        
        <ListGroup.Item className="d-flex align-items-center gap-3">
          <Calendar className="text-muted" />
          <div>
            <small className="text-muted d-block">Last Updated</small>
            <span className="fw-medium">
              {formatDate(user.updatedAt ?? new Date().toISOString())}
            </span>
          </div>
        </ListGroup.Item>
      </ListGroup>
      
      <Card.Footer className="bg-white text-center">
        <small className="text-muted">
          Account ID: <code>{user.id}</code>
        </small>
      </Card.Footer>
    </Card>
  );
};

export default UserInfoCard;