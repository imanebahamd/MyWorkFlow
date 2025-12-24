import React, { useState, useEffect } from 'react';
import { Container,   Button as BootstrapButton } from 'react-bootstrap';
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

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

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
      page: page - 1,
      size: pagination.size,
    });
  };

  const handlePageSizeChange = (size: number) => {
    fetchTasks({
      ...filters,
      page: 0,
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
          <Loader fullScreen message="Loading project..." />
        </Container>
      </MainLayout>
    );
  }

  if (projectError || !projectDetail) {
    return (
      <MainLayout>
        <Container className="py-4">
          <AlertMessage variant="danger">
            <div className="fw-bold mb-2">Project not found</div>
            <p className="mb-3">{projectError || 'The project you are looking for does not exist.'}</p>
            <div className="d-flex gap-2">
              <Link to="/projects" className="btn btn-outline-primary">
                <ArrowLeft size={16} className="me-2" />
                Back to Projects
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
      <Container fluid className="py-4 px-lg-4">
        {/* HEADER */}
        <div className="mb-4">
         

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h1 className="fw-bold mb-2">{projectDetail.title}</h1>
              <p className="text-muted mb-0">
                {totalTasks} tasks · {completedTasks} completed
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <BootstrapButton
                variant="outline-success"
                onClick={markAllAsCompleted}
                disabled={tasks.length === 0 || tasks.every(t => t.status === TaskStatus.DONE)}
              >
                <CheckCircle size={16} className="me-2" />
                Complete All
              </BootstrapButton>
              <BootstrapButton
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={16} className="me-2" />
                New Task
              </BootstrapButton>
            </div>
          </div>
        </div>

        {/* PROGRESS SECTION */}
        <div className="glass-effect p-4 rounded-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Overall Progress</h5>
            <span className="fw-bold text-primary">{completionPercentage}%</span>
          </div>
          <div className="progress" style={{ height: '12px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${completionPercentage}%` }}
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <div className="d-flex justify-content-between text-muted small mt-2">
            <span>{completedTasks} completed</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </div>

        {/* ERROR ALERT */}
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

        {/* FILTERS */}
        <TaskFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
        />

        {/* TASKS LIST */}
        <div className="glass-effect p-4 rounded-3 mb-4">
          <div className="mb-4">
            <h5 className="fw-bold mb-1">All Tasks</h5>
            <p className="text-muted small mb-0">
              Manage and track all tasks for this project
            </p>
          </div>

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
        </div>

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-center">
            <Pagination
              currentPage={pagination.page + 1}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalElements}
              pageSize={pagination.size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageInfo={true}
              showPageSizeSelector={true}
            />
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="mt-4">
          <Link 
            to={`/projects/${id}`}
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            style={{ width: 'fit-content' }}
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>
        </div>

        {/* MODALS */}
        <TaskForm
          show={showCreateModal}
          onHide={() => {
            setShowCreateModal(false);
            navigate(`/projects/${id}/tasks`, { replace: true });
          }}
          onSubmit={handleCreateTask}
          loading={tasksLoading}
          projectId={parseInt(id || '0')}
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
      </Container>
    </MainLayout>
  );
};

export default ProjectTasksPage;