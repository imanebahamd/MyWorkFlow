import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types/project.types';
import Button from '../common/Button';
import Input from '../common/Input';
import { LightningCharge } from 'react-bootstrap-icons';

interface ProjectFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  loading?: boolean;
  project?: Project | null;
  title?: string;
}

interface ProjectFormData {
  title: string;
  description?: string;
}

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: yup
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional() 
    .default(''), 
}) as yup.ObjectSchema<ProjectFormData>; 

const ProjectForm: React.FC<ProjectFormProps> = ({
  show,
  onHide,
  onSubmit,
  loading = false,
  project,
  title = project ? 'Edit Project' : 'Create New Project',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description || '',
      });
    } else {
      reset({
        title: '',
        description: '',
      });
    }
  }, [project, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    const formattedData: CreateProjectRequest | UpdateProjectRequest = {
      title: data.title,
      description: data.description?.trim() || undefined, 
    };
    
    await onSubmit(formattedData);
    if (!project) {
      reset(); 
    }
  };

  const handleClose = () => {
    reset();
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      backdrop="static"
      className="modern-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <LightningCharge className="me-2" color="#F97316" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <Form onSubmit={handleSubmit(handleFormSubmit)} className="p-2">
          <div className="mb-4">
            <Input
              label="Project Title"
              placeholder="Enter project title"
              error={errors.title?.message}
              disabled={loading}
              {...register('title')}
              className="modern-input"
              icon={<i className="bi bi-card-heading"></i>}
            />
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold d-flex align-items-center">
              <i className="bi bi-text-paragraph me-2"></i>
              Description (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter project description"
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

          <div className="d-flex gap-2 justify-content-end pt-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleClose}
              disabled={loading}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!isDirty || loading}
              className="px-4 modern-btn"
            >
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProjectForm;