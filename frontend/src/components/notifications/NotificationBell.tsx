import React, { useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { Bell, CheckCircle, XCircle, InfoCircle, Clock } from 'react-bootstrap-icons';
import { useNotifications } from '../../context/NotificationContext';
import { formatTimeAgo } from '../../utils/dateUtils';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success" size={16} />;
      case 'error':
        return <XCircle className="text-danger" size={16} />;
      case 'warning':
        return <Clock className="text-warning" size={16} />;
      default:
        return <InfoCircle className="text-info" size={16} />;
    }
  };

  return (
    <Dropdown show={showDropdown} onToggle={setShowDropdown} align="end">
      <Dropdown.Toggle 
        variant="light" 
        className="position-relative"
        id="notification-dropdown"
        style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          padding: '0.5rem 0.75rem',
          color: '#52606D'
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <Badge 
            pill 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ 
              fontSize: '0.6rem', 
              minWidth: '18px', 
              height: '18px',
              background: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.35rem'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu 
        style={{ 
          width: '380px', 
          maxHeight: '500px', 
          overflowY: 'auto',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          padding: 0
        }}
      >
        <div style={{ 
          padding: '1rem 1.25rem', 
          borderBottom: '1px solid #F3F4F6',
          background: 'white'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0" style={{ fontWeight: '600', fontSize: '1rem' }}>Notifications</h6>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-link text-decoration-none p-0"
                onClick={markAllAsRead}
                style={{ color: '#F97316', fontWeight: '600', fontSize: '0.85rem' }}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-5">
            <Bell size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>No notifications</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 10).map((notification) => (
              <Dropdown.Item 
                key={notification.id}
                style={{ 
                  padding: '1rem 1.25rem',
                  background: !notification.read ? 'rgba(249, 115, 22, 0.05)' : 'white',
                  borderBottom: '1px solid #F3F4F6',
                  transition: 'background 0.2s'
                }}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.action) {
                    notification.action.onClick();
                  }
                  setShowDropdown(false);
                }}
              >
                <div className="d-flex gap-3">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="mb-0" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1F2933' }}>
                        {notification.title}
                      </h6>
                      {!notification.read && (
                        <span 
                          style={{ 
                            width: '8px', 
                            height: '8px', 
                            background: '#F97316',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginLeft: '0.5rem'
                          }}
                        ></span>
                      )}
                    </div>
                    <p className="mb-1" style={{ fontSize: '0.85rem', color: '#52606D' }}>
                      {notification.message}
                    </p>
                    <small style={{ color: '#9AA5B1', fontSize: '0.75rem' }}>
                      {formatTimeAgo(notification.timestamp.toISOString())}
                    </small>
                    {notification.action && (
                      <button 
                        className="btn btn-sm mt-2"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          color: '#F97316',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          notification.action?.onClick();
                          setShowDropdown(false);
                        }}
                      >
                        {notification.action.label}
                      </button>
                    )}
                  </div>
                </div>
              </Dropdown.Item>
            ))}
            
            {notifications.length > 10 && (
              <div className="text-center" style={{ padding: '0.75rem', borderTop: '1px solid #F3F4F6' }}>
                <button 
                  className="btn btn-sm btn-link text-decoration-none"
                  style={{ color: '#F97316', fontWeight: '600', fontSize: '0.85rem' }}
                  onClick={() => {
                    window.location.href = '/notifications';
                  }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;