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
    <div className="auth-form-container">
      <div className="text-center mb-4">
        <h2>Create Account</h2>
        <p className="text-muted">Join our platform today</p>
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
        <div className="row">
          <div className="col-md-6">
            <Input
              label="First Name"
              placeholder="Enter your first name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            label={
              <>
                I agree to the{' '}
                <a href="/terms" className="text-decoration-none">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-decoration-none">
                  Privacy Policy
                </a>
              </>
            }
            required
          />
        </Form.Group>

        <Button
          type="submit"
          loading={isLoading}
          className="w-100 py-2"
        >
          Create Account
        </Button>

        <div className="text-center mt-4">
          <p className="text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-decoration-none fw-bold">
              Sign in
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;