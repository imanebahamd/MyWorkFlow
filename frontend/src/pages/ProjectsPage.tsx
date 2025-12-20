import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button as BootstrapButton, Alert } from 'react-bootstrap';
import { Plus, Grid, List } from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';
import MainLayout from '../components/layout/MainLayout';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectFilters, { type FilterOptions } from '../components/projects/ProjectFilters';
import PaginationAdvanced from '../components/common/Pagination';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { useProjects } from '../hooks/useProjects';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project.types';

const ProjectsPage: React.FC = () => {
  const {
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearError,
  } = useProjects();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch projects on initial load
  useEffect(() => {
    const loadInitialProjects = async () => {
      try {
        await fetchProjects({
          page: 0,
          size: 10,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        });
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadInitialProjects();
  }, []); // Empty dependency array for initial load only

  // Handle filter changes with debounce
  useEffect(() => {
    if (!isInitialLoad) {
      const timer = setTimeout(() => {
        fetchProjects({
          page: 0, // Reset to first page when filters change
          size: pagination.size,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection,
          search: filters.search || undefined,
        });
      }, 300); // 300ms debounce
      
      return () => clearTimeout(timer);
    }
  }, [filters, isInitialLoad, pagination.size, fetchProjects]);

  const handleCreateProject = useCallback(async (data: CreateProjectRequest | UpdateProjectRequest) => {
    try {
      await createProject(data as CreateProjectRequest);
      setShowCreateModal(false);
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error('Failed to create project');
    }
  }, [createProject]);

  const handleUpdateProject = useCallback(async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (!selectedProject) return;
    
    try {
      await updateProject(selectedProject.id, data as UpdateProjectRequest);
      setShowEditModal(false);
      setSelectedProject(null);
      toast.success('Project updated successfully!');
    } catch (err) {
      toast.error('Failed to update project');
    }
  }, [selectedProject, updateProject]);

  const handleDeleteProject = useCallback(async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  }, [deleteProject]);

  const handlePageChange = useCallback((page: number) => {
    fetchProjects({
      page: page - 1, // Convert to zero-based
      size: pagination.size,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      search: filters.search || undefined,
    });
  }, [fetchProjects, pagination.size, filters]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
  }, []);

  const openEditModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  }, []);

  // Show loader only on initial load
  if (isInitialLoad && loading) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Loader fullScreen />
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-2">My Projects</h1>
            <p className="text-muted mb-0">
              Manage your projects and track progress
            </p>
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group" role="group">
              <BootstrapButton
                variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </BootstrapButton>
              <BootstrapButton
                variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={16} />
              </BootstrapButton>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="me-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={clearError}
            className="mb-4"
          >
            {error}
          </Alert>
        )}

        {/* Filters */}
        <ProjectFilters
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
          disabled={loading}
        />

        {/* Projects Stats - Only show if there are projects */}
        {projects.length > 0 && (
          <div className="bg-white p-3 rounded shadow-sm mb-4">
            <Row>
              <Col md={3}>
                <div className="text-center">
                  <h3 className="mb-0">{pagination.totalElements}</h3>
                  <small className="text-muted">Total Projects</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <h3 className="mb-0">
                    {projects.filter(p => p.progressPercentage === 100).length}
                  </h3>
                  <small className="text-muted">Completed</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <h3 className="mb-0">
                    {projects.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length}
                  </h3>
                  <small className="text-muted">In Progress</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <h3 className="mb-0">
                    {projects.filter(p => p.progressPercentage === 0).length}
                  </h3>
                  <small className="text-muted">Not Started</small>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Projects List */}
        <ProjectList
          projects={projects}
          loading={loading && !isInitialLoad}
          onEditProject={openEditModal}
          onDeleteProject={handleDeleteProject}
          columns={viewMode === 'grid' ? 3 : 1}
          emptyMessage={
            filters.search 
              ? 'No projects found matching your search' 
              : 'Create your first project to get started'
          }
        />

        {/* Pagination - Only show if there are multiple pages */}
        {pagination.totalPages > 1 && (
          <PaginationAdvanced
            currentPage={pagination.page + 1}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalElements}
            pageSize={pagination.size}
            onPageChange={handlePageChange}
            onPageSizeChange={(newSize) => {
              fetchProjects({
                page: 0,
                size: newSize,
                sortBy: filters.sortBy,
                sortDirection: filters.sortDirection,
                search: filters.search || undefined,
              });
            }}
            className="mt-4"
            disabled={loading}
          />
        )}

        {/* Create Project Modal */}
        <ProjectForm
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          loading={loading}
          title="Create New Project"
        />

        {/* Edit Project Modal */}
        <ProjectForm
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleUpdateProject}
          loading={loading}
          project={selectedProject}
          title="Edit Project"
        />
      </Container>
    </MainLayout>
  );
};

export default ProjectsPage;