import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | undefined;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  size, 
  message = 'Loading...' 
}) => {
  if (fullScreen) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF7ED 30%, #FFEDD5 60%, #FB7185 100%)',
        }}
      >
        <div style={{ position: 'relative', textAlign: 'center' }}>
          {/* Mini animated owl */}
          <div 
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              position: 'relative',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Owl body */}
              <ellipse cx="100" cy="120" rx="55" ry="65" fill="#F97316"/>
              
              {/* Head */}
              <circle cx="100" cy="70" r="42" fill="#F97316"/>
              
              {/* Ears */}
              <path d="M 72 42 Q 68 28 77 32" fill="#EA580C"/>
              <path d="M 128 42 Q 132 28 123 32" fill="#EA580C"/>
              
              {/* White eyes */}
              <circle cx="85" cy="70" r="16" fill="#FFFFFF"/>
              <circle cx="115" cy="70" r="16" fill="#FFFFFF"/>
              
              {/* Blinking pupils */}
              <circle cx="85" cy="70" r="7" fill="#1F2933">
                <animate attributeName="r" values="7;7;1;7" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="115" cy="70" r="7" fill="#1F2933">
                <animate attributeName="r" values="7;7;1;7" dur="3s" repeatCount="indefinite"/>
              </circle>
              
              {/* Beak */}
              <path d="M 100 78 L 96 87 L 104 87 Z" fill="#FACC15"/>
              
              {/* Belly */}
              <ellipse cx="100" cy="125" rx="32" ry="38" fill="#FB7185" opacity="0.4"/>
              
              {/* Wings flapping */}
              <ellipse cx="62" cy="115" rx="13" ry="32" fill="#FB7185" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0 62 115;-15 62 115;0 62 115" dur="1.5s" repeatCount="indefinite"/>
              </ellipse>
              <ellipse cx="138" cy="115" rx="13" ry="32" fill="#FB7185" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" values="0 138 115;15 138 115;0 138 115" dur="1.5s" repeatCount="indefinite"/>
              </ellipse>
              
              {/* Legs */}
              <rect x="88" y="172" width="7" height="13" rx="3" fill="#FACC15"/>
              <rect x="105" y="172" width="7" height="13" rx="3" fill="#FACC15"/>
            </svg>
          </div>

          {/* Spinning loader ring */}
          <div 
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              border: '5px solid rgba(249, 115, 22, 0.1)',
              borderTop: '5px solid #F97316',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px',
            }}
          />
          
          {message && (
            <p 
              style={{ 
                color: '#1F2933',
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Animations CSS */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center p-4">
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          border: '2px solid #FED7AA',
          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
        }}
      >
        {/* Mini owl icon */}
        <div style={{ width: '24px', height: '24px' }}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="120" rx="55" ry="65" fill="#F97316"/>
            <circle cx="100" cy="70" r="42" fill="#F97316"/>
            <circle cx="85" cy="70" r="16" fill="#FFFFFF"/>
            <circle cx="115" cy="70" r="16" fill="#FFFFFF"/>
            <circle cx="85" cy="70" r="7" fill="#1F2933">
              <animate attributeName="r" values="7;1;7" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="115" cy="70" r="7" fill="#1F2933">
              <animate attributeName="r" values="7;1;7" dur="2s" repeatCount="indefinite"/>
            </circle>
            <path d="M 100 78 L 96 87 L 104 87 Z" fill="#FACC15"/>
          </svg>
        </div>
        
        <Spinner 
          animation="border" 
          role="status" 
          size={size}
          style={{ color: '#F97316', width: '20px', height: '20px' }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        
        {message && (
          <span 
            style={{ 
              fontSize: '14px',
              fontWeight: '600',
              color: '#1F2933',
            }}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default Loader;