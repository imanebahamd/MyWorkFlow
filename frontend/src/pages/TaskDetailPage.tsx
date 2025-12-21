import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Breadcrumb, Button as BootstrapButton } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Pencil,
  Trash,
  CheckCircle,
  Circle,
  ArrowRightCircle
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/Alert';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types/task.types';
import { formatDate, formatDueDate, isDatePast } from '../utils/dateUtils';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    taskDetail,
    loading,
    error,
    fetchTaskById,
    updateTask,
    deleteTask,
    markAsCompleted,
  } = useTasks();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskById(parseInt(id));
    }
  }, [id]);

  const handleMarkComplete = async () => {
    if (!id || !taskDetail) return;
    
    setIsUpdating(true);
    try {
      await markAsCompleted(parseInt(id));
      toast.success('Task marked as completed!');
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteTask(parseInt(id));
        toast.success('Task deleted successfully!');
        navigate(`/projects/${taskDetail?.project.id}`);
      } catch (err) {
        toast.error('Failed to delete task');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!id || !taskDetail) return;
    
    setIsUpdating(true);
    try {
      await updateTask(parseInt(id), { status: newStatus });
      toast.success('Task status updated!');
    } catch (err) {
      toast.error('Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle className="text-success" size={20} />;
      case TaskStatus.IN_PROGRESS:
        return <ArrowRightCircle className="text-primary" size={20} />;
      case TaskStatus.TODO:
      default:
        return <Circle className="text-secondary" size={20} />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
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

  if (loading && !taskDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Loader fullScreen />
        </Container>
      </MainLayout>
    );
  }

  if (error || !taskDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <AlertMessage variant="danger" title="Task not found">
            <p>{error || 'The task you are looking for does not exist.'}</p>
            <div className="d-flex gap-2 mt-3">
              <Link 
                to="/tasks" 
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                <ArrowLeft />
                Back to Tasks
              </Link>
              <Link 
                to="/projects" 
                className="btn btn-primary"
              >
                View Projects
              </Link>
            </div>
          </AlertMessage>
        </Container>
      </MainLayout>
    );
  }

  const isOverdue = taskDetail.dueDate && isDatePast(taskDetail.dueDate);

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
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/projects/${taskDetail.project.id}` }}>
            {taskDetail.project.title}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {taskDetail.title}
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              {getStatusIcon(taskDetail.status)}
              <h1 className="h2 mb-0">{taskDetail.title}</h1>
              <Badge bg={getStatusColor(taskDetail.status)}>
                {taskDetail.status.replace('_', ' ')}
              </Badge>
              {isOverdue && (
                <Badge bg="danger">Overdue</Badge>
              )}
            </div>
            <p className="text-muted mb-0">
              In project: <Link to={`/projects/${taskDetail.project.id}`} className="text-decoration-none">
                {taskDetail.project.title}
              </Link>
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <Link 
              to={`/tasks/${id}/edit`}
              className="btn btn-outline-primary d-flex align-items-center gap-2"
            >
              <Pencil />
              Edit
            </Link>
            <BootstrapButton
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="me-2" />
                  Delete
                </>
              )}
            </BootstrapButton>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Description Card */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Description</h5>
              </Card.Header>
              <Card.Body>
                {taskDetail.description ? (
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {taskDetail.description}
                  </p>
                ) : (
                  <p className="text-muted mb-0">No description provided.</p>
                )}
              </Card.Body>
            </Card>
          </div>

          <div className="col-lg-4">
            {/* Details Card */}
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Task Details</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted d-block">Due Date</small>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={14} className="text-muted" />
                    <span className={isOverdue ? 'text-danger fw-bold' : ''}>
                      {taskDetail.dueDate ? formatDueDate(taskDetail.dueDate) : 'No due date'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Status</small>
                  <div className="d-flex gap-1 mt-1">
                    {Object.values(TaskStatus).map(status => (
                      <BootstrapButton
                        key={status}
                        variant={taskDetail.status === status ? getStatusColor(status) : 'outline-secondary'}
                        size="sm"
                        onClick={() => handleStatusChange(status)}
                        disabled={isUpdating || taskDetail.status === status}
                        className="text-capitalize"
                      >
                        {status.replace('_', ' ')}
                      </BootstrapButton>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Created</small>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={14} className="text-muted" />
                    <span>{formatDate(taskDetail.createdAt)}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted d-block">Last Updated</small>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={14} className="text-muted" />
                    <span>{formatDate(taskDetail.updatedAt)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <BootstrapButton
                    variant={taskDetail.status === TaskStatus.DONE ? 'secondary' : 'success'}
                    onClick={handleMarkComplete}
                    disabled={isUpdating || taskDetail.status === TaskStatus.DONE}
                  >
                    {isUpdating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : taskDetail.status === TaskStatus.DONE ? (
                      <>
                        <CheckCircle className="me-2" />
                        Task Completed
                      </>
                    ) : (
                      'Mark as Completed'
                    )}
                  </BootstrapButton>
                  
                  <Link
                    to={`/projects/${taskDetail.project.id}/tasks`}
                    className="btn btn-outline-primary text-decoration-none"
                  >
                    View All Project Tasks
                  </Link>
                  
                  <Link
                    to={`/projects/${taskDetail.project.id}`}
                    className="btn btn-outline-secondary text-decoration-none"
                  >
                    Go to Project
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-4">
          <Link 
            to={`/projects/${taskDetail.project.id}/tasks`}
            className="btn btn-outline-primary d-flex align-items-center gap-2 text-decoration-none"
          >
            <ArrowLeft />
            Back to Project Tasks
          </Link>
        </div>
      </Container>
    </MainLayout>
  );
};

export default TaskDetailPage;