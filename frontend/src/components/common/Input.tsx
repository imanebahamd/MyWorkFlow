import React from 'react';
import { Form } from 'react-bootstrap';

interface InputProps extends  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <div className="position-relative">
        <Form.Control
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