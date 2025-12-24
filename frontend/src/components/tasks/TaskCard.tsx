import React, { useState } from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Clock,
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
      <div className="border-bottom py-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <Form.Check
              type="checkbox"
              checked={task.status === TaskStatus.DONE}
              onChange={handleToggleStatus}
              disabled={isUpdating || !onToggleStatus}
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <Link 
                  to={`/tasks/${task.id}`}
                  className={`text-decoration-none fw-medium ${task.status === TaskStatus.DONE ? 'text-decoration-line-through text-muted' : 'text-dark'}`}
                >
                  {task.title}
                </Link>
                <Badge bg={getStatusColor(task.status, task.overdue)}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="d-flex align-items-center gap-3">
                {task.dueDate && (
                  <small className={`d-flex align-items-center gap-1 ${getDueDateClass(task.dueDate)}`}>
                    <Clock size={12} />
                    {getDueDateLabel(task.dueDate)}
                  </small>
                )}
                <small className="text-muted">
                  {task.projectTitle}
                </small>
              </div>
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" size="sm" className="border-0">
                <ThreeDotsVertical size={16} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {onEdit && (
                  <Dropdown.Item onClick={handleEdit}>
                    <Pencil size={14} className="me-2" />
                    Edit
                  </Dropdown.Item>
                )}
                {onDelete && (
                  <Dropdown.Item onClick={handleDelete} className="text-danger">
                    <Trash size={14} className="me-2" />
                    Delete
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-100 shadow-sm border-0 card-hover">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Badge bg={getStatusColor(task.status, task.overdue)} className="mb-2">
              {task.status.replace('_', ' ')}
            </Badge>
            <h5 className="mb-1">
              <Link 
                to={`/tasks/${task.id}`} 
                className={`text-decoration-none ${task.status === TaskStatus.DONE ? 'text-decoration-line-through text-muted' : 'text-dark'}`}
              >
                {task.title}
              </Link>
            </h5>
            {task.description && (
              <p className="text-muted small mb-0 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
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
                    <Pencil size={14} className="me-2" />
                    Edit
                  </Dropdown.Item>
                )}
                {onDelete && (
                  <Dropdown.Item onClick={handleDelete} className="text-danger">
                    <Trash size={14} className="me-2" />
                    Delete
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <div>
              {task.dueDate && (
                <small className={`d-flex align-items-center gap-1 ${getDueDateClass(task.dueDate)}`}>
                  <Calendar size={12} />
                  {getDueDateLabel(task.dueDate)}
                </small>
              )}
              <small className="text-muted">
                {task.projectTitle}
              </small>
            </div>
            
            {onToggleStatus && (
              <Form.Check
                type="switch"
                id={`task-toggle-${task.id}`}
                checked={task.status === TaskStatus.DONE}
                onChange={handleToggleStatus}
                disabled={isUpdating}
              />
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;