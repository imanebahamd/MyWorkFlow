import React from 'react';
import { Button as BootstrapButton, type ButtonProps as BootstrapButtonProps } from 'react-bootstrap';

interface CustomButtonProps extends BootstrapButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
  className = '',
  ...props
}) => {
  return (
    <BootstrapButton
      variant={variant}
      disabled={disabled || loading}
      className={`d-flex align-items-center justify-content-center gap-2 ${className}`}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      )}
      {icon && !loading && icon}
      {children}
    </BootstrapButton>
  );
};

export default Button;