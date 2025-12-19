import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

interface LoginFormData {
  email: string;
  password: string;
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
});

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="text-center mb-4">
        <h2>Welcome Back</h2>
        <p className="text-muted">Please sign in to your account</p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Check type="checkbox" label="Remember me" />
          <a href="/forgot-password" className="text-decoration-none">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          className="w-100 py-2"
        >
          Sign In
        </Button>

        <div className="text-center mt-4">
          <p className="text-muted">
            Don't have an account?{' '}
            <a href="/register" className="text-decoration-none fw-bold">
              Sign up
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;