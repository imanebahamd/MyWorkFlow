import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Person,
  ThreeDots,
  Pencil,
  Trash,
  Plus,
  CheckSquare
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import ProgressBar from '../components/projects/ProgressBar';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import Dropdown from '../components/common/Dropdown';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { formatDate } from '../utils/formatters';
import type { Task } from '../types/task.types';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id ? parseInt(id) : 0;
  
  const {
    projectDetail,
    loading,
    error,
    fetchProjectById,
    deleteProject,
  } = useProjects();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks(projectId);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectById(parseInt(id));
      fetchTasks({}); // Pass empty filters to get all tasks
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

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask({
        ...taskData,
        projectId: projectId,
      });
      setShowCreateModal(false);
      toast.success('Task created successfully!');
      // Refresh project and tasks
      if (id) {
        fetchProjectById(parseInt(id));
        fetchTasks({});
      }
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!selectedTask) return;
    
    try {
      await updateTask(selectedTask.id, taskData);
      setShowEditModal(false);
      setSelectedTask(null);
      toast.success('Task updated successfully!');
      // Refresh project and tasks
      if (id) {
        fetchProjectById(parseInt(id));
        fetchTasks({});
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully!');
        // Refresh project and tasks
        if (id) {
          fetchProjectById(parseInt(id));
          fetchTasks({});
        }
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await toggleTaskStatus(task);
      toast.success('Task status updated!');
      // Refresh project and tasks
      if (id) {
        fetchProjectById(parseInt(id));
        fetchTasks({});
      }
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
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
          <Alert variant="danger">
            <div className="fw-bold mb-2">Project not found</div>
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
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="me-2" />
                    Add New Task
                  </button>
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

        {/* Tasks Section */}
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Project Tasks</h5>
            <Link 
              to={`/projects/${id}/tasks`}
              className="btn btn-sm btn-outline-primary"
            >
              View All Tasks
            </Link>
          </Card.Header>
          <Card.Body>
            {tasksLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading tasks...</span>
                </div>
                <p className="mt-2 text-muted">Loading tasks...</p>
              </div>
            ) : tasksError ? (
              <Alert variant="warning">
                <div className="fw-bold mb-2">Unable to load tasks</div>
                <p>{tasksError}</p>
              </Alert>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4">
                <CheckSquare size={48} className="text-muted mb-3" />
                <h5>No tasks yet</h5>
                <p className="text-muted mb-4">Add tasks to track your project progress</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="me-2" />
                  Create First Task
                </button>
              </div>
            ) : (
              <>
                <TaskList
                  tasks={tasks.slice(0, 5)} // Show only 5 tasks
                  onToggleStatus={handleToggleStatus}
                  onEditTask={openEditModal}
                  onDeleteTask={handleDeleteTask}
                  viewMode="compact"
                />
                {tasks.length > 5 && (
                  <div className="text-center mt-3">
                    <Link 
                      to={`/projects/${id}/tasks`}
                      className="btn btn-outline-primary"
                    >
                      View All {tasks.length} Tasks
                    </Link>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>

        {/* Add Task Form Modal */}
        <TaskForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          loading={tasksLoading}
          projectId={projectId}
        />

        {/* Edit Task Modal */}
        <TaskForm
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          onSubmit={handleUpdateTask}
          loading={tasksLoading}
          task={selectedTask}
        />

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