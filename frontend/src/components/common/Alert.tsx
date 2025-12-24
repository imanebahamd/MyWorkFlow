import React, { useState } from 'react';
import { Alert as BootstrapAlert, type AlertProps as BootstrapAlertProps } from 'react-bootstrap';

interface CustomAlertProps extends BootstrapAlertProps {
  dismissible?: boolean;
  onClose?: () => void;
}

const Alert: React.FC<CustomAlertProps> = ({
  children,
  dismissible = false,
  onClose,
  variant = 'info',
  className = '',
  ...props
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  if (!show) return null;

  const alertStyles = {
    danger: {
      background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
      border: '2px solid #EF4444',
      color: '#991B1B',
    },
    success: {
      background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      border: '2px solid #10B981',
      color: '#065F46',
    },
    warning: {
      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      border: '2px solid #FACC15',
      color: '#78350F',
    },
    info: {
      background: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
      border: '2px solid #F97316',
      color: '#9A3412',
    },
  };

  const currentStyle = alertStyles[variant as keyof typeof alertStyles] || alertStyles.info;

  return (
    <BootstrapAlert
      variant={variant}
      dismissible={dismissible}
      onClose={handleClose}
      className={`modern-alert ${className}`}
      style={{
        borderRadius: '12px',
        padding: '14px 18px',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '20px',
        ...currentStyle,
        animation: 'slideDown 0.3s ease-out',
      }}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </div>
    </BootstrapAlert>
  );
};

export default Alert;