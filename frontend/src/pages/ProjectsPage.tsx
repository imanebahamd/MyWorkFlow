import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button as BootstrapButton, Alert, Badge } from 'react-bootstrap';
import { Plus, Grid, List,  Calendar, Folder } from 'react-bootstrap-icons';
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
        setLastUpdated(new Date());
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadInitialProjects();
  }, []);

  // Handle filter changes with debounce
  useEffect(() => {
    if (!isInitialLoad) {
      const timer = setTimeout(() => {
        fetchProjects({
          page: 0,
          size: pagination.size,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection,
          search: filters.search || undefined,
        });
        setLastUpdated(new Date());
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [filters, isInitialLoad, pagination.size, fetchProjects]);

  const handleCreateProject = useCallback(async (data: CreateProjectRequest | UpdateProjectRequest) => {
    try {
      await createProject(data as CreateProjectRequest);
      setShowCreateModal(false);
      toast.success('Project created successfully!');
      setLastUpdated(new Date());
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
      setLastUpdated(new Date());
    } catch (err) {
      toast.error('Failed to update project');
    }
  }, [selectedProject, updateProject]);

  const handleDeleteProject = useCallback(async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully!');
        setLastUpdated(new Date());
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  }, [deleteProject]);

  const handlePageChange = useCallback((page: number) => {
    fetchProjects({
      page: page - 1,
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

  const handleRefresh = async () => {
    try {
      await fetchProjects({
        page: pagination.page,
        size: pagination.size,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
        search: filters.search || undefined,
      });
      setLastUpdated(new Date());
      toast.success('Projects refreshed!');
    } catch {
      toast.error('Failed to refresh projects');
    }
  };

  // Show loader only on initial load
  if (isInitialLoad && loading) {
    return (
      <MainLayout>
        <Container className="py-4">
          <Loader fullScreen message="Loading your projects..." />
        </Container>
      </MainLayout>
    );
  }

  // Calculate project stats
  const completedProjects = projects.filter(p => p.progressPercentage === 100).length;
  const inProgressProjects = projects.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length;
  const notStartedProjects = projects.filter(p => p.progressPercentage === 0).length;

  return (
    <MainLayout>
      <Container fluid className="py-4 px-lg-4">
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div className="mb-3 mb-md-0">
            <h1 className="fw-bold mb-1 gradient-text">My Projects</h1>
            <p className="text-muted mb-0 d-flex align-items-center">
              Manage your projects and track progress
              {lastUpdated && (
                <span className="ms-3 small text-muted">
                  <Calendar size={12} className="me-1" />
                  Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <div className="btn-group shadow-sm" role="group">
              <BootstrapButton
                variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className="border-0 px-3"
              >
                <Grid size={16} />
              </BootstrapButton>
              <BootstrapButton
                variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className="border-0 px-3"
              >
                <List size={16} />
              </BootstrapButton>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="outline-primary"
              size="sm"
              className="modern-btn"
            >
              Refresh
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="modern-btn px-3"
            >
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
            className="mb-4 border-0 shadow-sm pulse-animation"
          >
            <Alert.Heading className="fw-bold">Error Loading Projects</Alert.Heading>
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

        {/* Projects Stats */}
        {projects.length > 0 && (
          <div className="glass-effect p-4 rounded-3 shadow-sm mb-4">
            <Row className="g-3">
              <Col md={3}>
                <div className="p-3 rounded-3 bg-white text-center hover-shadow">
                  <h2 className="fw-bold mb-1 text-primary">{pagination.totalElements}</h2>
                  <small className="text-muted d-flex align-items-center justify-content-center">
                    <Folder size={14} className="me-2" />
                    Total Projects
                  </small>
                </div>
              </Col>
              <Col md={3}>
                <div className="p-3 rounded-3 bg-white text-center hover-shadow">
                  <h2 className="fw-bold mb-1 text-success">{completedProjects}</h2>
                  <small className="text-muted">Completed</small>
                  <Badge bg="success" className="ms-2" pill>✓</Badge>
                </div>
              </Col>
              <Col md={3}>
                <div className="p-3 rounded-3 bg-white text-center hover-shadow">
                  <h2 className="fw-bold mb-1 text-warning">{inProgressProjects}</h2>
                  <small className="text-muted">In Progress</small>
                  <Badge bg="warning" className="ms-2" pill>⟳</Badge>
                </div>
              </Col>
              <Col md={3}>
                <div className="p-3 rounded-3 bg-white text-center hover-shadow">
                  <h2 className="fw-bold mb-1 text-secondary">{notStartedProjects}</h2>
                  <small className="text-muted">Not Started</small>
                  <Badge bg="secondary" className="ms-2" pill>⋯</Badge>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Projects List */}
        <div className="glass-effect p-4 rounded-3 shadow-sm mb-4">
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
        </div>

        {/* Pagination */}
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
            onRefresh={handleRefresh}
            className="mt-4"
            disabled={loading}
            showRefresh={true}
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