import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  CheckCircle,
  Clock,
  ExclamationTriangle,
  ListTask
} from 'react-bootstrap-icons';
import type { TaskStats as TaskStatsType } from '../../types/task.types';

interface TaskStatsProps {
  stats: TaskStatsType;
  loading?: boolean;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats, loading = false }) => {
  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <ListTask size={24} />,
      color: 'primary',
      bgColor: 'bg-primary bg-opacity-10',
      textColor: 'text-primary'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircle size={24} />,
      color: 'success',
      bgColor: 'bg-success bg-opacity-10',
      textColor: 'text-success'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Clock size={24} />,
      color: 'info',
      bgColor: 'bg-info bg-opacity-10',
      textColor: 'text-info'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: <ExclamationTriangle size={24} />,
      color: 'danger',
      bgColor: 'bg-danger bg-opacity-10',
      textColor: 'text-danger'
    }
  ];

  if (loading) {
    return (
      <Row>
        {[1, 2, 3, 4].map(i => (
          <Col key={i} xs={6} md={3} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="placeholder-glow">
                  <div className="placeholder col-6 mb-2"></div>
                  <div className="placeholder col-10"></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row>
      {statCards.map((stat, index) => (
        <Col key={index} xs={6} md={3} className="mb-3">
          <Card className="border-0 shadow-sm card-hover">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${stat.bgColor} ${stat.textColor}`}
                  style={{ width: '50px', height: '50px' }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="h2 mb-0">{stat.value}</h3>
                  <p className="text-muted mb-0">{stat.title}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TaskStats;