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

  return (
    <BootstrapAlert
      variant={variant}
      dismissible={dismissible}
      onClose={handleClose}
      className={className}
      {...props}
    >
      {children}
    </BootstrapAlert>
  );
};

export default Alert;