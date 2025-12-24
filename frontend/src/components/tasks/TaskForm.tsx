import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { type Task, type CreateTaskRequest, type UpdateTaskRequest, TaskStatus } from '../../types/task.types';
import Input from '../common/Input';
import { CheckSquare } from 'react-bootstrap-icons';

interface TaskFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  loading?: boolean;
  task?: Task | null;
  projectId?: number;
}

type TaskFormData = {
  title: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
};

const schema: yup.ObjectSchema<TaskFormData> = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: yup
    .string()
    .optional()
    .max(1000, 'Description cannot exceed 1000 characters'),
  dueDate: yup
    .string()
    .optional()
    .test('is-valid-date', 'Please enter a valid date', (value) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('not-in-past', 'Due date cannot be in the past', (value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), 'Invalid status')
    .optional()
});

const TaskForm: React.FC<TaskFormProps> = ({
  show,
  onHide,
  onSubmit,
  loading = false,
  task,
  projectId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      status: task?.status || TaskStatus.TODO,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        dueDate: '',
        status: TaskStatus.TODO,
      });
    }
  }, [task, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
    const formattedData: any = {
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
    };

    if (task) {
      formattedData.status = data.status || TaskStatus.TODO;
    }

    await onSubmit(formattedData);
    
    if (!task) {
      reset(); 
    }
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  const getTitle = () => {
    if (task) return 'Edit Task';
    return projectId ? 'Add New Task' : 'Create Task';
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      className="modern-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <CheckSquare className="me-2" color="#F97316" />
          {getTitle()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <Form onSubmit={handleSubmit(handleFormSubmit)} className="p-2">
          <div className="mb-3">
            <Input
              label="Task Title"
              placeholder="What needs to be done?"
              error={errors.title?.message}
              disabled={loading}
              {...register('title')}
              className="modern-input"
              icon={<i className="bi bi-card-heading"></i>}
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold d-flex align-items-center">
              <i className="bi bi-text-paragraph me-2"></i>
              Description (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add more details about this task..."
              disabled={loading}
              {...register('description')}
              className="modern-input border-0 shadow-sm"
              style={{ 
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                resize: 'vertical'
              }}
            />
            {errors.description && (
              <Form.Text className="text-danger mt-2">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.description.message}
              </Form.Text>
            )}
          </Form.Group>

          <div className="row g-3">
            <div className="col-md-6">
              <Input
                label="Due Date"
                type="date"
                error={errors.dueDate?.message}
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
                {...register('dueDate')}
                className="modern-input"
              />
            </div>
            
            {task && (
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    disabled={loading}
                    {...register('status')}
                    className="modern-select border-0 shadow-sm"
                    style={{ 
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px'
                    }}
                  >
                    {Object.values(TaskStatus).map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.status && (
                    <Form.Text className="text-danger">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errors.status.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
            )}
          </div>

          {projectId && !task && (
            <div className="alert alert-info small mt-3 border-0 shadow-sm" style={{ 
              background: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--info-color)'
            }}>
              <i className="bi bi-info-circle me-2"></i>
              This task will be added to the current project.
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end pt-3">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary modern-btn px-4"
              disabled={!isDirty || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskForm;