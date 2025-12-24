import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import type { Project } from '../../types/project.types';
import ProjectCard from './ProjectCard';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  error?: string | null;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: number) => void;
  emptyMessage?: string;
  columns?: number;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  loading = false,
  error = null,
  onEditProject,
  onDeleteProject,
  emptyMessage = 'No projects found',
  columns = 3,
}) => {
  const columnWidth = 12 / columns;

  if (loading) {
    return <Loader message="Loading projects..." />;
  }

  if (error) {
    return (
      <Alert variant="danger" className="pulse-animation">
        <Alert.Heading>Error loading projects</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        message={emptyMessage}
        icon="folder"
        actionText="Create your first project"
        onAction={() => window.location.href = '/projects?create=true'}
      />
    );
  }

  return (
    <Row className="custom-scrollbar">
      {projects.map((project, index) => (
        <Col 
          key={project.id} 
          xs={12} 
          sm={6} 
          lg={columnWidth} 
          className="mb-4 project-item"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProjectCard
            project={project}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProjectList;
