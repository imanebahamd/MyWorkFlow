import React from 'react';
import { Form } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';

interface InputProps extends Omit<FormControlProps, 'type'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'file' | 'date';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  type = 'text',
  ...props
}) => {
  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label 
          className="fw-semibold mb-2" 
          style={{ 
            fontSize: '14px',
            color: '#1F2933',
            letterSpacing: '0.2px'
          }}
        >
          {label}
        </Form.Label>
      )}
      <div className="position-relative">
        <Form.Control
          type={type}
          className={`modern-input ${error ? 'is-invalid' : ''} ${className}`}
          style={{
            borderRadius: '12px',
            padding: '13px 18px',
            paddingRight: icon ? '48px' : '18px',
            fontSize: '14px',
            border: error ? '2px solid #EF4444' : '2px solid #FED7AA',
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            color: '#1F2933',
          }}
          {...props}
        />
        {icon && (
          <span 
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{
              color: '#9AA5B1',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {icon}
          </span>
        )}
      </div>
      {error && (
        <Form.Control.Feedback 
          type="invalid" 
          style={{ 
            display: 'block',
            fontSize: '12px',
            marginTop: '5px',
            fontWeight: '500',
            color: '#EF4444'
          }}
        >
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Input;