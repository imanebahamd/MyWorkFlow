import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: yup
    .string()
    .required('First name is required'),
  lastName: yup
    .string()
    .required('Last name is required'),
});

const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setSuccess('Registration successful! Redirecting...');
    } catch (err: any) {
      setError(err || 'Registration failed');
    }
  };

  return (
    <div>
      <div 
        className="text-center mb-3"
        style={{
          paddingBottom: '15px',
          borderBottom: '2px solid rgba(254, 215, 170, 0.5)',
        }}
      >
        <h2 
          style={{ 
            fontSize: '24px',
            fontWeight: '700',
            color: '#1F2933',
            marginBottom: '6px',
            letterSpacing: '-0.5px',
          }}
        >
          Create Account
        </h2>
        <p 
          style={{ 
            color: '#52606D',
            fontSize: '13px',
            fontWeight: '500',
            margin: 0,
          }}
        >
          Fill in the details below to get started
        </p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Row 1: First Name & Last Name */}
        <div className="row">
          <div className="col-6">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        {/* Row 2: Email (full width) */}
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Row 3: Password & Confirm Password */}
        <div className="row">
          <div className="col-6">
            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 chars"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          className="w-100"
          style={{
            padding: '12px',
            fontSize: '15px',
            marginBottom: '15px',
            marginTop: '5px',
          }}
        >
          Create Account
        </Button>

        {/* Footer */}
        <div 
          className="text-center"
          style={{
            padding: '15px 0 0',
            borderTop: '1px solid rgba(254, 215, 170, 0.5)',
          }}
        >
          <p 
            style={{ 
              color: '#52606D',
              fontSize: '13px',
              fontWeight: '500',
              margin: 0,
            }}
          >
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-decoration-none"
              style={{
                color: '#F97316',
                fontWeight: '700',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#EA580C'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#F97316'}
            >
              Sign in
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;