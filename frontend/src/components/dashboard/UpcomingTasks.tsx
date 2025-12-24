import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Calendar, ExclamationTriangle } from 'react-bootstrap-icons';
import type { Task } from '../../types/task.types';
import { formatDueDate, isDateToday, isDateTomorrow } from '../../utils/dateUtils';

interface UpcomingTasksProps {
  tasks: Task[];
  loading?: boolean;
  title?: string;
  showOverdue?: boolean;
}

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ 
  tasks, 
  loading = false,
  title = 'Upcoming Tasks',
  showOverdue = true
}) => {
  const getDueDateBadge = (dueDate?: string) => {
    if (!dueDate) return null;
    
    if (isDateToday(dueDate)) {
      return <Badge bg="warning" className="ms-2">Today</Badge>;
    }
    if (isDateTomorrow(dueDate)) {
      return <Badge bg="info" className="ms-2">Tomorrow</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm h-100">
        <Card.Header className="bg-white">
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
        <Card.Body>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="d-flex align-items-center mb-3">
              <div className="placeholder-glow flex-shrink-0 me-3">
                <div className="placeholder" style={{ width: '20px', height: '20px' }}></div>
              </div>
              <div className="flex-grow-1 placeholder-glow">
                <div className="placeholder col-8 mb-1"></div>
                <div className="placeholder col-6"></div>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-0 shadow-sm h-100">
        <Card.Header className="bg-white">
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <Calendar size={48} className="text-muted mb-3" />
          <h5>No {showOverdue ? 'upcoming or overdue' : 'upcoming'} tasks</h5>
          <p className="text-muted">
            {showOverdue 
              ? 'You\'re all caught up!' 
              : 'No tasks due in the near future'}
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <Badge bg="primary" pill>
          {tasks.length}
        </Badge>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {tasks.map((task) => (
            <ListGroup.Item 
              key={task.id}
              className="border-0 px-4 py-3 hover-bg-light"
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <Link 
                      to={`/tasks/${task.id}`}
                      className="text-decoration-none text-dark fw-medium"
                    >
                      {task.title}
                    </Link>
                    {getDueDateBadge(task.dueDate)}
                    {task.overdue && showOverdue && (
                      <Badge bg="danger" className="ms-2">
                        <ExclamationTriangle size={10} className="me-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted small mb-1">
                    In{' '}
                    <Link 
                      to={`/projects/${task.projectId}`}
                      className="text-decoration-none"
                    >
                      {task.projectTitle}
                    </Link>
                  </p>
                </div>
                <div className="text-end">
                  <div className="d-flex align-items-center gap-1 text-muted small">
                    <Calendar size={12} />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                  <Badge bg={task.overdue ? 'danger' : 'secondary'} className="text-capitalize mt-1">
                    {task.status.replace('_', ' ').toLowerCase()}
                  </Badge>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer className="bg-white text-center">
        <Link to="/tasks" className="text-decoration-none">
          View All Tasks
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default UpcomingTasks;