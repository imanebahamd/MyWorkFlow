import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FolderPlus,
  CheckCircle,
  Clock,
  ArrowRightCircle,
  Calendar
} from 'react-bootstrap-icons';
import type { RecentActivity } from '../../types/dashboard.types';
import { formatDate } from '../../utils/dateUtils';

interface ActivityFeedProps {
  activities: RecentActivity[];
  loading?: boolean;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  loading = false,
  maxItems = 10
}) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'PROJECT_CREATED':
      case 'PROJECT_UPDATED':
        return <FolderPlus className="text-primary" size={18} />;
      case 'TASK_CREATED':
        return <ArrowRightCircle className="text-info" size={18} />;
      case 'TASK_COMPLETED':
        return <CheckCircle className="text-success" size={18} />;
      default:
        return <Clock className="text-secondary" size={18} />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'PROJECT_CREATED':
        return { bg: 'rgba(249, 115, 22, 0.1)', color: '#F97316' };
      case 'TASK_CREATED':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
      case 'TASK_COMPLETED':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      case 'PROJECT_UPDATED':
        return { bg: 'rgba(250, 204, 21, 0.1)', color: '#FACC15' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF' };
    }
  };

  const getActivityLink = (activity: RecentActivity) => {
    if (activity.taskId) {
      return `/tasks/${activity.taskId}`;
    }
    return `/projects/${activity.projectId}`;
  };

  const getActivityText = (activity: RecentActivity) => {
    switch (activity.type) {
      case 'PROJECT_CREATED':
        return 'created project';
      case 'TASK_CREATED':
        return 'added task to';
      case 'TASK_COMPLETED':
        return 'completed task in';
      case 'PROJECT_UPDATED':
        return 'updated project';
      default:
        return 'updated';
    }
  };

  if (loading) {
    return (
      <Card style={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <Card.Header style={{ background: 'white', borderBottom: '1px solid #F3F4F6', padding: '1.25rem 1.5rem' }}>
          <h5 className="mb-0" style={{ fontWeight: '600', fontSize: '1rem' }}>Recent Activity</h5>
        </Card.Header>
        <Card.Body>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="d-flex align-items-start mb-3 pb-3 border-bottom">
              <div className="placeholder-glow flex-shrink-0 me-3">
                <div className="placeholder rounded-circle" style={{ width: '40px', height: '40px' }}></div>
              </div>
              <div className="flex-grow-1 placeholder-glow">
                <div className="placeholder col-8 mb-1"></div>
                <div className="placeholder col-6"></div>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card style={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <Card.Header style={{ background: 'white', borderBottom: '1px solid #F3F4F6', padding: '1.25rem 1.5rem' }}>
          <h5 className="mb-0" style={{ fontWeight: '600', fontSize: '1rem' }}>Recent Activity</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <Clock size={48} className="text-muted mb-3" />
          <h5 style={{ fontWeight: '600', color: '#52606D' }}>No recent activity</h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Your activity will appear here</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <Card.Header style={{ background: 'white', borderBottom: '1px solid #F3F4F6', padding: '1.25rem 1.5rem' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0" style={{ fontWeight: '600', fontSize: '1rem' }}>Recent Activity</h5>
          <Badge 
            bg="primary" 
            pill
            style={{ 
              background: '#F97316', 
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem'
            }}
          >
            {activities.length}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {activities.slice(0, maxItems).map((activity, index) => {
            const colors = getActivityColor(activity.type);
            return (
              <ListGroup.Item 
                key={`${activity.type}-${activity.id}`}
                className="border-0 hover-bg-light"
                style={{ 
                  padding: '1rem 1.5rem',
                  borderBottom: index < activities.slice(0, maxItems).length - 1 ? '1px solid #F3F4F6' : 'none',
                  transition: 'background-color 0.2s'
                }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="flex-shrink-0">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        background: colors.bg,
                        color: colors.color
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1" style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                      <Link 
                        to={getActivityLink(activity)}
                        className="text-decoration-none"
                        style={{ color: '#1F2933' }}
                      >
                        {activity.title}
                      </Link>
                    </h6>
                    <p className="mb-1" style={{ color: '#9AA5B1', fontSize: '0.85rem' }}>
                      {getActivityText(activity)}{' '}
                      <Link 
                        to={`/projects/${activity.projectId}`}
                        className="text-decoration-none"
                        style={{ color: '#F97316', fontWeight: '500' }}
                      >
                        {activity.projectTitle}
                      </Link>
                    </p>
                    <div className="d-flex align-items-center gap-1" style={{ color: '#9AA5B1', fontSize: '0.8rem' }}>
                      <Calendar size={12} />
                      <span>{formatDate(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card.Body>
      {activities.length > maxItems && (
        <Card.Footer style={{ background: 'white', textAlign: 'center', padding: '0.875rem' }}>
          <Link 
            to="/activity" 
            className="text-decoration-none"
            style={{ color: '#F97316', fontWeight: '600', fontSize: '0.875rem' }}
          >
            View All Activity
          </Link>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ActivityFeed;