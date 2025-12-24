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
    <div>
      <div 
        className="text-center mb-4"
        style={{
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(254, 215, 170, 0.5)',
        }}
      >
        <h2 
          style={{ 
            fontSize: '26px',
            fontWeight: '700',
            color: '#1F2933',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}
        >
          Sign In
        </h2>
        <p 
          style={{ 
            color: '#52606D',
            fontSize: '14px',
            fontWeight: '500',
            margin: 0,
          }}
        >
          Enter your credentials to access your account
        </p>
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
          placeholder="your.email@example.com"
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


        <Button
          type="submit"
          loading={isLoading}
          className="w-100"
          style={{
            padding: '14px',
            fontSize: '15px',
            marginBottom: '20px',
          }}
        >
          Sign In
        </Button>

        <div 
          className="text-center"
          style={{
            padding: '20px 0 0',
            borderTop: '1px solid rgba(254, 215, 170, 0.5)',
          }}
        >
          <p 
            style={{ 
              color: '#52606D',
              fontSize: '14px',
              fontWeight: '500',
              margin: 0,
            }}
          >
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-decoration-none"
              style={{
                color: '#F97316',
                fontWeight: '700',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#EA580C'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#F97316'}
            >
              Sign up
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;