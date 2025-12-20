import React from 'react';
import { Form } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';

interface InputProps extends Omit<FormControlProps, 'type'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'file';
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
      {label && <Form.Label>{label}</Form.Label>}
      <div className="position-relative">
        <Form.Control
          type={type}
          className={`${error ? 'is-invalid' : ''} ${className}`}
          {...props}
        />
        {icon && (
          <span className="position-absolute top-50 end-0 translate-middle-y me-3">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Input;