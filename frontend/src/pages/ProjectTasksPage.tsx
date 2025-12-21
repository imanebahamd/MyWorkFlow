import React, { useState, useEffect } from 'react';
import { Container, Card, Breadcrumb, Button as BootstrapButton } from 'react-bootstrap';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Plus,
  CheckCircle,
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters, { type TaskFilterOptions } from '../components/tasks/TaskFilters';
import Pagination from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/Alert';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { type Task, TaskStatus } from '../types/task.types';

const ProjectTasksPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const {
    projectDetail,
    loading: projectLoading,
    error: projectError,
    fetchProjectById,
  } = useProjects();

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    clearError,
  } = useTasks(parseInt(id || '0'));

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: '',
    status: undefined,
    dueDate: undefined,
    overdue: false,
    viewMode: 'list',
    sortBy: 'dueDate',
    sortDirection: 'asc',
  });

  // Check if we should open create modal from URL
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  // Fetch project and tasks on mount
  useEffect(() => {
    if (id) {
      fetchProjectById(parseInt(id));
      fetchTasks(filters);
    }
  }, [id, filters]);

  const handleCreateTask = async (data: any) => {
    try {
      await createTask(data);
      setShowCreateModal(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!selectedTask) return;
    
    try {
      await updateTask(selectedTask.id, data);
      setShowEditModal(false);
      setSelectedTask(null);
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await toggleTaskStatus(task);
      toast.success('Task status updated!');
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  const handlePageChange = (page: number) => {
    fetchTasks({
      ...filters,
      page: page - 1, // Convert to zero-based
      size: pagination.size,
    });
  };

  const handlePageSizeChange = (size: number) => {
    fetchTasks({
      ...filters,
      page: 0, // Reset to first page
      size: size,
    });
  };

  const handleFilterChange = (newFilters: TaskFilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      dueDate: undefined,
      overdue: false,
      viewMode: 'list',
      sortBy: 'dueDate',
      sortDirection: 'asc',
    });
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const markAllAsCompleted = async () => {
    if (!tasks.length) return;
    
    if (window.confirm(`Mark all ${tasks.length} tasks as completed?`)) {
      try {
        const promises = tasks
          .filter(task => task.status !== TaskStatus.DONE)
          .map(task => updateTask(task.id, { status: TaskStatus.DONE }));
        
        await Promise.all(promises);
        toast.success('All tasks marked as completed!');
      } catch (err) {
        toast.error('Failed to update tasks');
      }
    }
  };

  if (projectLoading && !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Loader fullScreen />
        </Container>
      </MainLayout>
    );
  }

  if (projectError || !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <AlertMessage variant="danger" title="Project not found">
            <p>{projectError || 'The project you are looking for does not exist.'}</p>
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
          </AlertMessage>
        </Container>
      </MainLayout>
    );
  }

  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/projects/${id}` }}>
            {projectDetail.title}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Tasks
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-2">
              {projectDetail.title} - Tasks
            </h1>
            <p className="text-muted mb-0">
              {totalTasks} tasks ({completedTasks} completed)
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <BootstrapButton
              variant="success"
              onClick={markAllAsCompleted}
              disabled={tasks.length === 0 || tasks.every(t => t.status === TaskStatus.DONE)}
            >
              <CheckCircle className="me-2" />
              Mark All Complete
            </BootstrapButton>
            <BootstrapButton
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="me-2" />
              New Task
            </BootstrapButton>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-medium">Project Progress</span>
              <span className="fw-bold">{completionPercentage}%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${completionPercentage}%` }}
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </Card.Body>
        </Card>

        {/* Error Alert */}
        {tasksError && (
          <AlertMessage 
            variant="danger" 
            dismissible 
            onClose={clearError}
            className="mb-4"
          >
            {tasksError}
          </AlertMessage>
        )}

        {/* Filters */}
        <TaskFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
        />

        {/* Tasks List */}
        <TaskList
          tasks={tasks}
          loading={tasksLoading && tasks.length === 0}
          onToggleStatus={handleToggleStatus}
          onEditTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          viewMode={filters.viewMode}
          emptyMessage={
            filters.search || filters.status || filters.dueDate || filters.overdue
              ? 'No tasks found matching your filters'
              : 'Create your first task for this project'
          }
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              currentPage={pagination.page + 1}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalElements}
              pageSize={pagination.size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageInfo={true}
              showPageSizeSelector={true}
              className="mt-4"
            />
          </div>
        )}

        {/* Create Task Modal */}
        <TaskForm
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            // Remove create param from URL
            navigate(`/projects/${id}/tasks`, { replace: true });
          }}
          onSubmit={handleCreateTask}
          loading={tasksLoading}
          projectId={parseInt(id || '0')}
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
      </Container>
    </MainLayout>
  );
};

export default ProjectTasksPage;