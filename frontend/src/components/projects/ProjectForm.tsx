import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types/project.types';
import Button from '../common/Button';
import Input from '../common/Input';

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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          <Input
            label="Project Title"
            placeholder="Enter project title"
            error={errors.title?.message}
            disabled={loading}
            {...register('title')}
          />

          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter project description"
              disabled={loading}
              {...register('description')}
            />
            {errors.description && (
              <Form.Text className="text-danger">
                {errors.description.message}
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!isDirty || loading}
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProjectForm;