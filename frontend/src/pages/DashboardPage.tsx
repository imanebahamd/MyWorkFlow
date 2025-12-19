import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import { Plus, Folder, CheckSquare, People } from 'react-bootstrap-icons';

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Projects', value: '12', icon: <Folder />, color: 'primary' },
    { title: 'Active Tasks', value: '24', icon: <CheckSquare />, color: 'success' },
    { title: 'Completed Tasks', value: '48', icon: <CheckSquare />, color: 'info' },
    { title: 'Team Members', value: '8', icon: <People />, color: 'warning' },
  ];

  return (
    <MainLayout>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-2">Dashboard</h1>
            <p className="text-muted mb-0">Welcome back! Here's what's happening today.</p>
          </div>
          <Button>
            <Plus className="me-2" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          {stats.map((stat, index) => (
            <Col key={index} md={3} className="mb-3">
              <Card className="border-0 shadow-sm card-hover">
                <Card.Body className="d-flex align-items-center">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center me-3`}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: `var(--${stat.color}-color)`,
                      color: 'white',
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="h2 mb-0">{stat.value}</h3>
                    <p className="text-muted mb-0">{stat.title}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Projects & Tasks */}
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Recent Projects</h5>
              </Card.Header>
              <Card.Body>
                <div className="list-group list-group-flush">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Project {i}</h6>
                          <p className="text-muted small mb-0">Last updated 2 days ago</p>
                        </div>
                        <span className="badge bg-primary">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Upcoming Tasks</h5>
              </Card.Header>
              <Card.Body>
                <div className="list-group list-group-flush">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex align-items-center">
                        <input 
                          type="checkbox" 
                          className="form-check-input me-3" 
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <div>
                          <h6 className="mb-1">Task {i}</h6>
                          <p className="text-muted small mb-0">Due tomorrow</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Links */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <h4 className="mb-3">Get Started</h4>
            <p className="text-muted mb-4">
              Create your first project or explore the features
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="primary">
                <Plus className="me-2" />
                New Project
              </Button>
              <Button variant="outline-primary">
                View Documentation
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;