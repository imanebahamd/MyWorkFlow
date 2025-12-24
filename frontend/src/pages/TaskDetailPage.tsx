import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge,  Button as BootstrapButton } from 'react-bootstrap';
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
          <Loader fullScreen message="Loading task..." />
        </Container>
      </MainLayout>
    );
  }

  if (error || !taskDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <AlertMessage variant="danger">
            <div className="fw-bold mb-2">Task not found</div>
            <p className="mb-3">{error || 'The task you are looking for does not exist.'}</p>
            <div className="d-flex gap-2">
              <Link to="/tasks" className="btn btn-outline-primary">
                <ArrowLeft size={16} className="me-2" />
                Back to Tasks
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
      <Container fluid className="py-4 px-lg-4">
        {/* HEADER */}
        <div className="mb-4">
          

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <div className="d-flex align-items-center gap-2 mb-2">
                {getStatusIcon(taskDetail.status)}
                <h1 className="fw-bold mb-0">{taskDetail.title}</h1>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Badge bg={getStatusColor(taskDetail.status)}>
                  {taskDetail.status.replace('_', ' ')}
                </Badge>
                {isOverdue && (
                  <Badge bg="danger">Overdue</Badge>
                )}
                <span className="text-muted">·</span>
                <Link to={`/projects/${taskDetail.project.id}`} className="text-muted text-decoration-none">
                  {taskDetail.project.title}
                </Link>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <Link 
                to={`/tasks/${id}/edit`}
                className="btn btn-outline-primary d-flex align-items-center gap-2"
              >
                <Pencil size={16} />
                Edit
              </Link>
              <BootstrapButton
                variant="outline-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash size={16} className="me-2" />
                    Delete
                  </>
                )}
              </BootstrapButton>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <Row>
          {/* Description Section */}
          <Col lg={8}>
            <div className="glass-effect p-4 rounded-3 mb-4">
              <h5 className="fw-bold mb-3">Description</h5>
              {taskDetail.description ? (
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {taskDetail.description}
                </p>
              ) : (
                <p className="text-muted mb-0 fst-italic">No description provided.</p>
              )}
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Task Details */}
            <div className="glass-effect p-4 rounded-3 mb-4">
              <h5 className="fw-bold mb-4">Task Details</h5>
              
              <div className="d-flex flex-column gap-3">
                <div>
                  <small className="text-muted d-block mb-1">Due Date</small>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={14} className="text-muted" />
                    <span className={isOverdue ? 'text-danger fw-medium' : ''}>
                      {taskDetail.dueDate ? formatDueDate(taskDetail.dueDate) : 'No due date'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <small className="text-muted d-block mb-2">Status</small>
                  <div className="d-flex gap-2 flex-wrap">
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
                
                <div>
                  <small className="text-muted d-block mb-1">Created</small>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={14} className="text-muted" />
                    <span>{formatDate(taskDetail.createdAt)}</span>
                  </div>
                </div>
                
                <div>
                  <small className="text-muted d-block mb-1">Last Updated</small>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={14} className="text-muted" />
                    <span>{formatDate(taskDetail.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-effect p-4 rounded-3">
              <h5 className="fw-bold mb-4">Quick Actions</h5>
              
              <div className="d-grid gap-2">
                <BootstrapButton
                  variant={taskDetail.status === TaskStatus.DONE ? 'secondary' : 'success'}
                  onClick={handleMarkComplete}
                  disabled={isUpdating || taskDetail.status === TaskStatus.DONE}
                >
                  {isUpdating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : taskDetail.status === TaskStatus.DONE ? (
                    <>
                      <CheckCircle size={16} className="me-2" />
                      Completed
                    </>
                  ) : (
                    'Mark as Completed'
                  )}
                </BootstrapButton>
                
                <Link
                  to={`/projects/${taskDetail.project.id}/tasks`}
                  className="btn btn-outline-primary"
                >
                  View All Tasks
                </Link>
                
                <Link
                  to={`/projects/${taskDetail.project.id}`}
                  className="btn btn-outline-secondary"
                >
                  Go to Project
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* BACK BUTTON */}
        <div className="mt-4">
          <Link 
            to={`/projects/${taskDetail.project.id}/tasks`}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            style={{ width: 'fit-content' }}
          >
            <ArrowLeft size={16} />
            Back to Project Tasks
          </Link>
        </div>
      </Container>
    </MainLayout>
  );
};

export default TaskDetailPage;