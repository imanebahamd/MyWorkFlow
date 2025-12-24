import React from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import MainLayout from '../components/layout/MainLayout';
import ProfileForm from '../components/users/ProfileForm';
import ProfileImageUpload from '../components/users/ProfileImageUpload';
import UserInfoCard from '../components/users/UserInfoCard';
import {ShieldCheck} from 'react-bootstrap-icons';

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <Container className="py-5">
        {/* Page Header avec gradient */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-color)]/20 to-[var(--secondary-color)]/20 rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-[var(--primary-color)]" />
            </div>
            <div>
              <h1 className="h2 font-bold text-[var(--text-primary)]">My Profile</h1>
              <p className="text-[var(--text-secondary)]">
                Manage your personal information and profile settings
              </p>
            </div>
          </div>
          
         
        </div>

        <Row className="g-4">
          {/* Left Column */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <ProfileImageUpload />
              <div className="mt-4">
                <UserInfoCard />
              </div>
              
             
            </div>
          </Col>
          
          {/* Right Column */}
          <Col lg={8}>
            <ProfileForm />
            
           
          </Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default ProfilePage;