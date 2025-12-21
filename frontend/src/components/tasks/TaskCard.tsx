import React, { useState } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  ArrowRightCircle,
  ThreeDotsVertical,
  Pencil,
  Trash
} from 'react-bootstrap-icons';
import { type Task, TaskStatus } from '../../types/task.types';
import { formatDate, isDateToday, isDateTomorrow, isDatePast } from '../../utils/dateUtils';
import Dropdown from '../common/Dropdown';

interface TaskCardProps {
  task: Task;
  onToggleStatus?: (task: Task) => Promise<void>;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleStatus, 
  onEdit, 
  onDelete,
  compact = false 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle className="text-success" size={16} />;
      case TaskStatus.IN_PROGRESS:
        return <ArrowRightCircle className="text-primary" size={16} />;
      case TaskStatus.TODO:
      default:
        return <Circle className="text-secondary" size={16} />;
    }
  };

  const getStatusColor = (status: TaskStatus, overdue: boolean) => {
    if (overdue) return 'danger';
    
    switch (status) {
      case TaskStatus.DONE:
        return 'success';
      case TaskStatus.IN_PROGRESS:
        return 'primary';
      case TaskStatus.TODO:
      default:
        return 'secondary';
    }
  };

  const getDueDateLabel = (dueDate?: string) => {
    if (!dueDate) return null;
    
    if (isDatePast(dueDate)) return 'Overdue';
    if (isDateToday(dueDate)) return 'Today';
    if (isDateTomorrow(dueDate)) return 'Tomorrow';
    return formatDate(dueDate, 'short');
  };

  const getDueDateClass = (dueDate?: string) => {
    if (!dueDate) return '';
    
    if (isDatePast(dueDate)) return 'text-danger fw-bold';
    if (isDateToday(dueDate)) return 'text-warning fw-bold';
    return 'text-muted';
  };

  const handleToggleStatus = async () => {
    if (!onToggleStatus) return;
    
    setIsUpdating(true);
    try {
      await onToggleStatus(task);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(task);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(task.id);
  };

  if (compact) {
    return (
      <Card className="border-0 border-bottom rounded-0 shadow-none">
        <Card.Body className="py-2 px-0">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                type="checkbox"
                checked={task.status === TaskStatus.DONE}
                onChange={handleToggleStatus}
                disabled={isUpdating || !onToggleStatus}
                className="me-2"
              />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`fw-medium ${task.status === TaskStatus.DONE ? 'text-decoration-line-through text-muted' : ''}`}>
                    {task.title}
                  </span>
                  <Badge bg={getStatusColor(task.status, task.overdue)} className="fs-xxsmall">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
                {task.dueDate && (
                  <small className={`d-flex align-items-center gap-1 ${getDueDateClass(task.dueDate)}`}>
                    <Clock size={12} />
                    {getDueDateLabel(task.dueDate)}
                  </small>
                )}
              </div>
            </div>
            
            {(onEdit || onDelete) && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" size="sm" className="border-0 p-1">
                  <ThreeDotsVertical size={14} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {onEdit && (
                    <Dropdown.Item onClick={handleEdit}>
                      <Pencil className="me-2" size={12} />
                      Edit
                    </Dropdown.Item>
                  )}
                  {onDelete && (
                    <Dropdown.Item onClick={handleDelete} className="text-danger">
                      <Trash className="me-2" size={12} />
                      Delete
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 card-hover">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            {getStatusIcon(task.status)}
            <h6 className="mb-0">
              <Link 
                to={`/tasks/${task.id}`} 
                className={`text-decoration-none ${task.status === TaskStatus.DONE ? 'text-decoration-line-through text-muted' : 'text-dark'}`}
              >
                {task.title}
              </Link>
            </h6>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <Badge bg={getStatusColor(task.status, task.overdue)}>
              {task.status.replace('_', ' ')}
            </Badge>
            
            {(onEdit || onDelete) && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" size="sm" className="border-0">
                  <ThreeDotsVertical size={16} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {onToggleStatus && (
                    <Dropdown.Item onClick={handleToggleStatus} disabled={isUpdating}>
                      {task.status === TaskStatus.DONE ? 'Mark as To Do' : 'Mark as Completed'}
                    </Dropdown.Item>
                  )}
                  {onEdit && (
                    <Dropdown.Item onClick={handleEdit}>
                      <Pencil className="me-2" size={14} />
                      Edit
                    </Dropdown.Item>
                  )}
                  {onDelete && (
                    <Dropdown.Item onClick={handleDelete} className="text-danger">
                      <Trash className="me-2" size={14} />
                      Delete
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-muted small mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div>
            {task.dueDate && (
              <small className={`d-flex align-items-center gap-1 ${getDueDateClass(task.dueDate)}`}>
                <Calendar size={12} />
                Due: {getDueDateLabel(task.dueDate)}
              </small>
            )}
            <small className="text-muted d-block">
              Project: {task.projectTitle}
            </small>
          </div>
          
          {onToggleStatus && (
            <Form.Check
              type="switch"
              id={`task-toggle-${task.id}`}
              label={task.status === TaskStatus.DONE ? 'Completed' : 'Mark complete'}
              checked={task.status === TaskStatus.DONE}
              onChange={handleToggleStatus}
              disabled={isUpdating}
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;