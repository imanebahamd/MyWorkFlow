import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  Folder,
  CheckSquare,
  Clock,
  ExclamationTriangle,
  BarChart
} from 'react-bootstrap-icons';

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    averageProgress: number;
  };
  loading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading = false }) => {
  const quickStats = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: <Folder size={24} />,
      color: '#F97316',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      description: `${stats.activeProjects} active`,
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <CheckSquare size={24} />,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      description: `${stats.completedTasks} completed`,
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: <Clock size={24} />,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      description: 'Currently working',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: <ExclamationTriangle size={24} />,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      description: 'Need attention',
    },
    {
      title: 'Avg Progress',
      value: `${Math.round(stats.averageProgress)}%`,
      icon: <BarChart size={24} />,
      color: '#FACC15',
      bgColor: 'rgba(250, 204, 21, 0.1)',
      description: 'Overall completion',
    }
  ];

  if (loading) {
    return (
      <Row className="g-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Col key={i} xs={12} sm={6} lg className="mb-3">
            <Card style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <Card.Body>
                <div className="placeholder-glow">
                  <div className="placeholder col-6 mb-2" style={{ height: '24px' }}></div>
                  <div className="placeholder col-10 mb-1"></div>
                  <div className="placeholder col-8"></div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row className="g-3">
      {quickStats.map((stat, index) => (
        <Col key={index} xs={12} sm={6} xl className="mb-3">
          <Card 
            className="card-hover h-100" 
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Card.Body>
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: stat.bgColor,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
              
              <h3 className="h2 mb-1" style={{ fontWeight: '700', color: '#1F2933' }}>
                {stat.value}
              </h3>
              <h6 className="mb-2" style={{ fontWeight: '600', color: '#52606D', fontSize: '0.875rem' }}>
                {stat.title}
              </h6>
              <p className="mb-0" style={{ color: '#9AA5B1', fontSize: '0.8rem' }}>
                {stat.description}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;