import React, { useState, useRef } from 'react';
import { Card, Image, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api/auth';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { getInitials } from '../../utils/formatters';

const ProfileImageUpload: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const updatedUser = await authService.uploadProfileImage(file);
      updateUser(updatedUser);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess('Profile image updated successfully!');

      // Reset progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to upload image');
      setUploadProgress(0);
    } finally {
      setLoading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getProfileImage = () => {
    if (user?.profileImageUrl) {
      return user.profileImageUrl;
    }
    return undefined;
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Profile Picture</h5>
      </Card.Header>
      <Card.Body className="text-center">
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

        <div className="mb-4">
          <div className="position-relative d-inline-block">
            {getProfileImage() ? (
              <Image
                src={getProfileImage()}
                roundedCircle
                width={150}
                height={150}
                className="object-fit-cover border border-white shadow"
                alt="Profile"
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center border border-white shadow"
                style={{
                  width: 150,
                  height: 150,
                  backgroundColor: '#3b82f6',
                  fontSize: '48px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {getInitials(user?.firstName || '', user?.lastName || '')}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-muted small">
            Recommended: Square image, at least 400x400px. Max size: 5MB
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="d-none"
        />

        <Button
          onClick={handleFileSelect}
          loading={loading}
          variant="outline-primary"
          className="mb-3"
        >
          {getProfileImage() ? 'Change Image' : 'Upload Image'}
        </Button>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-3">
            <ProgressBar
              now={uploadProgress}
              label={`${uploadProgress}%`}
              animated
              className="mb-2"
            />
            <p className="text-muted small">Uploading...</p>
          </div>
        )}

        {user?.profileImageUrl && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              // TODO: Implement delete image functionality
              setError('Delete functionality not implemented yet');
            }}
            className="mt-2"
          >
            Remove Image
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileImageUpload;