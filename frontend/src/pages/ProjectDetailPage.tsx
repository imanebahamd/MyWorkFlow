import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge} from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  
  
  Pencil,
  
  Plus,
 

  ArrowRight,
  
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import ProgressBar from '../components/projects/ProgressBar';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
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

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return formatDate(dateString);
    } catch (error) {
      return formatDate(dateString);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectById(parseInt(id));
      fetchTasks({});
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

  const handleRefresh = async () => {
    try {
      if (id) {
        await fetchProjectById(parseInt(id));
        await fetchTasks({});
        toast.success('Project refreshed!');
      }
    } catch {
      toast.error('Failed to refresh project');
    }
  };

  if (loading && !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Loader fullScreen message="Loading project details..." />
        </Container>
      </MainLayout>
    );
  }

  if (error || !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Alert variant="danger" className="glass-effect">
            <div className="fw-bold mb-2 d-flex align-items-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Project not found
            </div>
            <p className="text-muted">{error || 'The project you are looking for does not exist.'}</p>
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
                className="btn btn-primary modern-btn"
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
    if (percentage === 0) return 'Not Started';
    if (percentage < 100) return 'In Progress';
    return 'Completed';
  };

  const completedTasks = projectDetail.completedTasks || 0;
  const totalTasks = projectDetail.totalTasks || 0;
  const remainingTasks = totalTasks - completedTasks;

  return (
    <MainLayout>
      <Container fluid className="py-4 px-lg-4">
        {/* HEADER SECTION */}
        <div className="mb-4">
         
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h1 className="fw-bold mb-2">{projectDetail.title}</h1>
              <p className="text-muted mb-0">
                Last updated {formatRelativeTime(projectDetail.updatedAt)}
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                onClick={handleRefresh}
                className="btn btn-outline-primary"
              >
                Refresh
              </button>
              <Link 
                to={`/projects/${id}/edit`} 
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                <Pencil size={16} />
                Edit
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary d-flex align-items-center gap-2"
              >
                <Plus size={16} />
                Add Task
              </button>
             
            </div>
          </div>
        </div>

        {/* STATISTICS OVERVIEW */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <div className="glass-effect p-4 rounded-3 text-center">
              <small className="text-muted d-block mb-2">Progress</small>
              <h2 className="fw-bold mb-0">{projectDetail.progressPercentage}%</h2>
            </div>
          </Col>
          <Col md={3}>
            <div className="glass-effect p-4 rounded-3 text-center">
              <small className="text-muted d-block mb-2">Completed</small>
              <h2 className="fw-bold mb-0">{completedTasks}</h2>
            </div>
          </Col>
          <Col md={3}>
            <div className="glass-effect p-4 rounded-3 text-center">
              <small className="text-muted d-block mb-2">Remaining</small>
              <h2 className="fw-bold mb-0">{remainingTasks}</h2>
            </div>
          </Col>
          <Col md={3}>
            <div className="glass-effect p-4 rounded-3 text-center">
              <small className="text-muted d-block mb-2">Status</small>
              <Badge 
                bg={`${getStatusColor(projectDetail.progressPercentage)}`}
                className="px-3 py-2"
              >
                {getStatusText(projectDetail.progressPercentage)}
              </Badge>
            </div>
          </Col>
        </Row>

        {/* MAIN CONTENT */}
        <Row className="mb-4">
          {/* Project Information */}
          <Col lg={8}>
            {/* Progress Section */}
            <div className="glass-effect p-4 rounded-3 mb-4">
              <h5 className="fw-bold mb-3">Project Progress</h5>
              <ProgressBar 
                progress={projectDetail.progressPercentage}
                showLabel={true}
                height={12}
                className="mb-3"
              />
              <div className="d-flex justify-content-between text-muted small">
                <span>{completedTasks} of {totalTasks} tasks completed</span>
                <span>{projectDetail.progressPercentage}%</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="glass-effect p-4 rounded-3 mb-4">
              <h5 className="fw-bold mb-3">Description</h5>
              {projectDetail.description ? (
                <p className="text-muted mb-0">{projectDetail.description}</p>
              ) : (
                <p className="text-muted mb-0 fst-italic">No description provided for this project.</p>
              )}
            </div>

            {/* Tasks Section */}
            <div className="glass-effect p-4 rounded-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Tasks</h5>
                <Link 
                  to={`/projects/${id}/tasks`}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                >
                  View All
                  <ArrowRight size={14} />
                </Link>
              </div>

              {tasksLoading ? (
                <div className="text-center py-5">
                  <Loader message="Loading tasks..." />
                </div>
              ) : tasksError ? (
                <Alert variant="warning">
                  <div className="fw-bold mb-2">Unable to load tasks</div>
                  <p className="text-muted mb-0">{tasksError}</p>
                </Alert>
              ) : tasks.length === 0 ? (
                <div className="text-center py-5">
                  <h6 className="fw-bold mb-2">No tasks yet</h6>
                  <p className="text-muted mb-4">Add tasks to track your project progress</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary d-flex align-items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    Create First Task
                  </button>
                </div>
              ) : (
                <>
                  <TaskList
                    tasks={tasks.slice(0, 5)}
                    onToggleStatus={handleToggleStatus}
                    onEditTask={openEditModal}
                    onDeleteTask={handleDeleteTask}
                    viewMode="compact"
                    loading={tasksLoading}
                  />
                  {tasks.length > 5 && (
                    <div className="text-center mt-4 pt-3 border-top">
                      <Link 
                        to={`/projects/${id}/tasks`}
                        className="btn btn-outline-primary d-flex align-items-center gap-2 mx-auto"
                      >
                        View All {tasks.length} Tasks
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Project Details */}
            <div className="glass-effect p-4 rounded-3 mb-4">
              <h5 className="fw-bold mb-4">Project Details</h5>
              
              <div className="d-flex flex-column gap-3">
                <div>
                  <small className="text-muted d-block mb-1">Created</small>
                  <span className="fw-medium">{formatDate(projectDetail.createdAt)}</span>
                </div>
                
                <div>
                  <small className="text-muted d-block mb-1">Last Updated</small>
                  <span className="fw-medium">{formatRelativeTime(projectDetail.updatedAt)}</span>
                </div>
                
                <div>
                  <small className="text-muted d-block mb-1">Owner</small>
                  <span className="fw-medium">
                    {projectDetail.owner?.firstName || 'Unknown'} {projectDetail.owner?.lastName || ''}
                  </span>
                </div>
                
                <div>
                  <small className="text-muted d-block mb-1">Total Tasks</small>
                  <span className="fw-medium">{totalTasks}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-effect p-4 rounded-3">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              
              <div className="d-grid gap-2">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                >
                  <Plus size={16} />
                  Add New Task
                </button>
                <Link 
                  to={`/projects/${id}/tasks`} 
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                >
                  View All Tasks
                  <ArrowRight size={16} />
                </Link>
                <Link 
                  to="/projects" 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Projects
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* MODALS */}
        <TaskForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateTask}
          loading={tasksLoading}
          projectId={projectId}
        />

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

        {/* DELETE CONFIRMATION MODAL */}
        {confirmDelete && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Delete Project</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setConfirmDelete(false)}
                  ></button>
                </div>
                <div className="modal-body py-4">
                  <h6 className="fw-bold mb-3">Are you sure?</h6>
                  <p className="text-muted mb-2">
                    You are about to delete <strong>{projectDetail.title}</strong>. This action cannot be undone.
                  </p>
                  <p className="text-danger small mb-0">
                    All tasks associated with this project will also be deleted.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                  >
                    Delete Project
                  </button>
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