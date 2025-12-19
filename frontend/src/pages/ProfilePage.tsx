import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import ProfileForm from '../components/users/ProfileForm';
import ProfileImageUpload from '../components/users/ProfileImageUpload';
import UserInfoCard from '../components/users/UserInfoCard';

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <Container className="py-4">
        <div className="mb-4">
          <h1 className="h2">My Profile</h1>
          <p className="text-muted">
            Manage your personal information and profile settings
          </p>
        </div>

        <Row>
          <Col lg={4} className="mb-4">
            <ProfileImageUpload />
            <div className="mt-4">
              <UserInfoCard />
            </div>
          </Col>
          
          <Col lg={8}>
            <ProfileForm />
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default ProfilePage;