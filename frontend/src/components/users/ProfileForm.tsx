import React, { useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api/auth';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import type { UpdateProfileRequest } from '../../types/auth.types';

// Type pour le formulaire - tous les champs sont requis pour TypeScript
interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Créer un schéma Yup qui correspond au type TypeScript
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  currentPassword: yup.string().default(''),
  newPassword: yup.string().default('').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string().default(''),
}).test('password-validation', 'Password validation failed', function(value) {
  const { newPassword, currentPassword, confirmPassword } = value;
  
  // Si un nouveau mot de passe est fourni
  if (newPassword && newPassword.trim().length > 0) {
    // Vérifier que le mot de passe actuel est fourni
    if (!currentPassword || currentPassword.trim().length === 0) {
      return this.createError({
        path: 'currentPassword',
        message: 'Current password is required to change password'
      });
    }
    
    // Vérifier que la confirmation correspond
    if (newPassword !== confirmPassword) {
      return this.createError({
        path: 'confirmPassword',
        message: 'Passwords must match'
      });
    }
  }
  
  // Si un mot de passe actuel est fourni sans nouveau mot de passe
  if (currentPassword && currentPassword.trim().length > 0 && 
      (!newPassword || newPassword.trim().length === 0)) {
    return this.createError({
      path: 'newPassword',
      message: 'New password is required when providing current password'
    });
  }
  
  return true;
});

const ProfileForm: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Préparer les données pour l'API
      const updateData: UpdateProfileRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
      };

      // Ajouter les champs de mot de passe seulement si nécessaire
      if (data.newPassword && data.newPassword.trim().length > 0) {
        updateData.password = data.newPassword;
        updateData.currentPassword = data.currentPassword;
      }

      // Appeler l'API de mise à jour
      const updatedUser = await authService.updateProfile(updateData);
      updateUser(updatedUser);
      
      // Réinitialiser le formulaire avec les nouvelles valeurs
      const resetValues = {
        firstName: updatedUser.firstName || '',
        lastName: updatedUser.lastName || '',
        email: updatedUser.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      
      reset(resetValues);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Profile Information</h5>
      </Card.Header>
      <Card.Body>
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
            disabled
            {...register('email')}
          />

          <hr className="my-4" />
          
          <h6 className="mb-3">Change Password</h6>
          <p className="text-muted small mb-4">
            Leave these fields blank if you don't want to change your password.
          </p>

          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={!isDirty || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProfileForm;