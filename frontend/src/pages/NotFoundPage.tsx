import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HouseDoor, ArrowLeft, ExclamationTriangle, Search } from 'react-bootstrap-icons';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]/30">
      <Container className="text-center py-5">
        <div className="position-relative mb-5">
          {/* Animated background elements */}
          <div className="position-absolute top-50 start-50 translate-middle w-100 h-100">
            <div className="position-absolute top-0 start-0 w-32 h-32 bg-gradient-to-br from-[var(--primary-color)]/10 to-[var(--secondary-color)]/10 rounded-full blur-2xl"></div>
            <div className="position-absolute bottom-0 end-0 w-40 h-40 bg-gradient-to-tr from-[var(--accent-color)]/10 to-[var(--primary-light)]/10 rounded-full blur-2xl"></div>
          </div>
          
          {/* Main content */}
          <div className="position-relative">
            <div className="mb-4">
              <div className="d-inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[var(--primary-color)]/20 to-[var(--danger-color)]/20 rounded-full mb-4 border-4 border-white shadow-lg">
                <ExclamationTriangle size={64} className="text-[var(--primary-color)]" />
              </div>
              <h1 className="display-1 fw-bold text-gradient bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                404
              </h1>
              <h2 className="h2 mb-3 text-[var(--text-primary)]">Page Not Found</h2>
              <div className="d-inline-flex items-center justify-center gap-2 text-[var(--text-secondary)] mb-4">
                <Search size={20} />
                <p className="mb-0">
                  The page you're looking for might have been removed, had its name changed,
                  or is temporarily unavailable.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="text-decoration-none">
            <Button 
              variant="outline-primary" 
              className="d-flex align-items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium transition-all hover:border-[var(--primary-color)] hover:bg-[var(--bg-hover)]"
            >
              <ArrowLeft className="me-2" />
              Go Back
            </Button>
          </Link>
          <Link to="/dashboard" className="text-decoration-none">
            <Button 
              variant="primary" 
              className="d-flex align-items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-hover)] border-0 font-medium shadow-md hover:shadow-lg transition-all"
            >
              <HouseDoor className="me-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Additional help */}
        <div className="mt-5 pt-4 border-t border-[var(--border-color)]">
          <p className="text-[var(--text-tertiary)] text-sm mb-2">Need help?</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link 
              to="/help" 
              className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] text-sm font-medium transition-colors"
            >
              Visit Help Center
            </Link>
            <span className="text-[var(--text-tertiary)]">•</span>
            <Link 
              to="/contact" 
              className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] text-sm font-medium transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundPage;