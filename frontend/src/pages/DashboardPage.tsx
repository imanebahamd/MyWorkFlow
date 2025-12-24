import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button as BootstrapButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  Plus,
  ArrowClockwise,
  LightningCharge,
  Calendar,
  BarChart,
  Bullseye,
  ExclamationTriangle,
  ListTask,
  CheckCircle,
  Folder
} from 'react-bootstrap-icons';
import { toast } from 'react-hot-toast';

import MainLayout from '../components/layout/MainLayout';
import StatsCards from '../components/dashboard/StatsCards';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/Alert';

import { useDashboard } from '../hooks/useDashboard';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';

const DashboardPage: React.FC = () => {
  const {
    dashboardData,
    stats,
    loading,
    error,
    lastUpdated,
    refresh,
    clearError,
  } = useDashboard();

  const { projects, fetchProjects } = useProjects();
  const { fetchTasks } = useTasks();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProjects({ page: 0, size: 3 });
    fetchTasks({ page: 0, size: 5 });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      await fetchProjects({ page: 0, size: 3 });
      await fetchTasks({ page: 0, size: 5 });
      toast.success('Dashboard updated!');
    } catch {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const hasData = stats && (stats.totalProjects > 0 || stats.totalTasks > 0);

  const weeklyChartData = stats ? {
    labels: Object.keys(stats.weeklyTaskCompletion || {}),
    datasets: [{
      label: 'Tasks Completed',
      data: Object.values(stats.weeklyTaskCompletion || {}),
      borderColor: '#F97316',
      backgroundColor: 'rgba(249,115,22,0.1)',
      tension: 0.4,
      fill: true,
    }]
  } : null;

  if (loading && !dashboardData) {
    return (
      <MainLayout>
        <Loader fullScreen message="Loading your dashboard..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container fluid className="py-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">Dashboard Overview</h1>
            <p className="text-muted mb-0 d-flex align-items-center">
              <LightningCharge className="me-2" color="#F97316" />
              Your productivity at a glance
              {lastUpdated && (
                <span className="ms-3 small">
                  <Calendar size={12} className="me-1" />
                  {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          <div className="d-flex gap-2">
            <BootstrapButton
              variant="outline-primary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <ArrowClockwise className="me-2" />
              Refresh
            </BootstrapButton>

            <Link to="/projects?create=true" className="btn btn-primary">
              <Plus className="me-2" />
              New Project
            </Link>
          </div>
        </div>

        {error && (
          <AlertMessage variant="danger" dismissible onClose={clearError}>
            {error}
          </AlertMessage>
        )}

        {/* STATS */}
        {stats && (
          <div className="mb-4">
            <StatsCards
              stats={{
                totalProjects: stats.totalProjects,
                activeProjects: stats.activeProjects,
                completedProjects: stats.completedProjects,
                totalTasks: stats.totalTasks,
                completedTasks: stats.completedTasks,
                inProgressTasks: stats.inProgressTasks,
                todoTasks: stats.todoTasks,
                overdueTasks: stats.overdueTasks,
                averageProgress: stats.averageProjectProgress,
              }}
              loading={loading}
            />
          </div>
        )}

        {hasData ? (
          <>
            {/* MAIN ZONE */}
            <Row className="mb-4">
              <Col xl={8} lg={7}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Header className="bg-white fw-bold">
                    <BarChart className="me-2" color="#F97316" />
                    Weekly Performance
                  </Card.Header>
                  <Card.Body>
                    {weeklyChartData && <WeeklyChart data={weeklyChartData} height={260} />}
                  </Card.Body>
                </Card>
              </Col>

              <Col xl={4} lg={5}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Header className="bg-white fw-bold">
                    <Bullseye className="me-2" color="#F97316" />
                    Focus Areas
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-3">
                    {stats.overdueTasks > 0 && (
                      <div className="p-3 rounded bg-danger bg-opacity-10">
                        <ExclamationTriangle className="me-2 text-danger" />
                        {stats.overdueTasks} overdue tasks
                      </div>
                    )}
                    {stats.todoTasks > 0 && (
                      <div className="p-3 rounded bg-secondary bg-opacity-10">
                        <ListTask className="me-2" />
                        {stats.todoTasks} tasks to start
                      </div>
                    )}
                    <div className="p-3 rounded bg-success bg-opacity-10">
                      <CheckCircle className="me-2 text-success" />
                      {Math.round(stats.averageProjectProgress)}% average progress
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* SECONDARY ZONE */}
            <Row>
              <Col lg={6}>
                <ActivityFeed
                  activities={stats.recentActivities || []}
                  loading={loading}
                  maxItems={5}
                />
              </Col>

              <Col lg={6}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white fw-bold d-flex justify-content-between">
                    <span>
                      <Folder className="me-2" color="#F97316" />
                      Recent Projects
                    </span>
                    <Link to="/projects">View all</Link>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {projects.map(p => (
                        <Col md={6} key={p.id} className="mb-3">
                          <Card className="border">
                            <Card.Body>
                              <strong>{p.title}</strong>
                              <Badge className="float-end">{p.progressPercentage}%</Badge>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          /* EMPTY STATE */
          <Card className="text-center shadow-sm border-0 py-5">
            <h3 className="fw-bold">Welcome to MyWorkFlow</h3>
            <p className="text-muted">Create your first project to get started</p>
            <Link to="/projects?create=true" className="btn btn-primary">
              <Plus className="me-2" />
              Create Project
            </Link>
          </Card>
        )}
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
