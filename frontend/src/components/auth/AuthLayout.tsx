import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: '#FFFFFF',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements - floating colored orbs */}
      <div 
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.05) 40%, transparent 70%)',
          top: '-200px',
          right: '-200px',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 113, 133, 0.2) 0%, rgba(251, 113, 133, 0.08) 40%, transparent 70%)',
          bottom: '-150px',
          left: '-150px',
          filter: 'blur(80px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.12) 0%, rgba(250, 204, 21, 0.04) 40%, transparent 70%)',
          top: '30%',
          right: '15%',
          filter: 'blur(70px)',
          animation: 'float 12s ease-in-out infinite',
        }}
      />

      <Container style={{ maxWidth: '480px', position: 'relative', zIndex: 10 }}>
        <Row className="justify-content-center">
          <Col xs={12}>
            {/* Dynamic Owl Mascot */}
            <div 
              className="text-center mb-4"
              style={{
                animation: 'fadeInDown 0.6s ease-out',
              }}
            >
              <div 
                style={{
                  width: '110px',
                  height: '110px',
                  margin: '0 auto 24px',
                  position: 'relative',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  {/* Owl body */}
                  <ellipse cx="100" cy="120" rx="60" ry="70" fill="#F97316"/>
                  
                  {/* Head */}
                  <circle cx="100" cy="70" r="45" fill="#F97316"/>
                  
                  {/* Ears */}
                  <path d="M 70 40 Q 65 25 75 30" fill="#EA580C"/>
                  <path d="M 130 40 Q 135 25 125 30" fill="#EA580C"/>
                  
                  {/* White eyes */}
                  <circle cx="85" cy="70" r="18" fill="#FFFFFF"/>
                  <circle cx="115" cy="70" r="18" fill="#FFFFFF"/>
                  
                  {/* Animated pupils */}
                  <circle cx="85" cy="70" r="8" fill="#1F2933">
                    <animate attributeName="cx" values="85;88;85;82;85" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="115" cy="70" r="8" fill="#1F2933">
                    <animate attributeName="cx" values="115;118;115;112;115" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Beak */}
                  <path d="M 100 80 L 95 90 L 105 90 Z" fill="#FACC15"/>
                  
                  {/* Belly */}
                  <ellipse cx="100" cy="130" rx="35" ry="40" fill="#FB7185" opacity="0.4"/>
                  
                  {/* Wings */}
                  <ellipse cx="60" cy="120" rx="15" ry="35" fill="#FB7185" opacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" values="0 60 120;-12 60 120;0 60 120" dur="2s" repeatCount="indefinite"/>
                  </ellipse>
                  <ellipse cx="140" cy="120" rx="15" ry="35" fill="#FB7185" opacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" values="0 140 120;12 140 120;0 140 120" dur="2s" repeatCount="indefinite"/>
                  </ellipse>
                  
                  {/* Legs */}
                  <rect x="85" y="175" width="8" height="15" rx="4" fill="#FACC15"/>
                  <rect x="107" y="175" width="8" height="15" rx="4" fill="#FACC15"/>
                </svg>
              </div>
              
              <p 
                className="welcome-text"
                style={{ 
                  fontSize: '13px',
                  fontWeight: '200',
                  margin: 0,
                  lineHeight: '1.7',
                  letterSpacing: '0.3px',
                  fontFamily: '"Inter", sans-serif',
                  color: '#52606D',
                  
                }}
              >
                Hi there, let's turn your{' '}
                <span className="highlight-word" style={{ 
                  
                  color: '#52606D',
                  fontStyle: 'normal',
                }}>
                  plans
                </span>{' '}
                into{' '}
                <span className="highlight-word" style={{ 
               
                  color: '#52606D',
                  fontStyle: 'normal',
                }}>
                  achievements  !
                </span>
                 
              </p>
            </div>
            
            {/* Form card with glassmorphism effect */}
            <Card 
              className="border-0 glass-card"
              style={{
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                animation: 'fadeInUp 0.6s ease-out 0.2s backwards',
              }}
            >
              <Card.Body style={{ padding: '36px' }}>
                {children}
              </Card.Body>
            </Card>
            
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;