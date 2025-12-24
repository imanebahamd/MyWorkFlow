import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle,
  ThreeDotsVertical,
  Pencil,
  Trash
} from 'react-bootstrap-icons';
import type { Project } from '../../types/project.types';
import { formatDate } from '../../utils/formatters';
import Dropdown from '../common/Dropdown';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete 
}) => {
  const getStatusColor = (percentage: number) => {
    if (percentage === 0) return 'secondary';
    if (percentage < 50) return 'warning';
    if (percentage < 100) return 'info';
    return 'success';
  };

  const getStatusText = (percentage: number) => {
    if (percentage === 0) return 'Not started';
    if (percentage < 100) return 'In progress';
    return 'Completed';
  };

  return (
    <Card className="h-100 shadow-sm border-0 card-hover project-item glass-effect">
      <Card.Body className="d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Badge 
              bg={getStatusColor(project.progressPercentage)} 
              className="mb-2"
            >
              {getStatusText(project.progressPercentage)}
            </Badge>
            <h5 className="card-title mb-1 gradient-text">
              <Link 
                to={`/projects/${project.id}`} 
                className="text-decoration-none text-dark"
              >
                {project.title}
              </Link>
            </h5>
            {project.description && (
              <p className="card-text text-muted small mb-2 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>

          {(onEdit || onDelete) && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" size="sm" className="border-0">
                <ThreeDotsVertical size={16} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {onEdit && (
                  <Dropdown.Item onClick={() => onEdit(project)}>
                    <Pencil className="me-2" size={14} />
                    Edit
                  </Dropdown.Item>
                )}
                {onDelete && (
                  <Dropdown.Item 
                    onClick={() => onDelete(project.id)}
                    className="text-danger"
                  >
                    <Trash className="me-2" size={14} />
                    Delete
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {/* Progress */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-1">
              <CheckCircle size={14} className="text-success" />
              <small className="text-muted">
                {project.completedTasks} of {project.totalTasks} tasks
              </small>
            </div>
            <small className="fw-bold">
              {project.progressPercentage}%
            </small>
          </div>
          <ProgressBar 
            now={project.progressPercentage} 
            variant={getStatusColor(project.progressPercentage)}
            className="mb-3 rounded-pill"
            style={{ height: '8px' }}
          />
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center border-top pt-3">
          <small className="text-muted d-flex align-items-center gap-1">
            <Calendar size={12} />
            Updated {formatDate(project.updatedAt)}
          </small>
          <Link
            to={`/projects/${project.id}`}
            className="btn btn-outline-primary btn-sm modern-btn"
          >
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
