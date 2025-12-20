import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Person,
  ThreeDots,
  Pencil,
  Trash
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import ProgressBar from '../components/projects/ProgressBar';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Dropdown from '../components/common/Dropdown';
import { useProjects } from '../hooks/useProjects';
import { formatDate } from '../utils/formatters';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    projectDetail,
    loading,
    error,
    fetchProjectById,
    deleteProject,
  } = useProjects();

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectById(parseInt(id));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteProject(parseInt(id));
      toast.success('Project deleted successfully!');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setConfirmDelete(false);
    }
  };

  if (loading && !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Loader fullScreen />
        </Container>
      </MainLayout>
    );
  }

  if (error || !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Alert variant="danger" title="Project not found">
            <p>{error || 'The project you are looking for does not exist.'}</p>
            <div className="d-flex gap-2 mt-3">
              <Link 
                to="/projects" 
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                <ArrowLeft />
                Back to Projects
              </Link>
              <Link 
                to="/projects" 
                className="btn btn-primary"
              >
                View All Projects
              </Link>
            </div>
          </Alert>
        </Container>
      </MainLayout>
    );
  }

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
    <MainLayout>
      <Container className="py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
  <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/dashboard' }}>
    Dashboard
  </Breadcrumb.Item>
  <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/projects' }}>
    Projects
  </Breadcrumb.Item>
  <Breadcrumb.Item active>
    {projectDetail.title}
  </Breadcrumb.Item>
</Breadcrumb>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h1 className="h2 mb-0">{projectDetail.title}</h1>
              <Badge bg={getStatusColor(projectDetail.progressPercentage)}>
                {getStatusText(projectDetail.progressPercentage)}
              </Badge>
            </div>
            <p className="text-muted mb-0">{projectDetail.description}</p>
          </div>
          
          <div className="d-flex gap-2">
            <Link 
              to={`/projects/${id}/edit`} 
              className="btn btn-outline-primary d-flex align-items-center gap-2"
            >
              <Pencil />
              Edit
            </Link>
            <Dropdown>
              <Dropdown.Toggle variant="light" className="border-0">
                <ThreeDots />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/projects/${id}/tasks`}>
                  View Tasks
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={`/projects/${id}/settings`}>
                  Project Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={() => setConfirmDelete(true)}
                  className="text-danger"
                >
                  <Trash className="me-2" />
                  Delete Project
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Project Info */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Project Progress</h5>
              </Card.Header>
              <Card.Body>
                <ProgressBar 
                  progress={projectDetail.progressPercentage}
                  showLabel
                  height={10}
                  className="mb-3"
                />
                <div className="d-flex justify-content-between">
                  <div className="text-center">
                    <h4 className="mb-0">{projectDetail.totalTasks}</h4>
                    <small className="text-muted">Total Tasks</small>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-0">{projectDetail.completedTasks}</h4>
                    <small className="text-muted">Completed</small>
                  </div>
                  <div className="text-center">
                    <h4 className="mb-0">{projectDetail.totalTasks - projectDetail.completedTasks}</h4>
                    <small className="text-muted">Remaining</small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Description</h5>
              </Card.Header>
              <Card.Body>
                {projectDetail.description ? (
                  <p className="mb-0">{projectDetail.description}</p>
                ) : (
                  <p className="text-muted mb-0">No description provided.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Project Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted d-block">Created</small>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={14} className="text-muted" />
                    <span>{formatDate(projectDetail.createdAt)}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Last Updated</small>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={14} className="text-muted" />
                    <span>{formatDate(projectDetail.updatedAt)}</span>
                  </div>
                </div>
                
                <div>
                  <small className="text-muted d-block">Project Owner</small>
                  <div className="d-flex align-items-center gap-2">
                    <Person size={14} className="text-muted" />
                    <span>
                      {projectDetail.owner.firstName} {projectDetail.owner.lastName}
                    </span>
                  </div>
                  <small className="text-muted">{projectDetail.owner.email}</small>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Link to={`/projects/${id}/tasks/new`} className="btn btn-primary">
                    Add New Task
                  </Link>
                  <Link to={`/projects/${id}/tasks`} className="btn btn-outline-primary">
                    View All Tasks
                  </Link>
                  <Link to={`/projects/${id}/edit`} className="btn btn-outline-secondary">
                    Edit Project
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Project Tasks</h5>
          </Card.Header>
          <Card.Body className="text-center py-5">
            <h4 className="mb-3">Tasks Management Coming Soon</h4>
            <p className="text-muted mb-4">
              The tasks management feature is currently being developed. You'll be able to:
            </p>
            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: '60px', height: '60px' }}>
                    <span className="h4 mb-0">1</span>
                  </div>
                  <h6>Create Tasks</h6>
                  <small className="text-muted">Add new tasks with due dates</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: '60px', height: '60px' }}>
                    <span className="h4 mb-0">2</span>
                  </div>
                  <h6>Track Progress</h6>
                  <small className="text-muted">Mark tasks as completed</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-3">
                  <div className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: '60px', height: '60px' }}>
                    <span className="h4 mb-0">3</span>
                  </div>
                  <h6>Filter & Search</h6>
                  <small className="text-muted">Find tasks easily</small>
                </div>
              </Col>
            </Row>
            <Link to="/projects" className="btn btn-outline-primary mt-3 d-flex align-items-center justify-content-center gap-2 mx-auto" style={{ width: 'fit-content' }}>
              <ArrowLeft />
              Back to Projects
            </Link>
          </Card.Body>
        </Card>

        {confirmDelete && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Project</h5>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete <strong>{projectDetail.title}</strong>?
                  </p>
                  <p className="text-danger small">
                    This action cannot be undone. All tasks associated with this project will also be deleted.
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <button className="btn btn-danger" onClick={handleDelete}>Delete Project</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default ProjectDetailPage;
