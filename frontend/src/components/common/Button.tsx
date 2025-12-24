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
  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      padding: '13px 28px',
      fontSize: '15px',
      fontWeight: '600',
      border: 'none',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.25)',
      letterSpacing: '0.3px',
    };

    if (variant === 'primary') {
      return {
        ...baseStyles,
        background: '#F97316', // Orange soft solid color
        color: '#FFFFFF',
      };
    }

    return baseStyles;
  };

  return (
    <BootstrapButton
      disabled={disabled || loading}
      className={`modern-btn d-flex align-items-center justify-content-center gap-2 ${className}`}
      style={{
        ...getButtonStyles(),
        background: '#F97316 !important',
        backgroundColor: '#F97316 !important',
        borderColor: '#F97316 !important',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)';
          e.currentTarget.style.background = '#EA580C';
          e.currentTarget.style.backgroundColor = '#EA580C';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(249, 115, 22, 0.25)';
        e.currentTarget.style.background = '#F97316';
        e.currentTarget.style.backgroundColor = '#F97316';
      }}
      {...props}
    >
      {loading && (
        <span 
          className="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true"
          style={{ width: '16px', height: '16px' }}
        ></span>
      )}
      {icon && !loading && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </BootstrapButton>
  );
};

export default Button;